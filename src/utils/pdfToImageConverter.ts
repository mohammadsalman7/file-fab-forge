import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
// Tell pdf.js to use the locally bundled worker file (no CDN)
// @ts-ignore - handled by Vite
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl as unknown as string;

export interface PageImage {
  pageNumber: number;
  imageBlob: Blob;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface ConversionProgress {
  currentPage: number;
  totalPages: number;
  percentage: number;
  status: 'preparing' | 'converting' | 'completed' | 'error' | 'cancelled';
  message: string;
}

export interface ConversionOptions {
  dpi: number; // Target DPI (150-300)
  onProgress?: (progress: ConversionProgress) => void;
  onCancel?: () => boolean; // Return true to cancel
}

/**
 * Calculate scale factor for target DPI
 * @param dpi - Target DPI (150-300)
 * @returns Scale factor for PDF.js rendering
 */
const calculateScaleForDPI = (dpi: number): number => {
  // PDF.js uses 72 DPI as base, so scale = target_dpi / 72
  return Math.max(150, Math.min(300, dpi)) / 72;
};

/**
 * Get slide layout based on aspect ratio
 * @param aspectRatio - Width/Height ratio
 * @returns Slide layout type
 */
export const getSlideLayout = (aspectRatio: number): 'LAYOUT_16x9' | 'LAYOUT_4x3' => {
  // 16:9 = 1.778, 4:3 = 1.333
  // Use 16:9 for wider aspect ratios, 4:3 for taller ones
  return aspectRatio >= 1.5 ? 'LAYOUT_16x9' : 'LAYOUT_4x3';
};

/**
 * Convert PDF pages to images using canvas rendering with high DPI support
 * @param pdfBlob - The PDF file as a Blob
 * @param options - Conversion options including DPI and progress callbacks
 * @returns Promise<PageImage[]> - Array of page images with metadata
 */
export const convertPdfPagesToImages = async (
  pdfBlob: Blob, 
  options: ConversionOptions
): Promise<PageImage[]> => {
  const { dpi, onProgress, onCancel } = options;
  const scale = calculateScaleForDPI(dpi);
  
  let pdf: PDFDocumentProxy | null = null;
  
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    pdf = await loadingTask.promise as PDFDocumentProxy;
    
    const pageImages: PageImage[] = [];
    const numPages = pdf.numPages;
    
    // Update progress - preparing
    onProgress?.({
      currentPage: 0,
      totalPages: numPages,
      percentage: 0,
      status: 'preparing',
      message: `Preparing to convert ${numPages} pages at ${dpi} DPI...`
    });
    
    console.log(`Converting ${numPages} PDF pages to images at ${dpi} DPI (scale: ${scale.toFixed(2)})`);
    
    // Convert each page to image sequentially to save memory
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      // Check for cancellation
      if (onCancel?.()) {
        onProgress?.({
          currentPage: pageNum - 1,
          totalPages: numPages,
          percentage: ((pageNum - 1) / numPages) * 100,
          status: 'cancelled',
          message: 'Conversion cancelled by user'
        });
        throw new Error('Conversion cancelled');
      }
      
      // Update progress
      onProgress?.({
        currentPage: pageNum,
        totalPages: numPages,
        percentage: (pageNum / numPages) * 100,
        status: 'converting',
        message: `Converting Page ${pageNum}/${numPages}...`
      });
      
      console.log(`Processing page ${pageNum}/${numPages}`);
      
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Canvas context not supported');
      }
      
