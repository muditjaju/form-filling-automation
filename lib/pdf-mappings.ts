import { FormData } from "@/components/FormBuilder/FormBuilder.type";

export interface PDFMapping {
  [pdfFieldName: string]: string;
}

/**
 * CUSTOM MAPPING LOGIC
 * For each insurance company, we return a simple object where:
 * KEY = The exact field name in the PDF
 * VALUE = The data from customer record
 */
const getDemoMapping = (data: FormData): PDFMapping => ({

  'Name': data.firstName + (data.middleName ? " " + data.middleName : "") || '',
});

/**
 * Dispatcher: Add new insurance companies here
 */
export const getMappingForPdf = (pdfId: string, data: FormData): PDFMapping => {
  switch (pdfId) {
    case 'demo-pdf': return getDemoMapping(data);
    default: return {};
  }
};

export const pdfTemplates = [
  { id: 'demo-pdf', name: 'Demo Insurance PDF', fileName: 'demo-pdf.pdf' }
];
