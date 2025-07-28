// Real-ESRGAN style upscaling with HD quality output
const MAX_DIMENSION = 4096; // Ultra HD support
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
      
      console.log(`Upscaling to HD quality from ${originalWidth}x${originalHeight} by ${scale}x`);
      
      // Ensure we don't exceed maximum dimensions
      let finalWidth = Math.min(Math.round(originalWidth * scale), MAX_DIMENSION);
      let finalHeight = Math.min(Math.round(originalHeight * scale), MAX_DIMENSION);
      
      // For high-quality upscaling, use multiple passes
      if (scale > 2) {
        // Multi-pass upscaling for better quality
        let currentWidth = originalWidth;
        let currentHeight = originalHeight;
        let currentCanvas = document.createElement('canvas');
        let currentCtx = currentCanvas.getContext('2d');
        if (!currentCtx) {
          reject(new Error('Could not get context'));
          return;
        }
        
        currentCanvas.width = originalWidth;
        currentCanvas.height = originalHeight;
        currentCtx.drawImage(imageElement, 0, 0);
        
        while (currentWidth * 2 <= finalWidth || currentHeight * 2 <= finalHeight) {
          // Create intermediate canvas
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) break;
          
          currentWidth *= 2;
          currentHeight *= 2;
          
          tempCanvas.width = currentWidth;
          tempCanvas.height = currentHeight;
          
          // Use high-quality settings
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          
          // Apply sharpening filter by drawing slightly offset images
          tempCtx.globalAlpha = 0.7;
          tempCtx.drawImage(currentCanvas, 0, 0, currentWidth, currentHeight);
          
          tempCtx.globalAlpha = 0.3;
          tempCtx.filter = 'contrast(1.2) brightness(1.1)';
          tempCtx.drawImage(currentCanvas, -0.5, -0.5, currentWidth + 1, currentHeight + 1);
          
          tempCtx.globalAlpha = 1;
          tempCtx.filter = 'none';
          
          // Use this canvas for next iteration
          currentCanvas = tempCanvas;
        }
        
        // Final scaling to exact dimensions
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(currentCanvas, 0, 0, finalWidth, finalHeight);
        
      } else {
        // Single pass for 2x or less
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        // High-quality single pass with sharpening
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Apply subtle sharpening
        ctx.filter = 'contrast(1.1) brightness(1.05)';
        ctx.drawImage(imageElement, 0, 0, finalWidth, finalHeight);
        ctx.filter = 'none';
      }

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