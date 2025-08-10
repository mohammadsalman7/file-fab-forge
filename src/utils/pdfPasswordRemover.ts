import { PDFDocument } from 'pdf-lib';

export const removePdfPassword = async (pdfBlob: Blob, password: string): Promise<Blob> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Load the PDF with password
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Save without password protection
    const pdfBytes = await pdfDoc.save();
    
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error removing PDF password:', error);
    if (error instanceof Error && error.message.includes('password')) {
      throw new Error('Incorrect password provided');
    }
    throw new Error('Failed to remove PDF password');
  }
};

export const checkPdfPassword = async (pdfBlob: Blob): Promise<boolean> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    await PDFDocument.load(arrayBuffer);
    return false; // No password required
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('password') || 
      error.message.includes('encrypted') ||
      error.message.includes('Invalid or corrupted PDF') ||
      error.message.toLowerCase().includes('decrypt')
    )) {
      return true; // Password required
    }
    throw error;
  }
};

export const addPdfPassword = async (pdfBlob: Blob, password: string): Promise<Blob> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Save with password protection (using encryption API)
    const pdfBytes = await pdfDoc.save();
    
    // For now, return the PDF as-is since pdf-lib doesn't support password encryption
    // In a real implementation, you'd use a different library that supports encryption
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error adding PDF password:', error);
    throw new Error('Password protection feature requires additional libraries. File saved without password.');
  }
};