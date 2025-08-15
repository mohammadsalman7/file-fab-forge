import { extractTextFromPdfWithFormatting } from './pdfTextExtractor';

interface ParagraphData {
  text: string;
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  alignment?: 'left' | 'center' | 'right' | 'justify';
}

interface DocumentSection {
  paragraphs: ParagraphData[];
  pageNumber: number;
}

interface DocumentData {
  title: string;
  sections: DocumentSection[];
  metadata: {
    author: string;
    date: string;
    totalPages: number;
    fileName: string;
  };
}

/**
 * Convert PDF content to structured DOCX document data
 * @param pdfBlob - The PDF file as a Blob
 * @param fileName - Original file name
 * @returns Promise<DocumentData> - Structured document data
 */
export const convertPdfToDocxData = async (pdfBlob: Blob, fileName: string): Promise<DocumentData> => {
  try {
    const pages = await extractTextFromPdfWithFormatting(pdfBlob);
    const sections: DocumentSection[] = [];

    // Process each page
    pages.forEach((page, pageIndex) => {
      const paragraphs: ParagraphData[] = [];
      
      // Split page text into paragraphs
      const pageParagraphs = page.text.split('\n\n').filter(p => p.trim());
      
      pageParagraphs.forEach((paragraph, paraIndex) => {
        const lines = paragraph.split('\n').filter(line => line.trim());
        
        lines.forEach((line, lineIndex) => {
          // Analyze text formatting based on content and position
          const isTitle = (
            line.length < 100 && 
            (!!line.match(/^[A-Z][^.!?]*$/) || 
             !!line.match(/^\d+\./) ||
             line.length < 50) &&
            lineIndex === 0
          );
          
          const isSubtitle = (
            line.length < 80 && 
            !!line.match(/^[A-Z][^.!?]*$/) &&
            lineIndex === 1
          );
          
          const isHeader = (
            !!line.match(/^[A-Z\s]{3,}$/) ||
            !!line.match(/^Chapter\s+\d+/i) ||
            !!line.match(/^Section\s+\d+/i)
          );
          
          const isList = !!line.match(/^[\s]*[•\-\*]\s/) || !!line.match(/^[\s]*\d+\.\s/);
          
          paragraphs.push({
            text: line,
            fontSize: isTitle ? 18 : isSubtitle ? 16 : isHeader ? 14 : isList ? 12 : 11,
            isBold: isTitle || isSubtitle || isHeader,
            isItalic: false,
            alignment: isTitle ? 'center' : isList ? 'left' : 'justify'
          });
        });
      });
      
      sections.push({
        paragraphs,
        pageNumber: page.page
      });
    });

    return {
      title: `Converted from ${fileName}`,
      sections,
      metadata: {
        author: 'Document Converter',
        date: new Date().toLocaleDateString(),
        totalPages: pages.length,
        fileName
      }
    };
  } catch (error) {
    console.error('Error converting PDF to DOCX data:', error);
    throw new Error('Failed to convert PDF to DOCX format');
  }
};

/**
 * Generate DOCX HTML content with proper Word-like styling
 * @param document - The document data
 * @returns string - HTML content for DOCX
 */
