import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
// Tell pdf.js to use the locally bundled worker file (no CDN)
// @ts-ignore - handled by Vite
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl as unknown as string;

interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName?: string;
  fontSize?: number;
}

type TextContentItem = TextItem | any; // Handle mixed content types

interface PageTextData {
  page: number;
  text: string;
  items: TextContentItem[];
  width: number;
  height: number;
}

/**
 * Extract text content from a PDF file with formatting information
 * @param pdfBlob - The PDF file as a Blob
 * @returns Promise<PageTextData[]> - Array of page text with formatting data
 */
export const extractTextFromPdfWithFormatting = async (pdfBlob: Blob): Promise<PageTextData[]> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise as PDFDocumentProxy;
    
    const pages: PageTextData[] = [];
    const numPages = pdf.numPages;
    
    // Extract text from all pages with formatting
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();
      
      // Sort text items by position (top to bottom, left to right)
      const sortedItems = textContent.items.sort((a: any, b: any) => {
        const aY = a.transform[5];
        const bY = b.transform[5];
        const aX = a.transform[4];
        const bX = b.transform[4];
        
        // First sort by Y position (top to bottom)
        if (Math.abs(aY - bY) > 5) {
          return bY - aY; // Higher Y values are at the top
        }
        // Then sort by X position (left to right)
        return aX - bX;
      });
      
      // Group text items by lines
      const lines: TextItem[][] = [];
      let currentLine: TextItem[] = [];
      let lastY = -1;
      
      sortedItems.forEach((item: any) => {
        const currentY = item.transform[5];
        
        if (lastY === -1 || Math.abs(currentY - lastY) < 5) {
          // Same line
          currentLine.push(item);
        } else {
          // New line
          if (currentLine.length > 0) {
            lines.push([...currentLine]);
          }
          currentLine = [item];
        }
        lastY = currentY;
      });
      
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      
      // Convert lines to text with formatting
      const pageText = lines.map(line => {
        return line.map(item => item.str).join(' ');
      }).join('\n');
      
      pages.push({
        page: pageNum,
        text: pageText,
        items: sortedItems,
        width: viewport.width,
        height: viewport.height
      });
    }
    
    return pages;
  } catch (error) {
    console.error('Error extracting text from PDF with formatting:', error);
    throw new Error('Failed to extract text from PDF. The file might be corrupted or not a valid PDF.');
  }
};

/**
 * Extract text content from a PDF file
 * @param pdfBlob - The PDF file as a Blob
 * @returns Promise<string> - The extracted text content
 */
export const extractTextFromPdf = async (pdfBlob: Blob): Promise<string> => {
  try {
    const pages = await extractTextFromPdfWithFormatting(pdfBlob);
    const fullText = pages.map(page => page.text).join('\n\n');
    
    const trimmedText = fullText.trim();
    
    // Check if we actually extracted any text
    if (!trimmedText || trimmedText.length === 0) {
      throw new Error('No text content found in the PDF. The PDF might be image-based or scanned.');
    }
    
    return trimmedText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    if (error instanceof Error && error.message.includes('No text content found')) {
      throw error;
    }
    throw new Error('Failed to extract text from PDF. The file might be corrupted, password-protected, or not a valid PDF.');
  }
};

/**
 * Extract text content from a PDF file with page numbers
 * @param pdfBlob - The PDF file as a Blob
 * @returns Promise<Array<{page: number, text: string}>> - Array of page text with page numbers
 */
export const extractTextFromPdfWithPages = async (pdfBlob: Blob): Promise<Array<{page: number, text: string}>> => {
  try {
    const pages = await extractTextFromPdfWithFormatting(pdfBlob);
    return pages.map(page => ({
      page: page.page,
      text: page.text
    }));
  } catch (error) {
    console.error('Error extracting text from PDF with pages:', error);
    throw new Error('Failed to extract text from PDF. The file might be corrupted or not a valid PDF.');
  }
};

/**
 * Convert PDF text to CSV format with better structure detection
 * @param text - The extracted text from PDF
 * @param fileName - Original file name
 * @returns string - CSV formatted content
 */
