import { PDFDocument } from 'pdf-lib';
import { PDFMapping } from './pdf-mappings';

/**
 * Loads a PDF from a given URL, fills its form fields based on the provided mapping,
 * and returns a Blob URL of the generated PDF.
 */
export async function fillPdf(pdfUrl: string, mapping: PDFMapping): Promise<string> {
  // Fetch the PDF
  const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes, {
    ignoreEncryption: true,
  });

  // Get the form containing all the fields
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  console.log('PDF Field Names:', fields.map(f => f.getName()));

  // Fill the fields
  Object.entries(mapping).forEach(([fieldName, value]) => {
    try {
      const field = form.getField(fieldName);
      if (field && 'setText' in field) {
        (field as any).setText(String(value ?? ''));
      }
    } catch (error) {
      console.warn(`Could not fill field ${fieldName}:`, error);
    }
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // To fix the "Uint8Array<ArrayBufferLike> is not assignable to BlobPart" error correctly,
  // we ensure we have a standard ArrayBuffer by copying the bytes.
  // This satisfies strict TypeScript definitions and handles potential SharedArrayBuffer issues.
  const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
  new Uint8Array(pdfBuffer).set(pdfBytes);

  // Create a Blob from the proper ArrayBuffer
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

  // Create a URL for the Blob
  return URL.createObjectURL(blob);
}
