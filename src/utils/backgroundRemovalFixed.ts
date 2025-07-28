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

// Simple but effective background removal using rembg-style algorithm
export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting rembg-style background removal...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Simple but effective foreground detection
    const mask = new Uint8Array(width * height);
    
    // Step 1: Find image center and create distance map
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    
    // Step 2: Analyze color variance and edge strength
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const pixelIdx = idx * 4;
        
        const r = data[pixelIdx];
        const g = data[pixelIdx + 1];
        const b = data[pixelIdx + 2];
        
        // Distance from center (subjects usually closer to center)
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const centerScore = 1 - (distance / maxDistance);
        
        // Edge detection (subjects have more defined edges)
        let edgeStrength = 0;
        const neighbors = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (const [dx, dy] of neighbors) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = (ny * width + nx) * 4;
            const nr = data[nIdx];
            const ng = data[nIdx + 1];
            const nb = data[nIdx + 2];
            
            const colorDiff = Math.abs(r - nr) + Math.abs(g - ng) + Math.abs(b - nb);
            edgeStrength += colorDiff;
          }
        }
        edgeStrength /= neighbors.length;
        
        // Color variance (backgrounds tend to be more uniform)
        let colorVariance = 0;
        for (const [dx, dy] of neighbors) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = (ny * width + nx) * 4;
            const nr = data[nIdx];
            const ng = data[nIdx + 1];
            const nb = data[nIdx + 2];
            
            const avgR = (r + nr) / 2;
            const avgG = (g + ng) / 2;
            const avgB = (b + nb) / 2;
            
            colorVariance += Math.abs(r - avgR) + Math.abs(g - avgG) + Math.abs(b - avgB);
          }
        }
        colorVariance /= neighbors.length;
        
        // Combine scores to determine if pixel is foreground
        const edgeScore = Math.min(edgeStrength / 100, 1);
        const varianceScore = Math.min(colorVariance / 50, 1);
        
        // Final score combining center bias, edge strength, and color variance
        const finalScore = (centerScore * 0.3) + (edgeScore * 0.4) + (varianceScore * 0.3);
        
        // Apply threshold with some tolerance
        mask[idx] = finalScore > 0.35 ? 255 : 0;
      }
    }
    
    // Step 3: Morphological closing to fill gaps
    const closedMask = new Uint8Array(mask.length);
    const kernelSize = 2;
    
    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const idx = y * width + x;
        let maxVal = 0;
        
        // Dilation
        for (let ky = -kernelSize; ky <= kernelSize; ky++) {
          for (let kx = -kernelSize; kx <= kernelSize; kx++) {
            const nIdx = (y + ky) * width + (x + kx);
            if (nIdx >= 0 && nIdx < mask.length) {
              maxVal = Math.max(maxVal, mask[nIdx]);
            }
          }
        }
        closedMask[idx] = maxVal;
      }
    }
    
    // Step 4: Erosion
    const finalMask = new Uint8Array(mask.length);
    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const idx = y * width + x;
        let minVal = 255;
        
        for (let ky = -kernelSize; ky <= kernelSize; ky++) {
          for (let kx = -kernelSize; kx <= kernelSize; kx++) {
            const nIdx = (y + ky) * width + (x + kx);
            if (nIdx >= 0 && nIdx < closedMask.length) {
              minVal = Math.min(minVal, closedMask[nIdx]);
            }
          }
        }
        finalMask[idx] = minVal;
      }
    }
    
    // Step 5: Apply mask with smooth alpha
    for (let i = 0; i < finalMask.length; i++) {
      data[i * 4 + 3] = finalMask[i];
    }
    
    // Create output
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
            console.log('Background removal completed successfully');
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
    console.error('Error in background removal:', error);
    throw error;
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
