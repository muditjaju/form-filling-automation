import { FormData } from "@/components/FormBuilder/FormBuilder.type";

export interface PDFOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  pdfTemplate: {
    id: string;
    name: string;
    fileName: string;
  } | null;
  leadData: FormData;
}
