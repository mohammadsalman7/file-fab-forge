import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 512; // Reduced for better performance

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

// Rembg-style background removal using edge detection and color analysis
export const removeBackgroundRembg = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting rembg-style background removal...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize if needed
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create mask array
    const mask = new Uint8Array(width * height);
    
    // Step 1: Edge detection to find subject boundaries
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const pixelIdx = idx * 4;
        
        // Get current pixel
        const r = data[pixelIdx];
        const g = data[pixelIdx + 1];
        const b = data[pixelIdx + 2];
        
        // Check surrounding pixels for edge detection
        let isEdge = false;
        const threshold = 30;
        
        // Check right, bottom, diagonal neighbors
        const neighbors = [
          [1, 0], [0, 1], [1, 1], [-1, 1] // right, bottom, diagonal
        ];
        
        for (const [dx, dy] of neighbors) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = (ny * width + nx) * 4;
            const nr = data[nIdx];
            const ng = data[nIdx + 1];
            const nb = data[nIdx + 2];
            
            const diff = Math.abs(r - nr) + Math.abs(g - ng) + Math.abs(b - nb);
            if (diff > threshold) {
              isEdge = true;
              break;
            }
          }
        }
        
        // Distance from center (subjects usually in center)
        const centerX = width / 2;
        const centerY = height / 2;
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);
        const centerWeight = 1 - (distFromCenter / maxDist);
        
        // Combine edge detection with center bias
        if (isEdge || centerWeight > 0.6) {
          mask[idx] = 255; // Keep
        } else {
          mask[idx] = 0; // Remove
        }
      }
    }
    
    // Step 2: Morphological operations to clean up mask
    const cleanMask = new Uint8Array(mask.length);
    const kernelSize = 3;
    
    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const idx = y * width + x;
        let sum = 0;
        let count = 0;
        
        // Apply median filter
        for (let ky = -kernelSize; ky <= kernelSize; ky++) {
          for (let kx = -kernelSize; kx <= kernelSize; kx++) {
            const nIdx = (y + ky) * width + (x + kx);
            if (nIdx >= 0 && nIdx < mask.length) {
              sum += mask[nIdx];
              count++;
            }
          }
        }
        
        cleanMask[idx] = sum / count > 127 ? 255 : 0;
      }
    }
    
    // Step 3: Apply mask to create transparent background
    for (let i = 0; i < cleanMask.length; i++) {
      const alpha = cleanMask[i];
      data[i * 4 + 3] = alpha; // Set alpha channel
    }
    
    // Create output canvas
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output context');
    
    outputCtx.putImageData(imageData, 0, 0);
    
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Rembg-style background removal completed');
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
    console.error('Error in rembg-style background removal:', error);
    throw error;
  }
};

// Improved AI-based background removal with proper mask logic
export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting AI background removal...');
    
    // Try AI segmentation first
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu',
    });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    console.log('Processing with AI segmentation...');
    const result = await segmenter(imageData);
    console.log('AI segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      console.log('AI segmentation failed, using rembg-style approach...');
      return removeBackgroundRembg(imageElement);
    }
    
    // Create output canvas
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output context');
    
    outputCtx.drawImage(canvas, 0, 0);
    const outputImageData = outputCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = outputImageData.data;
    
    // Define what to keep vs remove (FIXED LOGIC)
    const subjectLabels = ['person', 'face', 'animal', 'dog', 'cat', 'bicycle', 'car', 'motorbike', 'bottle', 'chair', 'sofa', 'plant', 'potted plant', 'food', 'book', 'laptop', 'mouse', 'keyboard', 'cell phone', 'signboard', 'trade name', 'logo', 'text', 'sign', 'banner', 'advertisement'];
    const backgroundLabels = ['sky', 'cloud', 'wall', 'building', 'floor', 'ceiling', 'road', 'grass', 'sidewalk', 'earth', 'mountain', 'sea', 'water', 'river', 'tree', 'field'];
    
    // Create final mask - start with keep everything
    const finalMask = new Uint8Array(canvas.width * canvas.height);
    finalMask.fill(255); // Default: keep everything
    
    // Process each segment
    for (const segment of result) {
      if (segment.label && segment.mask && segment.mask.data) {
        const label = segment.label.toLowerCase();
        console.log(`Processing segment: ${label}`);
        
        // Check if this is a subject element that should be kept
        const isSubject = subjectLabels.some(subjectLabel => 
          label.includes(subjectLabel) || subjectLabel.includes(label)
        );
        
        // Check if this is a background element that should be removed
        const isBackground = backgroundLabels.some(bgLabel => 
          label.includes(bgLabel) || bgLabel.includes(label)
        );
        
        if (isBackground && !isSubject) {
          // Remove this segment (set to transparent)
          for (let i = 0; i < segment.mask.data.length; i++) {
            const maskValue = segment.mask.data[i];
            if (maskValue > 100) { // High confidence for this segment
              finalMask[i] = 0; // Remove (transparent)
            }
          }
          console.log(`Removing background segment: ${label}`);
        }
      }
    }
    
    // Apply the final mask
    for (let i = 0; i < finalMask.length; i++) {
      data[i * 4 + 3] = finalMask[i]; // Set alpha channel
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('AI background removal completed');
    
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
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
    console.error('Error in AI background removal:', error);
    console.log('Falling back to rembg-style approach...');
    return removeBackgroundRembg(imageElement);
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
