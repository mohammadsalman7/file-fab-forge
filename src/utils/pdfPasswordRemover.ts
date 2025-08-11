import { PDFDocument } from 'pdf-lib';

export const removePdfPassword = async (pdfBlob: Blob, password: string): Promise<Blob> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Try to load with password first
    let pdfDoc: PDFDocument;
    try {
      // First try without password
      pdfDoc = await PDFDocument.load(arrayBuffer);
      throw new Error('PDF is not password protected');
    } catch (loadError) {
      // If loading without password fails, it might be encrypted
      // pdf-lib doesn't support password-protected PDFs directly
      // This is a limitation of the pdf-lib library
      throw new Error('This PDF appears to be password protected. pdf-lib library does not support password removal. Please use a different tool or library.');
    }
  } catch (error) {
    console.error('Error removing PDF password:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to remove PDF password');
  }
};

export const checkPdfPassword = async (pdfBlob: Blob): Promise<boolean> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Check if the PDF starts with encrypted content indicators
    const bytes = new Uint8Array(arrayBuffer);
    const pdfHeader = new TextDecoder().decode(bytes.slice(0, 1024));
    
    // Look for encryption indicators in the PDF header
    if (pdfHeader.includes('/Encrypt') || pdfHeader.includes('/Filter')) {
      return true; // Likely encrypted
    }
    
    // Try to load the PDF
    await PDFDocument.load(arrayBuffer);
    return false; // No password required
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('password') || 
          errorMessage.includes('encrypted') ||
          errorMessage.includes('decrypt') ||
          errorMessage.includes('bad decrypt') ||
          errorMessage.includes('invalid xref') ||
          errorMessage.includes('corrupted')) {
        return true; // Password required
      }
    }
    // If it's any other error, try to determine if it's password related
    console.warn('PDF loading failed:', error);
    return true; // Assume password protected for safety
  }
};

export const addPdfPassword = async (pdfBlob: Blob, password: string): Promise<Blob> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // pdf-lib doesn't support adding password protection
    // This would require a different library like PDF-lib with encryption support
    const pdfBytes = await pdfDoc.save();
    
    // Note: This doesn't actually add password protection
    throw new Error('Password protection feature is not available with current PDF library. The file will be saved without password protection.');
  } catch (error) {
    console.error('Error adding PDF password:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to add PDF password');
  }
};
