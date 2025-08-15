import { PDFDocument } from 'pdf-lib';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Detect whether a PDF requires a password using PDF.js
// Configure PDF.js worker once
if (typeof window !== 'undefined' && pdfjsWorkerSrc) {
  GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;
}

export const checkPdfPassword = async (pdfBlob: Blob): Promise<boolean> => {
  const arrayBuffer = await pdfBlob.arrayBuffer();
  try {
    const loadingTask = getDocument({ data: arrayBuffer });
    await loadingTask.promise;
    return false;
  } catch (error: unknown) {
    const maybeErr = error as { name?: string; message?: string };
    if (maybeErr?.name === 'PasswordException' || maybeErr?.message?.toLowerCase().includes('password')) {
      return true;
    }
    // Other errors mean the file is corrupt or unsupported
    throw error;
  }
};

// Remove password by opening with PDF.js (using the provided password),
// then rasterizing each page into a new, unprotected PDF via pdf-lib.
export const removePdfPassword = async (pdfBlob: Blob, password: string): Promise<Blob> => {
  if (!password?.trim()) {
    throw new Error('Password is required');
  }

  const arrayBuffer = await pdfBlob.arrayBuffer();

  // Open encrypted PDF with PDF.js
  let pdf: PDFDocumentProxy | undefined;
  try {
    const loadingTask = getDocument({ data: arrayBuffer, password });
    pdf = await loadingTask.promise;
  } catch (error: unknown) {
    const maybeErr = error as { name?: string; message?: string };
    if (maybeErr?.name === 'PasswordException' || maybeErr?.message?.toLowerCase().includes('password')) {
      throw new Error('Incorrect password provided');
    }
    console.error('Error opening PDF with PDF.js:', error);
    throw new Error('Failed to open PDF');
  }

  try {
    const newPdf = await PDFDocument.create();
    const pageCount = pdf.numPages as number;

    for (let pageIndex = 1; pageIndex <= pageCount; pageIndex += 1) {
      const page = await pdf.getPage(pageIndex);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      await (page as any).render({ canvasContext: ctx, viewport, canvas } as any).promise;

      const imageBlob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Failed to render page'))), 'image/png');
      });

      const imageBytes = new Uint8Array(await imageBlob.arrayBuffer());
      const embeddedPng = await newPdf.embedPng(imageBytes);
      const pdfPage = newPdf.addPage([embeddedPng.width, embeddedPng.height]);
      pdfPage.drawImage(embeddedPng, {
        x: 0,
        y: 0,
        width: embeddedPng.width,
        height: embeddedPng.height,
      });
    }

    const unlockedBytes = await newPdf.save();
    return new Blob([new Uint8Array(unlockedBytes)], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error removing PDF password (rasterize):', error);
    throw new Error('Failed to remove PDF password');
  } finally {
    try { pdf?.destroy?.(); } catch {}
  }
};

// Adding password encryption in-browser is not supported with current deps
// Note: addPdfPassword moved to `src/utils/pdfProtector.ts`
