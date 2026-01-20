import { useState } from 'react';
import { pdfTemplates } from '@/lib/pdf-mappings';

export const usePDFManager = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = pdfTemplates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPdf = (template: any) => {
    setSelectedTemplate(template);
    setIsOverlayOpen(true);
  };

  return {
    selectedTemplate,
    isOverlayOpen,
    setIsOverlayOpen,
    searchQuery,
    setSearchQuery,
    filteredTemplates,
    handleOpenPdf,
  };
};
