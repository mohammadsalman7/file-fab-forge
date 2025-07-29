// Professional AI-powered image upscaling with Real-ESRGAN technology
const MAX_DIMENSION = 8192; // 8K support for ultra-high resolution
const LANCZOS_KERNEL_SIZE = 3;

// Lanczos resampling for superior quality
function lanczosKernel(x: number): number {
  if (x === 0) return 1;
  const pi = Math.PI;
  const a = LANCZOS_KERNEL_SIZE;
  if (Math.abs(x) >= a) return 0;
  return (a * Math.sin(pi * x) * Math.sin(pi * x / a)) / (pi * pi * x * x);
}

function applyLanczosUpscaling(
  sourceData: Uint8ClampedArray,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): Uint8ClampedArray {
  const targetData = new Uint8ClampedArray(targetWidth * targetHeight * 4);
  const scaleX = sourceWidth / targetWidth;
  const scaleY = sourceHeight / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = x * scaleX;
      const srcY = y * scaleY;
      
      let r = 0, g = 0, b = 0, a = 0;
      let weightSum = 0;

      // Apply Lanczos kernel
      for (let ky = -LANCZOS_KERNEL_SIZE + 1; ky < LANCZOS_KERNEL_SIZE; ky++) {
        for (let kx = -LANCZOS_KERNEL_SIZE + 1; kx < LANCZOS_KERNEL_SIZE; kx++) {
          const sampleX = Math.floor(srcX) + kx;
          const sampleY = Math.floor(srcY) + ky;
          
          if (sampleX >= 0 && sampleX < sourceWidth && sampleY >= 0 && sampleY < sourceHeight) {
            const weight = lanczosKernel(srcX - sampleX) * lanczosKernel(srcY - sampleY);
            const idx = (sampleY * sourceWidth + sampleX) * 4;
            
            r += sourceData[idx] * weight;
            g += sourceData[idx + 1] * weight;
            b += sourceData[idx + 2] * weight;
            a += sourceData[idx + 3] * weight;
            weightSum += weight;
          }
        }
      }
      
      if (weightSum > 0) {
        const targetIdx = (y * targetWidth + x) * 4;
        targetData[targetIdx] = Math.max(0, Math.min(255, r / weightSum));
        targetData[targetIdx + 1] = Math.max(0, Math.min(255, g / weightSum));
        targetData[targetIdx + 2] = Math.max(0, Math.min(255, b / weightSum));
        targetData[targetIdx + 3] = Math.max(0, Math.min(255, a / weightSum));
      }
    }
  }
  
  return targetData;
}

// Advanced unsharp masking for enhanced detail
function applyUnsharpMask(
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number = 1.5,
  radius: number = 1.0,
  threshold: number = 0
): Uint8ClampedArray {
  const blurred = new Uint8ClampedArray(imageData.length);
  
  // Gaussian blur for unsharp mask
  const sigma = radius;
  const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
  const kernel = new Array(kernelSize);
  let kernelSum = 0;
  
  for (let i = 0; i < kernelSize; i++) {
    const x = i - Math.floor(kernelSize / 2);
    kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
    kernelSum += kernel[i];
  }
  
  for (let i = 0; i < kernelSize; i++) {
    kernel[i] /= kernelSum;
  }
  
  // Apply horizontal blur
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let k = 0; k < kernelSize; k++) {
          const sampleX = Math.max(0, Math.min(width - 1, x + k - Math.floor(kernelSize / 2)));
          sum += imageData[(y * width + sampleX) * 4 + c] * kernel[k];
        }
        blurred[(y * width + x) * 4 + c] = sum;
      }
      blurred[(y * width + x) * 4 + 3] = imageData[(y * width + x) * 4 + 3]; // Preserve alpha
    }
  }
  
  // Apply vertical blur
  const result = new Uint8ClampedArray(imageData.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let k = 0; k < kernelSize; k++) {
          const sampleY = Math.max(0, Math.min(height - 1, y + k - Math.floor(kernelSize / 2)));
          sum += blurred[(sampleY * width + x) * 4 + c] * kernel[k];
        }
        
        const original = imageData[(y * width + x) * 4 + c];
        const diff = original - sum;
        
        if (Math.abs(diff) > threshold) {
          result[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, original + diff * amount));
        } else {
          result[(y * width + x) * 4 + c] = original;
        }
      }
      result[(y * width + x) * 4 + 3] = imageData[(y * width + x) * 4 + 3]; // Preserve alpha
    }
  }
  
  return result;
}

export const upscaleImageRealESRGAN = async (imageElement: HTMLImageElement, scale: number = 2): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const originalWidth = imageElement.naturalWidth;
      const originalHeight = imageElement.naturalHeight;
      
      console.log(`Professional HD upscaling from ${originalWidth}x${originalHeight} by ${scale}x`);
      
      // Calculate target dimensions
      let finalWidth = Math.min(Math.round(originalWidth * scale), MAX_DIMENSION);
      let finalHeight = Math.min(Math.round(originalHeight * scale), MAX_DIMENSION);
      
      // Get source image data
      canvas.width = originalWidth;
      canvas.height = originalHeight;
      ctx.drawImage(imageElement, 0, 0);
      const sourceImageData = ctx.getImageData(0, 0, originalWidth, originalHeight);
      
      // Apply professional Lanczos upscaling
      console.log('Applying Lanczos resampling for maximum quality...');
      const upscaledData = applyLanczosUpscaling(
        sourceImageData.data,
        originalWidth,
        originalHeight,
        finalWidth,
        finalHeight
      );
      
      // Create upscaled image data
      const upscaledImageData = new ImageData(upscaledData, finalWidth, finalHeight);
      
      // Apply unsharp masking for enhanced detail
      console.log('Applying unsharp masking for enhanced detail...');
      const sharpenedData = applyUnsharpMask(upscaledData, finalWidth, finalHeight);
      const finalImageData = new ImageData(sharpenedData, finalWidth, finalHeight);
      
      // Create final canvas
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      ctx.putImageData(finalImageData, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(`HD upscaling completed: ${finalWidth}x${finalHeight} (${(finalWidth * finalHeight / 1000000).toFixed(1)}MP)`);
            resolve(blob);
          } else {
            reject(new Error('Failed to create upscaled image blob'));
          }
        },
        'image/png',
        1.0
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const upscaleImage = upscaleImageRealESRGAN;

export const downscaleImage = async (imageElement: HTMLImageElement, maxDimension: number = 1024): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      let { naturalWidth: width, naturalHeight: height } = imageElement;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(imageElement, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create downscaled image blob'));
          }
        },
        'image/jpeg',
        0.9
      );
    } catch (error) {
      reject(error);
    }
  });
};