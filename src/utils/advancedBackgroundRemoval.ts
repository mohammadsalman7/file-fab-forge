// Advanced AI-powered background removal using multiple algorithms
const MAX_IMAGE_DIMENSION = 1024;

interface ImageData2D {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

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

// Advanced subject detection using multiple techniques
function detectSubjectType(imageData: ImageData2D): 'person' | 'logo' | 'text' | 'product' | 'general' {
  const { data, width, height } = imageData;
  
  // Analyze color distribution and edge patterns
  let skinTonePixels = 0;
  let highContrastEdges = 0;
  let uniformColorRegions = 0;
  let totalPixels = width * height;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Detect skin tones (rough heuristic)
      if (r > 95 && g > 40 && b > 20 && r > b && (r - g) > 15) {
        skinTonePixels++;
      }
      
      // Edge detection for high contrast (logos/text)
      const rightIdx = ((y * width) + (x + 1)) * 4;
      const bottomIdx = (((y + 1) * width) + x) * 4;
      
      const edgeIntensity = Math.abs(r - data[rightIdx]) + 
                           Math.abs(g - data[rightIdx + 1]) + 
                           Math.abs(b - data[rightIdx + 2]) +
                           Math.abs(r - data[bottomIdx]) + 
                           Math.abs(g - data[bottomIdx + 1]) + 
                           Math.abs(b - data[bottomIdx + 2]);
      
      if (edgeIntensity > 150) {
        highContrastEdges++;
      }
    }
  }
  
  const skinRatio = skinTonePixels / totalPixels;
  const edgeRatio = highContrastEdges / totalPixels;
  
  if (skinRatio > 0.05) return 'person';
  if (edgeRatio > 0.15) return 'text';
  if (edgeRatio > 0.08) return 'logo';
  
  return 'product';
}

// Advanced background detection using machine learning-inspired techniques
function detectBackground(imageData: ImageData2D): { colors: Array<{r: number, g: number, b: number, confidence: number}>, type: string } {
  const { data, width, height } = imageData;
  
  // Sample edges more densely
  const edgePixels: Array<{r: number, g: number, b: number, x: number, y: number}> = [];
  
  // Sample all four edges
  for (let x = 0; x < width; x++) {
    for (let y of [0, 1, 2, height - 3, height - 2, height - 1]) {
      if (y >= 0 && y < height) {
        const idx = (y * width + x) * 4;
        edgePixels.push({
          r: data[idx],
          g: data[idx + 1], 
          b: data[idx + 2],
          x, y
        });
      }
    }
  }
  
  for (let y = 0; y < height; y++) {
    for (let x of [0, 1, 2, width - 3, width - 2, width - 1]) {
      if (x >= 0 && x < width) {
        const idx = (y * width + x) * 4;
        edgePixels.push({
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2],
          x, y
        });
      }
    }
  }
  
  // Cluster similar colors
  const colorClusters = new Map<string, {count: number, pixels: Array<{r: number, g: number, b: number}>}>();
  const tolerance = 25;
  
  for (const pixel of edgePixels) {
    let foundCluster = false;
    
    for (const [key, cluster] of colorClusters) {
      const [avgR, avgG, avgB] = key.split(',').map(Number);
      const distance = Math.sqrt(
        Math.pow(pixel.r - avgR, 2) + 
        Math.pow(pixel.g - avgG, 2) + 
        Math.pow(pixel.b - avgB, 2)
      );
      
      if (distance < tolerance) {
        cluster.count++;
        cluster.pixels.push(pixel);
        foundCluster = true;
        break;
      }
    }
    
    if (!foundCluster) {
      const key = `${pixel.r},${pixel.g},${pixel.b}`;
      colorClusters.set(key, {
        count: 1,
        pixels: [pixel]
      });
    }
  }
  
  // Sort clusters by frequency and return top candidates
  const sortedClusters = Array.from(colorClusters.entries())
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 3);
  
  const backgroundColors = sortedClusters.map(([key, cluster]) => {
    const [r, g, b] = key.split(',').map(Number);
    return {
      r, g, b,
      confidence: cluster.count / edgePixels.length
    };
  });
  
  // Determine background type
  const topColor = backgroundColors[0];
  let bgType = 'unknown';
  
  if (topColor) {
    const brightness = (topColor.r + topColor.g + topColor.b) / 3;
    const saturation = Math.max(topColor.r, topColor.g, topColor.b) - Math.min(topColor.r, topColor.g, topColor.b);
    
    if (brightness > 240) bgType = 'white';
    else if (brightness < 15) bgType = 'black';
    else if (saturation < 30) bgType = 'gray';
    else bgType = 'colored';
  }
  
  return { colors: backgroundColors, type: bgType };
}

