export const upscaleImage = async (imageElement: HTMLImageElement, scale: number = 2): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const originalWidth = imageElement.naturalWidth;
      const originalHeight = imageElement.naturalHeight;
      
      // Calculate new dimensions
      const newWidth = Math.round(originalWidth * scale);
      const newHeight = Math.round(originalHeight * scale);
      
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Use better image smoothing settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // For better results, use multiple-pass upscaling for large scale factors
      if (scale > 2) {
        // Create intermediate canvas for better quality
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          // First pass: scale by 2
          tempCanvas.width = originalWidth * 2;
          tempCanvas.height = originalHeight * 2;
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          tempCtx.drawImage(imageElement, 0, 0, tempCanvas.width, tempCanvas.height);
          
          // Second pass: scale to final size
          ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
        } else {
          // Fallback to single pass
          ctx.drawImage(imageElement, 0, 0, newWidth, newHeight);
        }
      } else {
        // Single pass for smaller scale factors
        ctx.drawImage(imageElement, 0, 0, newWidth, newHeight);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
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