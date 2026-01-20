import { useState, useEffect } from 'react';
import { fillPdf } from '@/lib/pdf-utils';
import { getMappingForPdf } from '@/lib/pdf-mappings';
import { PDFOverlayProps } from './PDFOverlay.type';

export const usePDFOverlay = ({ isOpen, pdfTemplate, leadData }: PDFOverlayProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pdfTemplate && leadData) {
      loadAndFillPdf();
    } else {
      setPdfUrl(null);
    }
  }, [isOpen, pdfTemplate, leadData]);

  const loadAndFillPdf = async () => {
    if (!pdfTemplate) return;
    setIsLoading(true);
    try {
      const mapping = getMappingForPdf(pdfTemplate.id, leadData);
      const url = await fillPdf(`/pdfs/insurance/${pdfTemplate.fileName}`, mapping);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error filling PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl || !pdfTemplate) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${pdfTemplate.id}-${leadData.full_name || 'lead'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    pdfUrl,
    isLoading,
    handleDownload,
  };
};
