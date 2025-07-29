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

// Professional-grade background removal with pixel-perfect edge cleaning
export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting professional background removal with pixel-perfect edges...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    console.log(`Processing image: ${width}x${height}`);
    
    // Step 1: Enhanced background color detection with multi-edge sampling
    const backgroundColors = new Map();
    const sampleSize = 2; // Dense sampling for maximum accuracy
    
    // Sample all four edges with higher density
    for (let x = 0; x < width; x += sampleSize) {
      for (let y of [0, 1, height - 2, height - 1]) {
        if (y >= 0 && y < height) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const colorKey = `${r},${g},${b}`;
          backgroundColors.set(colorKey, (backgroundColors.get(colorKey) || 0) + 1);
        }
      }
    }
    
    for (let y = 0; y < height; y += sampleSize) {
      for (let x of [0, 1, width - 2, width - 1]) {
        if (x >= 0 && x < width) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const colorKey = `${r},${g},${b}`;
          backgroundColors.set(colorKey, (backgroundColors.get(colorKey) || 0) + 1);
        }
      }
    }
    
    // Find most common background color
    let bgColor = { r: 255, g: 255, b: 255 };
    let maxCount = 0;
    for (const [colorKey, count] of backgroundColors) {
      if (count > maxCount) {
        maxCount = count;
        const [r, g, b] = colorKey.split(',').map(Number);
        bgColor = { r, g, b };
      }
    }
    
    console.log(`Detected background color: rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`);
    
    // Step 2: Ultra-precise color-based mask creation
    const mask = new Uint8Array(width * height);
    const bgThreshold = 15; // Ultra-tight tolerance for clean edges
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const pixelIdx = idx * 4;
        
        const r = data[pixelIdx];
        const g = data[pixelIdx + 1];
        const b = data[pixelIdx + 2];
        
        // Enhanced color difference calculation
        const colorDiff = Math.sqrt(
          Math.pow(r - bgColor.r, 2) + 
          Math.pow(g - bgColor.g, 2) + 
          Math.pow(b - bgColor.b, 2)
        );
        
        // More aggressive thresholding for cleaner edges
        if (colorDiff > bgThreshold) {
          mask[idx] = 255; // Keep
        } else {
          mask[idx] = 0; // Remove
        }
      }
    }
    
    // Step 3: Advanced edge detection and refinement
    const refinedMask = new Uint8Array(mask.length);
    
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        const idx = y * width + x;
        
        // Calculate Laplacian for edge detection
        let laplacian = 0;
        const kernel = [
          [0, -1, 0],
          [-1, 4, -1],
          [0, -1, 0]
        ];
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const ny = y + ky;
            const nx = x + kx;
            const nIdx = (ny * width + nx) * 4;
            const intensity = (data[nIdx] + data[nIdx + 1] + data[nIdx + 2]) / 3;
            laplacian += intensity * kernel[ky + 1][kx + 1];
          }
        }
        
        const originalMask = mask[idx];
        const edgeStrength = Math.abs(laplacian);
        
        // Aggressive edge-based refinement
        if (edgeStrength > 8 || originalMask > 0) {
          refinedMask[idx] = 255;
        } else {
          refinedMask[idx] = 0;
        }
      }
    }
    
    // Step 4: Eliminate whitish borders with aggressive edge erosion
    const borderCleanMask = new Uint8Array(refinedMask.length);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        
        if (refinedMask[idx] > 0) {
          // Check if all neighbors are also foreground
          let solidNeighbors = 0;
          let totalNeighbors = 0;
          
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              if (ky === 0 && kx === 0) continue;
              const nIdx = (y + ky) * width + (x + kx);
              if (nIdx >= 0 && nIdx < refinedMask.length) {
                if (refinedMask[nIdx] > 0) solidNeighbors++;
                totalNeighbors++;
              }
            }
          }
          
          // Only keep pixels that have strong neighbor support
          const neighborRatio = solidNeighbors / totalNeighbors;
          if (neighborRatio > 0.6) {
            borderCleanMask[idx] = 255;
          } else {
            borderCleanMask[idx] = 0;
          }
        } else {
          borderCleanMask[idx] = 0;
        }
      }
    }
    
    // Step 5: Final morphological cleaning to remove artifacts
    const finalMask = new Uint8Array(borderCleanMask.length);
    
    // Opening operation (erosion followed by dilation) to remove noise
    const kernelSize = 1;
    
    // Erosion
    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const idx = y * width + x;
        let minVal = 255;
        
        for (let ky = -kernelSize; ky <= kernelSize; ky++) {
          for (let kx = -kernelSize; kx <= kernelSize; kx++) {
            const nIdx = (y + ky) * width + (x + kx);
            if (nIdx >= 0 && nIdx < borderCleanMask.length) {
              minVal = Math.min(minVal, borderCleanMask[nIdx]);
            }
          }
        }
        finalMask[idx] = minVal;
      }
    }
    
    // Dilation to restore size
    const restoredMask = new Uint8Array(finalMask.length);
    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const idx = y * width + x;
        let maxVal = 0;
        
        for (let ky = -kernelSize; ky <= kernelSize; ky++) {
          for (let kx = -kernelSize; kx <= kernelSize; kx++) {
            const nIdx = (y + ky) * width + (x + kx);
            if (nIdx >= 0 && nIdx < finalMask.length) {
              maxVal = Math.max(maxVal, finalMask[nIdx]);
            }
          }
        }
        restoredMask[idx] = maxVal;
      }
    }
    
    // Step 6: Apply the ultra-clean mask (no anti-aliasing to prevent borders)
    for (let i = 0; i < restoredMask.length; i++) {
      const alpha = restoredMask[i];
      // Binary alpha - either fully transparent or fully opaque
      data[i * 4 + 3] = alpha > 128 ? 255 : 0;
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
            console.log('Professional background removal with pixel-perfect edges completed');
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
    console.error('Error in professional background removal:', error);
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

// Add custom background to transparent image
export const addCustomBackground = async (
  transparentImage: HTMLImageElement, 
  backgroundImage: HTMLImageElement | string
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = transparentImage.naturalWidth;
  canvas.height = transparentImage.naturalHeight;

  // Draw background
  if (typeof backgroundImage === 'string') {
    // Solid color background
    ctx.fillStyle = backgroundImage;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // Image background
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  // Draw transparent image on top
  ctx.drawImage(transparentImage, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      'image/png',
      1.0
    );
  });
};

