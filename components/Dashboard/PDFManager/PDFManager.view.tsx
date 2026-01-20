'use client';

import { ChevronRight, FileText, Search } from 'lucide-react';
import React from 'react';
import { PDFOverlay } from '../PDFOverlay/PDFOverlay.view';
import { PDFManagerProps } from './PDFManager.type';
import { usePDFManager } from './PDFManager.controller';

export const PDFManager: React.FC<PDFManagerProps> = ({ lead }) => {
  const {
    selectedTemplate,
    isOverlayOpen,
    setIsOverlayOpen,
    searchQuery,
    setSearchQuery,
    filteredTemplates,
    handleOpenPdf,
  } = usePDFManager();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
        </div>

        <div className="grid gap-3">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id}
              onClick={() => handleOpenPdf(template)}
              className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">{template.name}</h4>
                  <p className="text-xs text-zinc-500">Insurance Submission Form</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-300 dark:text-zinc-700 group-hover:text-indigo-500 transition-colors" />
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
              <p className="text-zinc-500">No matching templates found.</p>
            </div>
          )}
        </div>
      </div>

      <PDFOverlay 
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        pdfTemplate={selectedTemplate}
        leadData={lead.data || {}}
      />
    </div>
  );
};
