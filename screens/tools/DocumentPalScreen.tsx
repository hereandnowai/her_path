import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Language, DocumentExplanation } from '../../types';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { usePdfDownloader } from '../../hooks/usePdfDownloader.ts';
import DownloadButton from '../../components/common/DownloadButton.tsx';

const DocumentPalScreen: React.FC = () => {
  const { translate, language } = useLanguage();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<DocumentExplanation | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const explanationRef = useRef<HTMLDivElement>(null);
  const { downloadPdf, isDownloading } = usePdfDownloader();

  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_API_KEY' });
  
  const handleDownload = () => {
    downloadPdf(explanationRef.current, 'HerPath_Document_Explanation');
  };

  const handleReset = () => {
    setFile(null);
    setFilePreview(null);
    setQuestion('');
    setIsLoading(false);
    setError(null);
    setExplanation(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const cleanupCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => cleanupCamera();
  }, [cleanupCamera]);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setExplanation(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Camera access was denied. Please allow camera permission in your browser settings to use this feature.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera was found. Please ensure your device has a working camera.");
      } else {
        setError("Could not access the camera. Please check permissions.");
      }
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const capturedFile = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
            handleFileChange(capturedFile);
          }
        }, 'image/png');
      }
      cleanupCamera();
    }
  };

  const parseExplanation = (text: string): DocumentExplanation | null => {
    try {
      let jsonStr = text.trim();
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }
      const parsed = JSON.parse(jsonStr);
      if (parsed.summary && parsed.disclaimer) {
        return parsed;
      }
      return null;
    } catch (e) {
      console.error("Failed to parse document explanation JSON:", e, "\nRaw Text:", text);
      return null;
    }
  };

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: {
        mimeType: file.type,
        data: base64EncodedData
      },
    };
  };

  const handleGetExplanation = async () => {
    if (!file) {
      setError("Please upload a document first.");
      return;
    }
    if (!apiKey || apiKey === 'MISSING_API_KEY') {
        setError(translate('apiKeyMissingFeature'));
        return;
    }

    setIsLoading(true);
    setError(null);
    setExplanation(null);

    const languageName = language === Language.HI ? 'Hindi' : language === Language.TA ? 'Tamil' : 'Simple English';
    const systemInstruction = `You are "Document Pal," an AI assistant for the HerPath app. Your audience is women and girls in India, who may have low literacy. Your purpose is to explain complex documents in EXTREMELY simple terms. The user has uploaded an image of a document and may have asked a specific question. Your task is to analyze the document image and the user's question, then provide a clear, simple explanation in the user's chosen language. You MUST provide the output as a single, valid JSON object with the following schema. { "summary": "string", "keyPoints": [ "string", "string", ... ], "actionItems": [ "string", "string", ... ], "importantDates": [ "string", "string", ... ], "disclaimer": "string" }SCHEMA DETAILS (ALL text must be in ${languageName}): - "summary": A very simple 1-2 sentence summary of what the document is. (e.g., "This is a form to open a bank account.", "This is an electricity bill.")- "keyPoints": A list of the most important pieces of information from the document. Each point should be a short, simple sentence. (e.g., "The bill amount is Rs. 500.", "This form asks for your name and address.")- "actionItems": A list of things the user needs to do. Be very clear and direct. (e.g., "You need to sign on the line marked 'Signature'.", "Pay this bill before the 'Due Date'.") If there are no actions, return an empty array [].- "importantDates": A list of important dates mentioned. (e.g., "Due Date: 15th July 2024", "Application Deadline: 30th August 2024"). If there are no dates, return an empty array [].- "disclaimer": Always include this exact disclaimer, translated into ${languageName}: "I am an AI assistant and can make mistakes. For important matters, please show this document to a trusted person or a professional." CRITICAL RULES:1. Analyze Image: Carefully analyze the text in the document image.2. Answer Question: If the user asked a specific question, make sure your explanation directly addresses it within the relevant sections (summary, keyPoints, etc.). If no question was asked, provide a general explanation.3. JSON ONLY: Your entire response MUST be a single, valid JSON object. No extra text, no markdown. Just the raw JSON.4. Simplicity is Key: Use the simplest possible words and sentences.5. Language: All string values in the JSON MUST be in the requested language: ${languageName}.`;

    try {
      const imagePart = await fileToGenerativePart(file);
      const userPrompt = `User's specific question: "${question || 'None'}"\nUser's language: "${languageName}"`;
      const contents = { parts: [imagePart, { text: userPrompt }] };
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents,
        config: {
            systemInstruction,
            responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      const parsedExplanation = parseExplanation(responseText);

      if (parsedExplanation) {
        setExplanation(parsedExplanation);
      } else {
        setError(translate('explanationParseError', "Sorry, I had trouble understanding the AI's response. Please try again."));
      }
    } catch (err: any) {
      console.error("Gemini API error (Document Pal):", err);
      setError(`${translate('explanationError')} (${err.message || 'Unknown error'})`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderExplanation = () => {
    if (!explanation) return null;

    return (
      <Card className="shadow-2xl bg-white animate-fade-in">
        <div className="p-6 md:p-8">
          <h3 className="text-2xl font-bold text-teal-700 mb-4">{translate('documentExplanation')}</h3>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><i className="fas fa-file-alt text-teal-500 mr-3"></i>{translate('summary')}</h4>
              <p>{explanation.summary}</p>
            </div>
            
            {explanation.keyPoints?.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><i className="fas fa-star text-amber-500 mr-3"></i>{translate('keyPoints')}</h4>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  {explanation.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
                </ul>
              </div>
            )}

            {explanation.actionItems?.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><i className="fas fa-pencil-alt text-blue-500 mr-3"></i>{translate('actionItems')}</h4>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  {explanation.actionItems.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
            )}
            
            {explanation.importantDates?.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><i className="fas fa-calendar-alt text-red-500 mr-3"></i>{translate('importantDates')}</h4>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  {explanation.importantDates.map((date, index) => <li key={index}>{date}</li>)}
                </ul>
              </div>
            )}
            
            <blockquote className="mt-8 p-4 bg-gray-100 border-l-4 border-gray-400 text-gray-600 italic text-sm">
                <strong>{translate('disclaimer')}:</strong> {explanation.disclaimer}
            </blockquote>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
            <Button onClick={handleReset} variant="secondary">
                <i className="fas fa-redo mr-2"></i>
                {translate('startOver', 'Start Over')}
            </Button>
            <DownloadButton onClick={handleDownload} isLoading={isDownloading} className="!mt-0" />
        </div>
      </Card>
    );
  };

  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
        <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg h-auto rounded-lg shadow-lg"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="mt-4 flex space-x-4">
          <Button onClick={handleCapture} size="lg"><i className="fas fa-camera mr-2"></i>{translate('capture')}</Button>
          <Button onClick={cleanupCamera} size="lg" variant="secondary">{translate('cancel')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionTitle title={translate('documentPalTitle')} subtitle={translate('documentPalSubtitle')} />
      
      {!explanation && (
        <Card className="mb-8 p-6">
          {!filePreview ? (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{translate('uploadInstruction')}</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <i className="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">Drag & drop your file here, or use the buttons below.</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                className="hidden"
                accept="image/*"
              />
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button onClick={() => fileInputRef.current?.click()} fullWidth leftIcon={<i className="fas fa-file-upload"></i>}>
                  {translate('selectFile')}
                </Button>
                <Button onClick={openCamera} fullWidth variant="secondary" leftIcon={<i className="fas fa-camera-retro"></i>}>
                  {translate('takePhoto')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 text-center">
                <img src={filePreview} alt="Document Preview" className="max-w-full max-h-80 mx-auto rounded-lg shadow-md" />
              </div>
              <Button onClick={handleReset} variant="danger" fullWidth className="my-2">
                <i className="fas fa-times mr-2"></i>
                {translate('changeDocument', 'Change Document')}
              </Button>
              <Input
                id="docQuestion"
                label={translate('askAboutDocument')}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={translate('askAboutDocumentPlaceholder')}
                wrapperClassName="mt-4"
              />
              <Button onClick={handleGetExplanation} disabled={isLoading} fullWidth size="lg" className="mt-4">
                {isLoading ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i>{translate('generatingExplanation')}</>
                ) : (
                  <><i className="fas fa-lightbulb mr-2"></i>{translate('getExplanation')}</>
                )}
              </Button>
              {(!apiKey || apiKey === "MISSING_API_KEY") && <p role="alert" className="text-red-500 text-sm text-center mt-2">{translate('apiKeyMissingFeature')}</p>}
            </>
          )}
        </Card>
      )}

      {isLoading && (
        <div role="status" className="text-center py-8">
          <i className="fas fa-spinner fa-spin text-4xl text-teal-600" aria-hidden="true"></i>
          <p className="mt-2 text-lg text-gray-600">{translate('generatingExplanation')}</p>
        </div>
      )}

      {error && (
        <Card className="bg-red-50 border-l-4 border-red-500 p-4 my-4" role="alert">
          <p className="text-red-700 font-semibold">{error}</p>
        </Card>
      )}
      
      {explanation && (
         <div className="mt-10" ref={explanationRef}>
            {renderExplanation()}
         </div>
      )}
    </div>
  );
};

export default DocumentPalScreen;