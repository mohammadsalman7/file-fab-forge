import { createTextPdf } from './pdfConverter';

/**
 * Sanitize text to remove or replace characters that PDF-lib can't encode
 * @param text - Raw text content
 * @returns string - Sanitized text safe for PDF creation
 */
const sanitizeTextForPdf = (text: string): string => {
  if (!text) return '';
  
  return text
    // Replace common problematic characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ') // Control characters
    .replace(/[\u2028\u2029]/g, '\n') // Line/paragraph separators
    .replace(/[\u00A0]/g, ' ') // Non-breaking space
    .replace(/[\u2000-\u200F\u202F]/g, ' ') // Various space characters
    .replace(/[\u2060]/g, '') // Word joiner
    .replace(/[\uFEFF]/g, '') // Zero width no-break space
    // Replace other problematic Unicode characters
    .replace(/[^\x00-\x7F\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF]/g, ' ')
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
};

/**
 * Convert Word document to PDF with enhanced error handling
 * @param file - The Word document file (DOC/DOCX)
 * @returns Promise<Blob> - PDF blob
 */
export const convertWordToPdf = async (file: File): Promise<Blob> => {
  try {
    console.log('Starting Word to PDF conversion for:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    // Validate file type
    if (!file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
      throw new Error(`Unsupported file type: ${file.name}. Only .doc and .docx files are supported.`);
    }

    // Extract text content from Word document
    let content = '';
    
    try {
      console.log('Loading mammoth library...');
      const mammoth = await import('mammoth');
      console.log('Mammoth loaded successfully');

      console.log('Converting file to array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('Array buffer created, size:', arrayBuffer.byteLength);

      console.log('Extracting text with mammoth...');
      const result = await mammoth.extractRawText({ arrayBuffer });
      content = result.value || '';
      console.log('Extracted content length:', content.length);
      console.log('Content preview:', content.substring(0, 200));

      // Check if content is empty
      if (!content.trim()) {
        console.warn('Extracted content is empty, using fallback content');
        content = `Document: ${file.name}\n\nThis document appears to be empty or could not be processed.\n\nConversion date: ${new Date().toLocaleDateString()}`;
      }

    } catch (mammothError: any) {
      console.error('Error extracting Word content with mammoth:', mammothError);
      
      // Fallback content if mammoth fails
      content = `Document: ${file.name}\n\nError: Could not extract content from this Word document.\n\nPossible reasons:\n- File might be corrupted\n- File might be password protected\n- File format not supported\n\nError details: ${mammothError.message}\n\nConversion date: ${new Date().toLocaleDateString()}`;
    }

    // Sanitize content for PDF creation
    console.log('Sanitizing text for PDF creation...');
    const sanitizedContent = sanitizeTextForPdf(content);
    console.log('Sanitized content length:', sanitizedContent.length);
    console.log('Sanitized content preview:', sanitizedContent.substring(0, 200));

    // Convert text to PDF
    console.log('Converting sanitized text to PDF...');
    const pdfBlob = await createTextPdf(sanitizedContent, file.name);
    console.log('PDF creation completed successfully');
    console.log('PDF blob size:', pdfBlob.size);

    return pdfBlob;

  } catch (error: any) {
    console.error('Error in Word to PDF conversion:', error);
    
    // Create a fallback PDF with error information
    const fallbackContent = sanitizeTextForPdf(`Error converting ${file.name} to PDF\n\nError: ${error.message}\n\nPlease try:\n- Checking if the file is not corrupted\n- Ensuring the file is not password protected\n- Using a different Word document\n\nConversion date: ${new Date().toLocaleDateString()}`);
    
    try {
      const fallbackPdf = await createTextPdf(fallbackContent, `Error - ${file.name}`);
      return fallbackPdf;
    } catch (fallbackError) {
      console.error('Even fallback PDF creation failed:', fallbackError);
      throw new Error(`Failed to convert Word document to PDF: ${error.message}`);
    }
  }
};

/**
 * Enhanced Word to PDF conversion with progress tracking
 * @param file - The Word document file
 * @param onProgress - Progress callback function
 * @returns Promise<Blob> - PDF blob
 */
export const convertWordToPdfWithProgress = async (
  file: File, 
  onProgress?: (message: string) => void
): Promise<Blob> => {
  try {
    onProgress?.('Starting Word to PDF conversion...');
    
    // Validate file
    onProgress?.('Validating file...');
    if (!file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
      throw new Error(`Unsupported file type: ${file.name}`);
    }

    // Extract text
    onProgress?.('Extracting text from Word document...');
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const content = result.value || `Document content from ${file.name}`;

    // Sanitize content
    onProgress?.('Processing text for PDF creation...');
    const sanitizedContent = sanitizeTextForPdf(content);

    // Create PDF
    onProgress?.('Creating PDF document...');
    const pdfBlob = await createTextPdf(sanitizedContent, file.name);
    
    onProgress?.('Conversion completed successfully!');
    return pdfBlob;

  } catch (error: any) {
    console.error('Word to PDF conversion failed:', error);
    onProgress?.(`Error: ${error.message}`);
    throw error;
  }
};
