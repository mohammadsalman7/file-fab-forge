interface WordToImageOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  lineHeight?: number;
  padding?: number;
  format: 'jpg' | 'png';
}

/**
 * Convert Word document content to an image
 * @param file - The Word document file (DOC/DOCX)
 * @param options - Image generation options
 * @returns Promise<Blob> - Image blob
 */
export const convertWordToImage = async (
  file: File, 
  options: WordToImageOptions
): Promise<Blob> => {
  try {
    console.log('Starting Word to image conversion for:', file.name);
    
    // Extract text content from Word document
    let content = '';
    
    if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      try {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        content = result.value || '';
        console.log('Extracted content length:', content.length);
      } catch (error) {
        console.error('Error extracting Word content:', error);
        content = `Error: Could not extract content from ${file.name}`;
      }
    } else {
      content = `Unsupported file type: ${file.name}`;
    }

    // Render content directly to canvas
    const result = await renderContentToCanvas(content, options);
    console.log('Canvas rendering completed successfully');
    return result;
    
  } catch (error) {
    console.error('Error converting Word to image:', error);
    throw new Error('Failed to convert Word document to image');
  }
};

/**
 * Render content directly to canvas
 * @param content - Text content
 * @param options - Image options
 * @returns Promise<Blob> - Image blob
 */
const renderContentToCanvas = async (
  content: string, 
  options: WordToImageOptions
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  
  const {
    width = 800,
    height = 600,
    backgroundColor = '#ffffff',
    textColor = '#333333',
    fontSize = 14,
    lineHeight = 1.6,
    padding = 40
  } = options;
  
  canvas.width = width;
  canvas.height = height;
  
  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // Set text properties
  ctx.fillStyle = textColor;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  
  // Render content
  if (content.trim()) {
    ctx.font = `${fontSize}px Arial, sans-serif`;
    const lines = content.split('\n');
    let y = padding;
    
    lines.forEach((line, index) => {
      if (y < height - padding && line.trim()) {
        // Wrap long lines
        const maxWidth = width - (padding * 2);
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach((word) => {
          const testLine = currentLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && currentLine !== '') {
            ctx.fillText(currentLine.trim(), padding, y);
            y += fontSize * lineHeight;
            currentLine = word + ' ';
          } else {
            currentLine = testLine;
          }
        });
        
        if (currentLine.trim()) {
          ctx.fillText(currentLine.trim(), padding, y);
          y += fontSize * lineHeight;
        }
        
        // Add spacing between paragraphs
        if (index < lines.length - 1) {
          y += 5;
        }
      }
    });
  } else {
    // If no content, show a message
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('No content to display', width / 2, height / 2);
  }
  
  // Convert canvas to blob
  const mime = options.format === 'jpg' ? 'image/jpeg' : 'image/png';
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) {
        resolve(b);
      } else {
        reject(new Error('Failed to create image blob'));
      }
    }, mime, 0.92);
  });
  
  return blob;
};

/**
 * Convert Word document to image
 * @param file - The file to convert
 * @param format - Target image format
 * @returns Promise<Blob> - Image blob
 */
export const convertWordDocumentToImage = async (file: File, format: 'jpg' | 'png'): Promise<Blob> => {
  const options: WordToImageOptions = {
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontSize: 14,
    lineHeight: 1.6,
    padding: 40,
    format
  };

  return convertWordToImage(file, options);
};