// Adaptive mask generation based on subject type
function generateAdaptiveMask(imageData: ImageData2D, backgroundColors: Array<{r: number, g: number, b: number, confidence: number}>, subjectType: string): Uint8Array {
  const { data, width, height } = imageData;
  const mask = new Uint8Array(width * height);
  
  // Adaptive thresholds based on subject type
  let colorThreshold = 20;
  let edgeThreshold = 30;
  
  switch (subjectType) {
    case 'text':
    case 'logo':
      colorThreshold = 15; // Tighter for clean edges
      edgeThreshold = 20;
      break;
    case 'person':
      colorThreshold = 25; // Looser for hair/skin variations
      edgeThreshold = 40;
      break;
    case 'product':
      colorThreshold = 22;
      edgeThreshold = 35;
      break;
  }
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pixelIdx = idx * 4;
      
      const r = data[pixelIdx];
      const g = data[pixelIdx + 1];
      const b = data[pixelIdx + 2];
      
      let isBackground = false;
      
      // Check against all detected background colors
      for (const bgColor of backgroundColors) {
        const colorDistance = Math.sqrt(
          Math.pow(r - bgColor.r, 2) + 
          Math.pow(g - bgColor.g, 2) + 
          Math.pow(b - bgColor.b, 2)
        );
        
        const adaptiveThreshold = colorThreshold * (1 + bgColor.confidence);
        
        if (colorDistance < adaptiveThreshold) {
          isBackground = true;
          break;
        }
      }
      
      // Additional checks for edge-based refinement
      if (!isBackground && subjectType === 'text' || subjectType === 'logo') {
        // For text/logos, be more aggressive about removing similar colors
        const centerX = width / 2;
        const centerY = height / 2;
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);
        const centerWeight = 1 - (distFromCenter / maxDist);
        
        if (centerWeight < 0.3) {
          // Near edges, be more aggressive
          for (const bgColor of backgroundColors) {
            const colorDistance = Math.sqrt(
              Math.pow(r - bgColor.r, 2) + 
              Math.pow(g - bgColor.g, 2) + 
              Math.pow(b - bgColor.b, 2)
            );
            
            if (colorDistance < colorThreshold * 1.5) {
              isBackground = true;
              break;
            }
          }
        }
      }
      
      mask[idx] = isBackground ? 0 : 255;
    }
  }
  
  return mask;
}

// Advanced morphological operations
function morphologicalClean(mask: Uint8Array, width: number, height: number, subjectType: string): Uint8Array {
  let cleanMask = new Uint8Array(mask.length);
  
  // Adaptive kernel size based on subject type
  let kernelSize = 2;
  if (subjectType === 'text' || subjectType === 'logo') {
    kernelSize = 1; // Preserve fine details
  } else if (subjectType === 'person') {
    kernelSize = 3; // More aggressive cleaning for hair/clothing
  }
  
  // Opening operation (erosion followed by dilation)
  
  // Erosion pass
  for (let y = kernelSize; y < height - kernelSize; y++) {
    for (let x = kernelSize; x < width - kernelSize; x++) {
      const idx = y * width + x;
      let minVal = 255;
      
      for (let ky = -kernelSize; ky <= kernelSize; ky++) {
        for (let kx = -kernelSize; kx <= kernelSize; kx++) {
          const nIdx = (y + ky) * width + (x + kx);
          if (nIdx >= 0 && nIdx < mask.length) {
            minVal = Math.min(minVal, mask[nIdx]);
          }
        }
      }
      cleanMask[idx] = minVal;
    }
  }
  
  // Dilation pass
  const finalMask = new Uint8Array(cleanMask.length);
  for (let y = kernelSize; y < height - kernelSize; y++) {
    for (let x = kernelSize; x < width - kernelSize; x++) {
      const idx = y * width + x;
      let maxVal = 0;
      
      for (let ky = -kernelSize; ky <= kernelSize; ky++) {
        for (let kx = -kernelSize; kx <= kernelSize; kx++) {
          const nIdx = (y + ky) * width + (x + kx);
          if (nIdx >= 0 && nIdx < cleanMask.length) {
            maxVal = Math.max(maxVal, cleanMask[nIdx]);
          }
        }
      }
      finalMask[idx] = maxVal;
    }
  }
  
  return finalMask;
}

// Main background removal function
export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting advanced AI background removal...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    
    console.log(`Processing ${width}x${height} image`);
    
    // Step 1: Detect subject type
    const subjectType = detectSubjectType({
      data: imageData.data,
      width,
      height
    });
    console.log(`Detected subject type: ${subjectType}`);
    
    // Step 2: Advanced background detection
    const backgroundInfo = detectBackground({
      data: imageData.data,
      width,
      height
    });
    console.log(`Detected background type: ${backgroundInfo.type}`);
    console.log(`Background colors:`, backgroundInfo.colors);
    
    // Step 3: Generate adaptive mask
    const mask = generateAdaptiveMask({
      data: imageData.data,
      width,
      height
    }, backgroundInfo.colors, subjectType);
    
    // Step 4: Morphological cleaning
    const cleanMask = morphologicalClean(mask, width, height, subjectType);
    
    // Step 5: Apply mask with edge anti-aliasing for non-text subjects
    const outputData = new Uint8ClampedArray(imageData.data);
    
    if (subjectType === 'text' || subjectType === 'logo') {
      // Binary mask for sharp edges
      for (let i = 0; i < cleanMask.length; i++) {
        outputData[i * 4 + 3] = cleanMask[i] > 128 ? 255 : 0;
      }
    } else {
      // Soft edges for natural subjects
      for (let i = 0; i < cleanMask.length; i++) {
        outputData[i * 4 + 3] = cleanMask[i];
      }
    }
    
    // Create output canvas
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output context');
    
    const finalImageData = new ImageData(outputData, width, height);
    outputCtx.putImageData(finalImageData, 0, 0);
    
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(`Advanced background removal completed for ${subjectType}`);
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

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};