
import React, { useState, useRef, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import { useLanguage } from '../../contexts/LanguageContext';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatInputProps {
  onSendMessage: (message: { text: string; file: File | null }) => void;
  isLoading: boolean;
  placeholder: string;
  apiKeyAvailable: boolean;
  showAttachmentButton?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, placeholder, apiKeyAvailable, showAttachmentButton = true }) => {
  const { translate, language } = useLanguage();
  const [textInput, setTextInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const handleMicClick = () => {
    if (isLoading || !apiKeyAvailable) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        alert("Sorry, your browser doesn't support speech recognition.");
      }
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };
  
  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    setFilePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const isSubmitDisabled = isLoading || (!textInput.trim() && !(showAttachmentButton && attachedFile)) || !apiKeyAvailable;

  const doSend = () => {
    if (isSubmitDisabled) return;
    
    onSendMessage({ text: textInput, file: attachedFile });
    
    setTextInput('');
    setAttachedFile(null);
    setFilePreview(null);
     if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSend();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  };

  return (
    <div className="p-4 pt-0">
      {showAttachmentButton && attachedFile && (
        <div className="relative inline-block mb-2 p-2 bg-gray-100 border rounded-lg">
          {filePreview ? (
            <img src={filePreview} alt="Preview" className="h-20 w-auto rounded" />
          ) : (
            <div className="h-20 flex items-center p-2">
                <i className="fas fa-file-alt text-4xl text-gray-500 mr-2"></i>
                <span className="text-sm text-gray-700 max-w-xs truncate">{attachedFile.name}</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemoveAttachment}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold leading-none"
            aria-label="Remove attachment"
          >
            &times;
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
         {showAttachmentButton && (
            <>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                />
                <Button
                    type="button"
                    onClick={handleAttachClick}
                    disabled={isLoading || !apiKeyAvailable}
                    variant="secondary"
                    className="!p-3 rounded-full"
                    aria-label={translate('attachFile')}
                >
                    <i className="fas fa-plus"></i>
                </Button>
            </>
         )}
        <Input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-grow !mb-0"
          wrapperClassName="flex-grow !mb-0"
          disabled={isLoading || !apiKeyAvailable}
          aria-label={placeholder}
        />
        <Button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading || !apiKeyAvailable || !recognitionRef.current}
            variant="secondary"
            className={`!p-3 rounded-full ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
            <i className="fas fa-microphone"></i>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          aria-label={translate('send')}
          className="px-4"
        >
          <i className="fas fa-paper-plane"></i>
          <span className="sr-only">{translate('send')}</span>
        </Button>
      </form>
      {!apiKeyAvailable && (
        <p role="alert" className="text-red-500 text-xs text-center mt-1 px-4">
          {translate('apiKeyMissingChat')}
        </p>
      )}
    </div>
  );
};

export default ChatInput;