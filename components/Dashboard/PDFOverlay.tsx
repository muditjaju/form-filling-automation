'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { fillPdf } from '@/lib/pdf-utils';
import { getMappingForPdf } from '@/lib/pdf-mappings';
import { FormData } from '../FormBuilder/FormBuilder.type';

interface PDFOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  pdfTemplate: {
    id: string;
    name: string;
    fileName: string;
  } | null;
  leadData: FormData;
}

export const PDFOverlay: React.FC<PDFOverlayProps> = ({ isOpen, onClose, pdfTemplate, leadData }) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden border-zinc-200 dark:border-zinc-800">
        <DialogHeader className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {pdfTemplate?.name}
            </DialogTitle>
            <p className="text-sm text-zinc-500 mt-1">
              Filled with customer data
            </p>
          </div>
          {/* <Button 
            onClick={handleDownload} 
            disabled={!pdfUrl || isLoading}
            className="rounded-xl"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button> */}
        </DialogHeader>

        <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center relative">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-zinc-500 font-medium">Filling PDF details...</p>
            </div>
          ) : pdfUrl ? (
            <iframe 
              src={pdfUrl} 
              className="w-full h-full border-none"
              title="PDF Preview"
            />
          ) : (
            <p className="text-zinc-500">Failed to load preview.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
