import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePdfDownloader = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPdf = async (element: HTMLElement | null, filename: string) => {
        if (!element) {
            console.error("Download target element is null");
            return;
        }
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 2, // for better quality
                useCORS: true,
                onclone: (doc) => {
                    // Make sure all accordions are open in the clone
                    doc.querySelectorAll('details').forEach(d => d.open = true);
                }
            });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a4'); // portrait, mm, a4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = imgProps.width;
            const imgHeight = imgProps.height;
            
            const ratio = pdfWidth / imgWidth;
            const calculatedHeight = imgHeight * ratio;

            let heightLeft = calculatedHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
              position -= pdfHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
              heightLeft -= pdfHeight;
            }
            pdf.save(`${filename}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };
    return { downloadPdf, isDownloading };
};
