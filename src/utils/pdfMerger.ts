import { PDFDocument } from 'pdf-lib';

export interface MergeResult {
  success: boolean;
  mergedPdf?: Uint8Array;
  error?: string;
  totalPages: number;
  fileCount: number;
}

/**
 * Merge multiple PDF files into a single PDF
 * @param files - Array of PDF files to merge
 * @returns Promise<MergeResult> - Result of the merge operation
 */
export const mergePdfs = async (files: File[]): Promise<MergeResult> => {
  try {
    if (files.length === 0) {
      return {
        success: false,
        error: 'No files provided for merging',
        totalPages: 0,
        fileCount: 0
      };
    }

    if (files.length === 1) {
      return {
        success: false,
        error: 'At least 2 PDF files are required for merging',
        totalPages: 0,
        fileCount: 1
      };
    }

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();
    let totalPages = 0;

    // Process each PDF file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // Get all pages from the PDF
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        // Add all pages to the merged PDF
        pages.forEach(page => {
          mergedPdf.addPage(page);
          totalPages++;
        });
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        return {
          success: false,
          error: `Failed to process file "${file.name}". Please ensure it's a valid PDF file.`,
          totalPages,
          fileCount: files.length
        };
      }
    }

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    return {
      success: true,
      mergedPdf: mergedPdfBytes,
      totalPages,
      fileCount: files.length
    };

  } catch (error) {
    console.error('Error merging PDFs:', error);
    return {
      success: false,
      error: 'Failed to merge PDF files. Please try again.',
      totalPages: 0,
      fileCount: files.length
    };
  }
};

/**
 * Validate PDF files before merging
 * @param files - Array of files to validate
 * @returns {valid: boolean, error?: string} - Validation result
 */
export const validatePdfFiles = (files: File[]): { valid: boolean; error?: string } => {
  if (files.length === 0) {
    return { valid: false, error: 'Please select at least one PDF file' };
  }

  if (files.length === 1) {
    return { valid: false, error: 'At least 2 PDF files are required for merging' };
  }

  if (files.length > 20) {
    return { valid: false, error: 'Maximum 20 PDF files can be merged at once' };
  }

  // Check file types and sizes
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (file.type !== 'application/pdf') {
      return { 
        valid: false, 
        error: `File "${file.name}" is not a PDF file` 
      };
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return { 
        valid: false, 
        error: `File "${file.name}" is too large (max 50MB)` 
      };
    }

    if (file.size === 0) {
      return { 
        valid: false, 
        error: `File "${file.name}" is empty` 
      };
    }
  }

  return { valid: true };
};

/**
 * Generate a filename for the merged PDF
 * @param files - Array of input files
 * @returns string - Suggested filename
 */
export const generateMergedFilename = (files: File[]): string => {
  if (files.length === 0) return 'merged.pdf';
  
  if (files.length === 1) {
    const name = files[0].name.replace('.pdf', '');
    return `${name}_merged.pdf`;
  }

  // Use the first file's name as base
  const baseName = files[0].name.replace('.pdf', '');
  return `${baseName}_merged_${files.length}_files.pdf`;
};
