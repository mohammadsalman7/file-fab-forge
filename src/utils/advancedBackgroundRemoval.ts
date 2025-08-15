import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 2048; // Increased for better quality

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

// Advanced background removal with multiple models and refinement
export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting advanced AI background removal...');
    
    // Use RMBG model specifically designed for background removal
    const segmenter = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
      device: 'webgpu',
    });
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with advanced segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('Segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      // Fallback to simple subject detection
      return removeBackgroundFallback(canvas, ctx);
    }
    
    // Find the main subject (person, object, logo, etc.)
    let mainSubjectMask = null;
    const subjectLabels = ['person', 'logo', 'sign', 'text', 'object', 'product', 'item'];
    
    for (const segment of result) {
      if (segment.mask && subjectLabels.some(label => 
        segment.label?.toLowerCase().includes(label))) {
        mainSubjectMask = segment.mask;
        break;
      }
    }
    
    // If no specific subject found, use the largest non-background segment
    if (!mainSubjectMask && result.length > 0) {
      mainSubjectMask = result.reduce((largest, current) => {
        if (!current.mask) return largest;
        const currentSize = current.mask.data.reduce((sum: number, val: number) => sum + val, 0);
        const largestSize = largest?.mask?.data.reduce((sum: number, val: number) => sum + val, 0) || 0;
        return currentSize > largestSize ? current : largest;
      }).mask;
    }
    
    if (!mainSubjectMask) {
      throw new Error('Could not detect main subject');
    }
    
    // Create output canvas
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply refined mask with edge smoothing
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    // Apply mask with anti-aliasing and edge refinement
    for (let i = 0; i < mainSubjectMask.data.length; i++) {
      const maskValue = mainSubjectMask.data[i] / 255;
      
      // Enhanced alpha calculation with edge smoothing
      let alpha = Math.round(maskValue * 255);
      
      // Edge refinement: check neighboring pixels for smoother edges
      const x = i % mainSubjectMask.width;
      const y = Math.floor(i / mainSubjectMask.width);
      
      if (x > 0 && x < mainSubjectMask.width - 1 && y > 0 && y < mainSubjectMask.height - 1) {
        const neighbors = [
          mainSubjectMask.data[i - 1],
          mainSubjectMask.data[i + 1],
          mainSubjectMask.data[i - mainSubjectMask.width],
          mainSubjectMask.data[i + mainSubjectMask.width]
        ];
        
        const avgNeighbor = neighbors.reduce((sum, val) => sum + val, 0) / neighbors.length;
        alpha = Math.round(((maskValue + avgNeighbor / 255) / 2) * 255);
      }
      
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Advanced mask applied successfully');
    
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Advanced background removal completed');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error with advanced background removal, trying fallback:', error);
    // Fallback to simple method
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw error;
    resizeImageIfNeeded(canvas, ctx, imageElement);
    return removeBackgroundFallback(canvas, ctx);
  }
};

// Fallback background removal using color analysis
function removeBackgroundFallback(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<Blob> {
  console.log('Using fallback background removal method...');
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Detect background color from corners
  const corners = [
    { x: 0, y: 0 },
    { x: canvas.width - 1, y: 0 },
    { x: 0, y: canvas.height - 1 },
    { x: canvas.width - 1, y: canvas.height - 1 }
  ];
  
  const backgroundColors: number[][] = [];
  for (const corner of corners) {
    const index = (corner.y * canvas.width + corner.x) * 4;
    backgroundColors.push([data[index], data[index + 1], data[index + 2]]);
  }
  
  // Calculate average background color
  const avgBg = [
    Math.round(backgroundColors.reduce((sum, color) => sum + color[0], 0) / backgroundColors.length),
    Math.round(backgroundColors.reduce((sum, color) => sum + color[1], 0) / backgroundColors.length),
    Math.round(backgroundColors.reduce((sum, color) => sum + color[2], 0) / backgroundColors.length)
  ];
  
  // Remove background based on color similarity
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate color distance from background
    const distance = Math.sqrt(
      Math.pow(r - avgBg[0], 2) +
      Math.pow(g - avgBg[1], 2) +
      Math.pow(b - avgBg[2], 2)
    );
    
    // Remove pixels similar to background (adjust threshold as needed)
    if (distance < 50) {
      data[i + 3] = 0; // Make transparent
    } else if (distance < 100) {
      // Partial transparency for edge smoothing
      data[i + 3] = Math.round((distance - 50) * 5.1);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          console.log('Fallback background removal completed');
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};