// Add blur background effect
export const addBlurBackground = async (
  transparentImage: HTMLImageElement,
  blurRadius: number = 10
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = transparentImage.naturalWidth;
  canvas.height = transparentImage.naturalHeight;

  // Create blurred background from the original image
  ctx.filter = `blur(${blurRadius}px)`;
  ctx.drawImage(transparentImage, 0, 0);
  
  // Reset filter and draw sharp image on top
  ctx.filter = 'none';
  ctx.drawImage(transparentImage, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      'image/png',
      1.0
    );
  });
};

// Add shadow effect to image
export const addShadowEffect = async (
  transparentImage: HTMLImageElement,
  shadowColor: string = 'rgba(0,0,0,0.3)',
  offsetX: number = 10,
  offsetY: number = 10,
  blur: number = 15
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = transparentImage.naturalWidth + Math.abs(offsetX) + blur;
  canvas.height = transparentImage.naturalHeight + Math.abs(offsetY) + blur;

  // Draw shadow
  ctx.shadowColor = shadowColor;
  ctx.shadowOffsetX = offsetX;
  ctx.shadowOffsetY = offsetY;
  ctx.shadowBlur = blur;
  
  const x = offsetX < 0 ? Math.abs(offsetX) + blur / 2 : blur / 2;
  const y = offsetY < 0 ? Math.abs(offsetY) + blur / 2 : blur / 2;
  
  ctx.drawImage(transparentImage, x, y);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      'image/png',
      1.0
    );
  });
};
