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

// Advanced background removal with precise border detection for logos/text
export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting advanced background removal with border detection...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    console.log(`Processing image: ${width}x${height}`);
    
    // Step 1: Detect background color (most common color around edges)
    const backgroundColors = new Map();
    const sampleSize = 10; // Sample every 10th pixel on edges
    
    // Sample top and bottom edges
    for (let x = 0; x < width; x += sampleSize) {
      for (let y of [0, height - 1]) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const colorKey = `${r},${g},${b}`;
        backgroundColors.set(colorKey, (backgroundColors.get(colorKey) || 0) + 1);
      }
    }
    
    // Sample left and right edges
    for (let y = 0; y < height; y += sampleSize) {
      for (let x of [0, width - 1]) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const colorKey = `${r},${g},${b}`;
        backgroundColors.set(colorKey, (backgroundColors.get(colorKey) || 0) + 1);
      }
    }
    
    // Find most common background color
    let bgColor = { r: 255, g: 255, b: 255 }; // Default to white
    let maxCount = 0;
    for (const [colorKey, count] of backgroundColors) {
      if (count > maxCount) {
        maxCount = count;
        const [r, g, b] = colorKey.split(',').map(Number);
        bgColor = { r, g, b };
      }
    }
    
    console.log(`Detected background color: rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`);
    
    // Step 2: Create initial mask based on color difference from background
    const mask = new Uint8Array(width * height);
    const bgThreshold = 30; // Tolerance for background color matching
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const pixelIdx = idx * 4;
        
        const r = data[pixelIdx];
        const g = data[pixelIdx + 1];
        const b = data[pixelIdx + 2];
        
        // Calculate color difference from background
        const colorDiff = Math.abs(r - bgColor.r) + Math.abs(g - bgColor.g) + Math.abs(b - bgColor.b);
        
        // If color is significantly different from background, it's foreground
        if (colorDiff > bgThreshold) {
          mask[idx] = 255; // Keep
        } else {
          mask[idx] = 0; // Remove
        }
      }
    }
    
    // Step 3: Refine mask with edge detection for precise borders
    const refinedMask = new Uint8Array(mask.length);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const pixelIdx = idx * 4;
        
        const r = data[pixelIdx];
        const g = data[pixelIdx + 1];
        const b = data[pixelIdx + 2];
        
        // Calculate gradient strength (Sobel operator)
        let gx = 0, gy = 0;
        
        // Sobel X kernel
        const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
        const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const ny = y + ky;
            const nx = x + kx;
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const nIdx = (ny * width + nx) * 4;
              const intensity = (data[nIdx] + data[nIdx + 1] + data[nIdx + 2]) / 3;
              
              gx += intensity * sobelX[ky + 1][kx + 1];
              gy += intensity * sobelY[ky + 1][kx + 1];
            }
          }
        }
        
        const gradient = Math.sqrt(gx * gx + gy * gy);
        
        // Combine original mask with edge information
        const originalMask = mask[idx];
        const edgeStrength = Math.min(gradient / 50, 1); // Normalize gradient
        
        // If there's a strong edge, likely part of the subject
        if (gradient > 20 || originalMask > 0) {
          refinedMask[idx] = 255;
        } else {
          refinedMask[idx] = 0;
        }
      }
    }
    
    // Step 4: Morphological operations to clean up the mask
    const cleanMask = new Uint8Array(refinedMask.length);
    const kernelSize = 1;
    
    // Closing operation (dilation followed by erosion)
    // Dilation first
    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const idx = y * width + x;
        let maxVal = 0;
        
        for (let ky = -kernelSize; ky <= kernelSize; ky++) {
          for (let kx = -kernelSize; kx <= kernelSize; kx++) {
            const nIdx = (y + ky) * width + (x + kx);
            if (nIdx >= 0 && nIdx < refinedMask.length) {
              maxVal = Math.max(maxVal, refinedMask[nIdx]);
            }
          }
        }
        cleanMask[idx] = maxVal;
      }
    }
    
    // Erosion
    const finalMask = new Uint8Array(cleanMask.length);
    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const idx = y * width + x;
        let minVal = 255;
        
        for (let ky = -kernelSize; ky <= kernelSize; ky++) {
          for (let kx = -kernelSize; kx <= kernelSize; kx++) {
            const nIdx = (y + ky) * width + (x + kx);
            if (nIdx >= 0 && nIdx < cleanMask.length) {
              minVal = Math.min(minVal, cleanMask[nIdx]);
            }
          }
        }
        finalMask[idx] = minVal;
      }
    }
    
    // Step 5: Apply anti-aliasing to smooth edges
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        
        if (finalMask[idx] === 0) {
          // Check if this is near a foreground pixel
          let neighborSum = 0;
          let neighborCount = 0;
          
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const nIdx = (y + ky) * width + (x + kx);
              if (nIdx >= 0 && nIdx < finalMask.length) {
                neighborSum += finalMask[nIdx];
                neighborCount++;
              }
            }
          }
          
          const avgNeighbor = neighborSum / neighborCount;
          if (avgNeighbor > 128) {
            finalMask[idx] = Math.floor(avgNeighbor * 0.3); // Smooth transition
          }
        }
      }
    }
    
    // Step 6: Apply the final mask
    for (let i = 0; i < finalMask.length; i++) {
      data[i * 4 + 3] = finalMask[i]; // Set alpha channel
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
            console.log('Advanced background removal completed successfully');
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