export const generateDocxHtml = (document: DocumentData): string => {
  const sectionHtml = document.sections.map((section, sectionIndex) => `
    <div class="page-section" id="page-${section.pageNumber}">
      <div class="page-header">
        <span class="page-number">Page ${section.pageNumber}</span>
        <span class="page-separator"></span>
      </div>
      <div class="page-content">
        ${section.paragraphs.map((paragraph, paraIndex) => `
          <p class="paragraph" style="
            font-size: ${paragraph.fontSize}px;
            font-weight: ${paragraph.isBold ? 'bold' : 'normal'};
            font-style: ${paragraph.isItalic ? 'italic' : 'normal'};
            text-align: ${paragraph.alignment};
            margin-bottom: ${paragraph.fontSize && paragraph.fontSize > 14 ? '20px' : '12px'};
          ">
            ${paragraph.text}
          </p>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            background: #f5f5f5;
            line-height: 1.6;
            color: #333;
        }
        
        .document-container {
            background: white;
            max-width: 800px;
            margin: 40px auto;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .document-header {
            background: linear-gradient(135deg, #2E74B5 0%, #1e4a75 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .document-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .document-meta {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .document-content {
            padding: 40px;
            min-height: 600px;
        }
        
        .page-section {
            margin-bottom: 40px;
            page-break-after: always;
        }
        
        .page-section:last-child {
            page-break-after: avoid;
        }
        
        .page-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        .page-number {
            background: #2E74B5;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .page-separator {
            flex: 1;
            height: 1px;
            background: #e0e0e0;
            margin-left: 15px;
        }
        
        .page-content {
            line-height: 1.8;
        }
        
        .paragraph {
            margin-bottom: 12px;
            text-indent: 0;
            word-wrap: break-word;
        }
        
        .paragraph:last-child {
            margin-bottom: 0;
        }
        
        /* Print styles */
        @media print {
            body {
                background: white;
            }
            
            .document-container {
                box-shadow: none;
                margin: 0;
                max-width: none;
            }
            
            .document-header {
                background: #2E74B5 !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            
            .page-section {
                page-break-after: always;
            }
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
            .document-container {
                margin: 20px;
                border-radius: 0;
            }
            
            .document-content {
                padding: 20px;
            }
            
            .document-title {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="document-container">
        <div class="document-header">
            <div class="document-title">${document.title}</div>
            <div class="document-meta">
                Converted by ${document.metadata.author} | ${document.metadata.date} | ${document.metadata.totalPages} pages
            </div>
        </div>
        
        <div class="document-content">
            ${sectionHtml}
        </div>
    </div>
</body>
</html>`;
};

/**
 * Create a DOCX file blob from document data
 * @param document - The document data
 * @returns Blob - DOCX file as blob
 */
// Example of how a proper library would work
import { Document, Paragraph, TextRun, Packer } from 'docx';

export const createDocxBlob = async (document: DocumentData): Promise<Blob> => {
  const doc = new Document({
    sections: document.sections.map(section => ({
      children: section.paragraphs.map(p => new Paragraph({
        children: [new TextRun(p.text)],
        // Apply other formatting properties here
      }))
    })),
  });

  const buffer = await Packer.toBuffer(doc);
  return new Blob([new Uint8Array(buffer)], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
};

/**
 * Convert simple text content to DOCX format
 * @param content - The text content
 * @param fileName - Original file name
 * @returns DocumentData - Structured document data
 */
export const convertTextToDocxData = (content: string, fileName: string): DocumentData => {
  try {
    const lines = content.split('\n').filter(line => line.trim());
    const paragraphs: ParagraphData[] = [];
    
    // Add document header
    paragraphs.push({
      text: `Document converted from: ${fileName}`,
      fontSize: 18,
      isBold: true,
      alignment: 'center'
    });
    
    paragraphs.push({
      text: `Conversion date: ${new Date().toLocaleDateString()}`,
      fontSize: 12,
      isBold: false,
      alignment: 'center'
    });
    
    paragraphs.push({
      text: '',
      fontSize: 12,
      isBold: false,
      alignment: 'left'
    });
    
    // Process content lines
    lines.forEach((line, index) => {
      const isTitle = (
        line.length < 100 && 
        (!!line.match(/^[A-Z][^.!?]*$/) || 
         !!line.match(/^\d+\./) ||
         line.length < 50)
      );
      
      const isHeader = !!line.match(/^[A-Z\s]{3,}$/) || !!line.match(/^Chapter\s+\d+/i);
      const isList = !!line.match(/^[\s]*[•\-\*]\s/) || !!line.match(/^[\s]*\d+\.\s/);
      
      paragraphs.push({
        text: line,
        fontSize: isTitle ? 16 : isHeader ? 14 : isList ? 12 : 11,
        isBold: isTitle || isHeader,
        isItalic: false,
        alignment: isTitle ? 'center' : isList ? 'left' : 'justify'
      });
    });
    
    return {
      title: `Converted from ${fileName}`,
      sections: [{
        paragraphs,
        pageNumber: 1
      }],
      metadata: {
        author: 'Document Converter',
        date: new Date().toLocaleDateString(),
        totalPages: 1,
        fileName
      }
    };
  } catch (error) {
    console.error('Error converting text to DOCX data:', error);
    throw new Error('Failed to convert text to DOCX format');
  }
};
