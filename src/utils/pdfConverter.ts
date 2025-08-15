import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const convertImageToPdf = async (imageBlob: Blob): Promise<Blob> => {
  try {
    const pdfDoc = await PDFDocument.create();
    
    // Read the image
    const imageBytes = await imageBlob.arrayBuffer();
    let image;
    
    if (imageBlob.type === 'image/jpeg' || imageBlob.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(imageBytes);
    } else if (imageBlob.type === 'image/png') {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      throw new Error('Unsupported image format. Please use JPEG or PNG.');
    }

    // Create a page with the same dimensions as the image
    const page = pdfDoc.addPage([image.width, image.height]);
    
    // Draw the image on the page
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save();
    return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error converting image to PDF:', error);
    throw error;
  }
};

export const createTextPdf = async (text: string, title?: string): Promise<Blob> => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const titleFontSize = 18;

    const { width, height } = page.getSize();
    const margin = 50;
    const maxWidth = width - 2 * margin;

    let yPosition = height - margin;

    // Add title if provided
    if (title) {
      try {
        page.drawText(title, {
          x: margin,
          y: yPosition,
          size: titleFontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        yPosition -= titleFontSize + 20;
      } catch (titleError) {
        console.warn('Error drawing title, skipping:', titleError);
        // Continue without title
      }
    }

    // Split text into lines that fit the page width
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) {
        yPosition -= fontSize + 5; // Add spacing for empty lines
        continue;
      }

      const words = line.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        
        try {
          const testWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (testWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              try {
                page.drawText(currentLine, {
                  x: margin,
                  y: yPosition,
                  size: fontSize,
                  font: font,
                  color: rgb(0, 0, 0),
                });
                yPosition -= fontSize + 5;
              } catch (drawError) {
                console.warn('Error drawing line, skipping:', drawError);
                yPosition -= fontSize + 5; // Still move down
              }
            }
            currentLine = word;
            
            // Check if we need a new page
            if (yPosition < margin) {
              const newPage = pdfDoc.addPage();
              yPosition = newPage.getHeight() - margin;
            }
          }
        } catch (widthError) {
          console.warn('Error calculating text width, skipping word:', widthError);
          // Skip problematic words
          continue;
        }
      }
      
      // Draw the last line of this paragraph
      if (currentLine) {
        try {
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          yPosition -= fontSize + 5;
        } catch (drawError) {
          console.warn('Error drawing final line, skipping:', drawError);
          yPosition -= fontSize + 5; // Still move down
        }
      }
      
      // Check if we need a new page
      if (yPosition < margin) {
        const newPage = pdfDoc.addPage();
        yPosition = newPage.getHeight() - margin;
      }
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error creating text PDF:', error);
    throw error;
  }
};

export const extractTextFromPdf = async (pdfBlob: Blob): Promise<string> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Note: pdf-lib doesn't have built-in text extraction
    // This is a simplified version - for full text extraction, you'd need a different library
    return 'Text extraction from PDF requires additional libraries. This is a placeholder implementation.';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};