      // Set canvas dimensions
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      
      // Set white background
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext as any).promise;
      
      // Convert canvas to blob
      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error(`Failed to convert page ${pageNum} to image`));
            }
          },
          'image/png',
          1.0 // Maximum quality
        );
      });
      
      // Calculate aspect ratio
      const aspectRatio = canvas.width / canvas.height;
      
      pageImages.push({
        pageNumber: pageNum,
        imageBlob,
        width: canvas.width,
        height: canvas.height,
        aspectRatio
      });
      
      // Clear canvas to free memory
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
    }
    
    // Update progress - completed
    onProgress?.({
      currentPage: numPages,
      totalPages: numPages,
      percentage: 100,
      status: 'completed',
      message: `Successfully converted ${pageImages.length} pages to images`
    });
    
    console.log(`Successfully converted ${pageImages.length} pages to images at ${dpi} DPI`);
    return pageImages;
    
  } catch (error) {
    console.error('Error converting PDF pages to images:', error);
    
    // Update progress - error
    onProgress?.({
      currentPage: 0,
      totalPages: 0,
      percentage: 0,
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to convert PDF pages to images'
    });
    
    throw new Error('Failed to convert PDF pages to images. The file might be corrupted or not a valid PDF.');
  } finally {
    // Clean up PDF document
    if (pdf) {
      try {
        pdf.destroy();
      } catch (e) {
        console.warn('Error destroying PDF document:', e);
      }
    }
  }
};

/**
 * Convert a single PDF page to image
 * @param pdfBlob - The PDF file as a Blob
 * @param pageNumber - Page number to convert (1-based)
 * @param dpi - Target DPI (150-300)
 * @returns Promise<PageImage> - Page image with metadata
 */
export const convertPdfPageToImage = async (
  pdfBlob: Blob, 
  pageNumber: number = 1,
  dpi: number = 200
): Promise<PageImage> => {
  const scale = calculateScaleForDPI(dpi);
  
  let pdf: PDFDocumentProxy | null = null;
  
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    pdf = await loadingTask.promise as PDFDocumentProxy;
    
    if (pageNumber < 1 || pageNumber > pdf.numPages) {
      throw new Error(`Invalid page number. PDF has ${pdf.numPages} pages.`);
    }
    
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    
    // Create canvas for rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Canvas context not supported');
    }
    
    // Set canvas dimensions
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    
    // Set white background
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext as any).promise;
    
    // Convert canvas to blob
    const imageBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error(`Failed to convert page ${pageNumber} to image`));
          }
        },
        'image/png',
        1.0 // Maximum quality
      );
    });
    
    // Calculate aspect ratio
    const aspectRatio = canvas.width / canvas.height;
    
    return {
      pageNumber,
      imageBlob,
      width: canvas.width,
      height: canvas.height,
      aspectRatio
    };
    
  } catch (error) {
    console.error('Error converting PDF page to image:', error);
    throw new Error('Failed to convert PDF page to image. The file might be corrupted or not a valid PDF.');
  } finally {
    // Clean up PDF document
    if (pdf) {
      try {
        pdf.destroy();
      } catch (e) {
        console.warn('Error destroying PDF document:', e);
      }
    }
  }
};

/**
 * Get PDF metadata without converting to images
 * @param pdfBlob - The PDF file as a Blob
 * @returns Promise<{numPages: number, pageSizes: Array<{width: number, height: number, aspectRatio: number}>}>
 */
export const getPdfMetadata = async (pdfBlob: Blob): Promise<{
  numPages: number;
  pageSizes: Array<{width: number, height: number, aspectRatio: number}>;
}> => {
  let pdf: PDFDocumentProxy | null = null;
  
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    pdf = await loadingTask.promise as PDFDocumentProxy;
    
    const pageSizes: Array<{width: number, height: number, aspectRatio: number}> = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const aspectRatio = viewport.width / viewport.height;
      
      pageSizes.push({
        width: viewport.width,
        height: viewport.height,
        aspectRatio
      });
    }
    
    return {
      numPages: pdf.numPages,
      pageSizes
    };
    
  } catch (error) {
    console.error('Error getting PDF metadata:', error);
    throw new Error('Failed to get PDF metadata. The file might be corrupted or not a valid PDF.');
  } finally {
    // Clean up PDF document
    if (pdf) {
      try {
        pdf.destroy();
      } catch (e) {
        console.warn('Error destroying PDF document:', e);
      }
    }
  }
};