export const convertPdfTextToCsv = (text: string, fileName: string): string => {
  try {
    // Split text into lines
    const lines = text.split('\n').filter(line => line.trim());
    
    // Try to detect if the text has a table-like structure
    const hasCommas = lines.some(line => line.includes(','));
    const hasTabs = lines.some(line => line.includes('\t'));
    
    if (hasCommas || hasTabs) {
      // Text already has some structure, try to preserve it
      return lines.map(line => {
        // Replace multiple spaces with commas if no commas/tabs exist
        if (!hasCommas && !hasTabs) {
          return line.split(/\s+/).join(',');
        }
        return line;
      }).join('\n');
    } else {
      // Simple text, create a basic CSV structure
      const csvLines = [
        'Page,Content',
        ...lines.map((line, index) => `${index + 1},"${line.replace(/"/g, '""')}"`)
      ];
      return csvLines.join('\n');
    }
  } catch (error) {
    console.error('Error converting PDF text to CSV:', error);
    // Fallback to simple CSV
    return `Content\n"${text.replace(/"/g, '""')}"`;
  }
};

/**
 * Convert PDF text to DOCX format with preserved formatting
 * @param text - The extracted text from PDF
 * @param fileName - Original file name
 * @returns string - DOCX-like content with formatting
 */
export const convertPdfTextToDocx = (text: string, fileName: string): string => {
  try {
    // Split text into paragraphs and preserve formatting
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    // Create a document structure with formatting
    const docContent = [
      `Document converted from: ${fileName}`,
      `Conversion date: ${new Date().toLocaleDateString()}`,
      `Total pages: ${paragraphs.length}`,
      '',
      ...paragraphs.map((p, index) => {
        const trimmedP = p.trim();
        // Add page number for better structure
        return `Page ${index + 1}:\n${trimmedP}`;
      })
    ];
    
    return docContent.join('\n\n');
  } catch (error) {
    console.error('Error converting PDF text to DOCX:', error);
    return `Document converted from: ${fileName}\n\n${text}`;
  }
};

/**
 * Convert PDF text to DOC format with preserved formatting
 * @param text - The extracted text from PDF
 * @param fileName - Original file name
 * @returns string - DOC-like content with formatting
 */
export const convertPdfTextToDoc = (text: string, fileName: string): string => {
  try {
    // Split text into paragraphs and preserve formatting
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    // Create a document structure with formatting
    const docContent = [
      `Document: ${fileName}`,
      `Converted on: ${new Date().toLocaleDateString()}`,
      `Total pages: ${paragraphs.length}`,
      '',
      ...paragraphs.map((p, index) => {
        const trimmedP = p.trim();
        // Add page number for better structure
        return `Page ${index + 1}:\n${trimmedP}`;
      })
    ];
    
    return docContent.join('\n\n');
  } catch (error) {
    console.error('Error converting PDF text to DOC:', error);
    return `Document: ${fileName}\n\n${text}`;
  }
};

/**
 * Convert PDF to DOCX with advanced formatting preservation
 * @param pdfBlob - The PDF file as a Blob
 * @param fileName - Original file name
 * @returns Promise<string> - DOCX content with preserved formatting
 */
export const convertPdfToDocxAdvanced = async (pdfBlob: Blob, fileName: string): Promise<string> => {
  try {
    const pages = await extractTextFromPdfWithFormatting(pdfBlob);
    
    const docContent = [
      `Document converted from: ${fileName}`,
      `Conversion date: ${new Date().toLocaleDateString()}`,
      `Total pages: ${pages.length}`,
      '',
      ...pages.map((page, pageIndex) => {
        const pageHeader = `=== Page ${page.page} ===`;
        const pageText = page.text;
        return `${pageHeader}\n${pageText}`;
      })
    ];
    
    return docContent.join('\n\n');
  } catch (error) {
    console.error('Error in advanced PDF to DOCX conversion:', error);
    // Fallback to simple conversion
    const text = await extractTextFromPdf(pdfBlob);
    return convertPdfTextToDocx(text, fileName);
  }
};

/**
 * Convert PDF to DOC with advanced formatting preservation
 * @param pdfBlob - The PDF file as a Blob
 * @param fileName - Original file name
 * @returns Promise<string> - DOC content with preserved formatting
 */
export const convertPdfToDocAdvanced = async (pdfBlob: Blob, fileName: string): Promise<string> => {
  try {
    const pages = await extractTextFromPdfWithFormatting(pdfBlob);
    
    const docContent = [
      `Document: ${fileName}`,
      `Converted on: ${new Date().toLocaleDateString()}`,
      `Total pages: ${pages.length}`,
      '',
      ...pages.map((page, pageIndex) => {
        const pageHeader = `=== Page ${page.page} ===`;
        const pageText = page.text;
        return `${pageHeader}\n${pageText}`;
      })
    ];
    
    return docContent.join('\n\n');
  } catch (error) {
    console.error('Error in advanced PDF to DOC conversion:', error);
    // Fallback to simple conversion
    const text = await extractTextFromPdf(pdfBlob);
    return convertPdfTextToDoc(text, fileName);
  }
};
