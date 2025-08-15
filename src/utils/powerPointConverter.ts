import { extractTextFromPdf } from './pdfTextExtractor';

interface SlideContent {
  title: string;
  content: string[];
  type: 'title' | 'content' | 'bullet' | 'image';
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
    presentation.slides.forEach((slide, index) => {
      const pptxSlide = pptx.addSlide();
      
      // Add title
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
      
      // Add content
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
    });
    
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
