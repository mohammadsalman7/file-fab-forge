import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

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

export const removeBackgroundAdvanced = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting advanced background removal process...');
    
    // Create canvas from image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize if needed
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    // Create output canvas
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Get image data for processing
    const imageData = outputCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simple edge-based background removal
    // This creates a rough mask based on edge detection and color similarity
    const threshold = 30; // Adjust this for sensitivity
    const edgeData = new Uint8Array(data.length / 4);
    
    // Detect edges and create initial mask
    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        const idx = (y * canvas.width + x) * 4;
        const centerIdx = idx / 4;
        
        // Get surrounding pixels
        const current = [data[idx], data[idx + 1], data[idx + 2]];
        const right = [data[idx + 4], data[idx + 5], data[idx + 6]];
        const bottom = [data[idx + canvas.width * 4], data[idx + canvas.width * 4 + 1], data[idx + canvas.width * 4 + 2]];
        
        // Calculate color difference
        const diffRight = Math.abs(current[0] - right[0]) + Math.abs(current[1] - right[1]) + Math.abs(current[2] - right[2]);
        const diffBottom = Math.abs(current[0] - bottom[0]) + Math.abs(current[1] - bottom[1]) + Math.abs(current[2] - bottom[2]);
        
        // If pixel is on an edge or in the center area, keep it
        const isEdge = diffRight > threshold || diffBottom > threshold;
        const distanceFromCenter = Math.sqrt(Math.pow(x - canvas.width/2, 2) + Math.pow(y - canvas.height/2, 2));
        const maxDistance = Math.sqrt(Math.pow(canvas.width/2, 2) + Math.pow(canvas.height/2, 2));
        const centerWeight = 1 - (distanceFromCenter / maxDistance);
        
        edgeData[centerIdx] = isEdge || centerWeight > 0.3 ? 255 : 0;
      }
    }
    
    // Apply morphological operations to clean up the mask
    const cleanedMask = new Uint8Array(edgeData.length);
    const kernelSize = 3;
    const offset = Math.floor(kernelSize / 2);
    
    for (let y = offset; y < canvas.height - offset; y++) {
      for (let x = offset; x < canvas.width - offset; x++) {
        const centerIdx = y * canvas.width + x;
        let sum = 0;
        
        // Apply erosion followed by dilation (opening operation)
        for (let ky = -offset; ky <= offset; ky++) {
          for (let kx = -offset; kx <= offset; kx++) {
            const idx = (y + ky) * canvas.width + (x + kx);
            if (idx >= 0 && idx < edgeData.length) {
              sum += edgeData[idx] > 0 ? 1 : 0;
            }
          }
        }
        
        cleanedMask[centerIdx] = sum > kernelSize * kernelSize * 0.5 ? 255 : 0;
      }
    }
    
    // Apply the mask to make background transparent
    for (let i = 0; i < cleanedMask.length; i++) {
      const alpha = cleanedMask[i];
      data[i * 4 + 3] = alpha; // Set alpha channel
    }
    
    outputCtx.putImageData(imageData, 0, 0);
    console.log('Advanced background removal applied successfully');
    
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
    console.error('Error in advanced background removal:', error);
    throw error;
  }
};

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');
    
    // Use the segmentation model
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
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
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('Segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      console.log('Falling back to advanced background removal...');
      return removeBackgroundAdvanced(imageElement);
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Get the image data
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    // Find person/main subject segments and create mask
    const keepLabels = ['person', 'animal', 'dog', 'cat', 'bicycle', 'car', 'motorbike', 'bus', 'truck', 'bottle', 'chair', 'sofa', 'plant', 'food'];
    const removeLabels = ['wall', 'building', 'sky', 'floor', 'ceiling', 'road', 'grass', 'sidewalk', 'earth', 'mountain', 'sea', 'water'];
    
    // Create combined mask
    const finalMask = new Float32Array(outputCanvas.width * outputCanvas.height);
    finalMask.fill(0.5); // Default to keep
    
    for (const segment of result) {
      if (segment.label && segment.mask && segment.mask.data) {
        const label = segment.label.toLowerCase();
        let shouldKeep = 0.5; // neutral
        
        if (keepLabels.some(keepLabel => label.includes(keepLabel))) {
          shouldKeep = 1.0; // definitely keep
        } else if (removeLabels.some(removeLabel => label.includes(removeLabel))) {
          shouldKeep = 0.0; // definitely remove
        }
        
        // Apply this segment's influence to the final mask
        for (let i = 0; i < segment.mask.data.length; i++) {
          const segmentValue = segment.mask.data[i];
          if (segmentValue > 0.3) { // Only apply if segment is confident
            finalMask[i] = shouldKeep;
          }
        }
      }
    }
    
    // Apply the final mask
    for (let i = 0; i < finalMask.length; i++) {
      const maskValue = finalMask[i];
      if (maskValue < 0.3) {
        data[i * 4 + 3] = 0; // Make transparent
      } else {
        // Keep original or enhance alpha
        data[i * 4 + 3] = Math.min(255, data[i * 4 + 3] * maskValue * 1.2);
      }
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Background removal applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
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
    console.error('Error removing background:', error);
    // Fallback to advanced background removal
    console.log('Falling back to advanced background removal...');
    return removeBackgroundAdvanced(imageElement);
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
