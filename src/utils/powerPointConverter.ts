import { extractTextFromPdf } from './pdfTextExtractor';
import { convertPdfPagesToImages, type PageImage } from './pdfToImageConverter';

interface SlideContent {
  title: string;
  content: string[];
  type: 'title' | 'content' | 'bullet' | 'image';
  imageBlob?: Blob; // For image-based slides
}

interface PresentationData {
  title: string;
  slides: SlideContent[];
  metadata: {
    author: string;
    date: string;
    totalSlides: number;
    fileName: string;
  };
}

/**
 * Convert Word/DOC content to PowerPoint presentation structure
 * @param content - The text content from Word/DOC file
 * @param fileName - Original file name
 * @returns PresentationData - Structured presentation data
 */
export const convertWordToPowerPoint = (content: string, fileName: string): PresentationData => {
  try {
    const lines = content.split('\n').filter(line => line.trim());
    const slides: SlideContent[] = [];
    
    // Create title slide
    slides.push({
      title: `Converted from: ${fileName}`,
      content: [
        `Original file: ${fileName}`,
        `Conversion date: ${new Date().toLocaleDateString()}`,
        `Total content lines: ${lines.length}`
      ],
      type: 'title'
    });

    // Process content into slides
    let currentSlide: SlideContent | null = null;
    let slideCounter = 1;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Check if this line could be a slide title (starts with number, is short, or has specific patterns)
      const isTitle = (
        trimmedLine.length < 100 && 
        (trimmedLine.match(/^\d+\./) || 
         trimmedLine.match(/^[A-Z][^.!?]*$/) ||
         trimmedLine.length < 50)
      );

      if (isTitle && slideCounter < 10) { // Limit to 10 slides for better structure
        if (currentSlide) {
          slides.push(currentSlide);
        }
        currentSlide = {
          title: trimmedLine,
          content: [],
          type: 'content'
        };
        slideCounter++;
      } else if (currentSlide) {
        currentSlide.content.push(trimmedLine);
      } else {
        // If no current slide, create one
        currentSlide = {
          title: `Content ${slideCounter}`,
          content: [trimmedLine],
          type: 'content'
        };
        slideCounter++;
      }
    }

    // Add the last slide if exists
    if (currentSlide) {
      slides.push(currentSlide);
    }

    // If we have too much content, create additional slides
    if (slides.length === 1 && lines.length > 20) {
      const contentLines = lines.slice(0, 50); // Take first 50 lines
      const linesPerSlide = Math.ceil(contentLines.length / 5); // 5 slides max
      
      slides.splice(1); // Remove the single content slide
      
      for (let i = 0; i < contentLines.length; i += linesPerSlide) {
        const slideContent = contentLines.slice(i, i + linesPerSlide);
        slides.push({
          title: `Content Section ${Math.floor(i / linesPerSlide) + 1}`,
          content: slideContent,
          type: 'content'
        });
      }
    }

    return {
      title: `Presentation from ${fileName}`,
      slides,
      metadata: {
        author: 'Document Converter',
        date: new Date().toLocaleDateString(),
        totalSlides: slides.length,
        fileName
      }
    };
  } catch (error) {
    console.error('Error converting Word to PowerPoint:', error);
    // Fallback structure
    return {
      title: `Converted from ${fileName}`,
      slides: [{
        title: 'Content',
        content: [content.substring(0, 500) + (content.length > 500 ? '...' : '')],
        type: 'content'
      }],
      metadata: {
        author: 'Document Converter',
        date: new Date().toLocaleDateString(),
        totalSlides: 1,
        fileName
      }
    };
  }
};

/**
 * Convert PDF content to PowerPoint presentation structure
 * @param pdfBlob - The PDF file as a Blob
 * @param fileName - Original file name
 * @returns Promise<PresentationData> - Structured presentation data
 */
export const convertPdfToPowerPoint = async (pdfBlob: Blob, fileName: string): Promise<PresentationData> => {
  try {
    const text = await extractTextFromPdf(pdfBlob);
    return convertWordToPowerPoint(text, fileName);
  } catch (error) {
    console.error('Error converting PDF to PowerPoint:', error);
    throw new Error('Failed to convert PDF to PowerPoint format');
  }
};

/**
 * Convert PDF pages to PowerPoint presentation with images (preserves exact design)
 * @param pdfBlob - The PDF file as a Blob
 * @param fileName - Original file name
 * @returns Promise<PresentationData> - Structured presentation data with images
 */
