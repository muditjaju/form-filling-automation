'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { PDFOverlayProps } from './PDFOverlay.type';
import { usePDFOverlay } from './PDFOverlay.controller';

export const PDFOverlay: React.FC<PDFOverlayProps> = (props) => {
  const { pdfUrl, isLoading } = usePDFOverlay(props);

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden border-zinc-200 dark:border-zinc-800">
        <DialogHeader className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {props.pdfTemplate?.name}
            </DialogTitle>
            <p className="text-sm text-zinc-500 mt-1">
              Filled with customer data
            </p>
          </div>
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