export const convertPdfToPowerPointWithImages = async (pdfBlob: Blob, fileName: string): Promise<PresentationData> => {
  try {
    console.log('Converting PDF to PowerPoint with images to preserve exact design...');
    
    // Convert PDF pages to images
    const pageImages = await convertPdfPagesToImages(pdfBlob, { dpi: 200 }); // High quality rendering
    
    const slides: SlideContent[] = [];
    
    // Create one slide per PDF page with the image (no extra text)
    pageImages.forEach((pageImage, index) => {
      console.log(`Creating slide for page ${pageImage.pageNumber}, image size: ${pageImage.imageBlob.size} bytes`);
      
      // Verify image blob is valid
      if (pageImage.imageBlob.size === 0) {
        console.error(`Page ${pageImage.pageNumber} has empty image blob`);
      }
      
      slides.push({
        title: `Page ${pageImage.pageNumber}`,
        content: [], // No extra text content
        type: 'image',
        imageBlob: pageImage.imageBlob
      });
    });

    return {
      title: `Presentation from ${fileName} (Image-based)`,
      slides,
      metadata: {
        author: 'Document Converter',
        date: new Date().toLocaleDateString(),
        totalSlides: slides.length,
        fileName
      }
    };
  } catch (error) {
    console.error('Error converting PDF to PowerPoint with images:', error);
    throw new Error('Failed to convert PDF to PowerPoint with images');
  }
};

/**
 * Create a PowerPoint file blob from presentation data
 * @param presentation - The presentation data
 * @returns Promise<Blob> - PowerPoint file as blob
 */
export const createPowerPointBlob = async (presentation: PresentationData): Promise<Blob> => {
  try {
    // Use pptxgenjs to create actual PPTX files
    const PptxGenJS = await import('pptxgenjs');
    const pptx = new PptxGenJS.default();
    
    // Set presentation properties
    pptx.author = presentation.metadata.author;
    pptx.company = 'Document Converter';
    pptx.title = presentation.title;
    pptx.subject = `Converted from ${presentation.metadata.fileName}`;
    
    // Create slides
    for (let index = 0; index < presentation.slides.length; index++) {
      const slide = presentation.slides[index];
      const pptxSlide = pptx.addSlide();
      
      // Handle image-based slides (PDF pages converted to images)
      if (slide.type === 'image' && slide.imageBlob) {
        try {
          console.log(`Processing slide ${index + 1}, image size: ${slide.imageBlob.size} bytes`);
          
          // Try different approaches for image data
          let imageData;
          
          try {
            // Method 1: Try base64 conversion
            const arrayBuffer = await slide.imageBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Convert to base64 properly
            let base64 = '';
            for (let i = 0; i < uint8Array.length; i++) {
              base64 += String.fromCharCode(uint8Array[i]);
            }
            base64 = btoa(base64);
            
            console.log(`Base64 length: ${base64.length} characters`);
            imageData = `data:image/png;base64,${base64}`;
          } catch (base64Error) {
            console.error('Base64 conversion failed:', base64Error);
            
            // Method 2: Try URL.createObjectURL
            try {
              const imageUrl = URL.createObjectURL(slide.imageBlob);
              imageData = imageUrl;
              console.log('Using object URL:', imageUrl);
            } catch (urlError) {
              console.error('URL creation failed:', urlError);
              throw new Error('Failed to process image data');
            }
          }
          
          // Add image to fill entire slide (no text, no title)
          pptxSlide.addImage({
            data: imageData,
            x: 0,
            y: 0,
            w: 10,
            h: 7.5,
            sizing: { type: 'contain', w: 10, h: 7.5 }
          });
        } catch (imageError) {
          console.error('Error adding image to slide:', imageError);
          // Add fallback text to show there was an error
          pptxSlide.addText(`Error loading page ${slide.title}`, {
            x: 0.5,
            y: 3,
            w: 9,
            h: 1,
            fontSize: 16,
            color: 'FF0000',
            align: 'center'
          });
        }
      } else {
        // Add title for non-image slides
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          fontSize: 24,
          bold: true,
          color: '2E74B5',
          align: 'center'
        });
        
        // Add regular text content
        if (slide.content.length > 0) {
          const contentText = slide.content.join('\n');
          pptxSlide.addText(contentText, {
            x: 0.5,
            y: 2,
            w: 9,
            h: 5,
            fontSize: 14,
            color: '000000',
            align: 'left'
          });
        }
      }
    }
    
    // Generate the PPTX file
    const pptxBlob = await pptx.write({ outputType: 'blob' });
    return pptxBlob as Blob;
  } catch (error) {
    console.error('Error creating PowerPoint with pptxgenjs:', error);
    
    // Fallback: Create a simple text-based presentation
    const fallbackContent = `Presentation: ${presentation.title}\n\n${presentation.slides.map((slide, index) => 
      `Slide ${index + 1}: ${slide.title}\n${slide.content.join('\n')}`
    ).join('\n\n')}`;
    
    return new Blob([fallbackContent], { 
      type: 'application/vnd.ms-powerpoint' 
    });
  }
};
