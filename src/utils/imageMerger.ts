// Image Merger Utility - Merge multiple images into a single image
export interface ImageMergerOptions {
  layout: 'horizontal' | 'vertical' | 'grid' | 'collage';
  spacing: number;
  backgroundColor: string;
  maxWidth?: number;
  maxHeight?: number;
  gridColumns?: number;
  gridRows?: number;
  quality: number;
}

export interface MergedImageResult {
  success: boolean;
  mergedImage?: Blob;
  error?: string;
  width: number;
  height: number;
  fileCount: number;
}

export interface ImageFile {
  file: File;
  width: number;
  height: number;
  aspectRatio: number;
}

// Validate image files
export function validateImageFiles(files: File[]): { valid: boolean; error?: string } {
  if (files.length === 0) {
    return { valid: false, error: 'No files selected' };
  }

  if (files.length > 20) {
    return { valid: false, error: 'Maximum 20 images allowed' };
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  for (const file of files) {
    if (file.size > maxSize) {
      return { valid: false, error: `File ${file.name} is too large (max 50MB)` };
    }

    if (!file.type.startsWith('image/')) {
      return { valid: false, error: `File ${file.name} is not a valid image` };
    }
  }

  return { valid: true };
}

// Load image and get dimensions
export function loadImage(file: File): Promise<ImageFile> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        file,
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

// Calculate layout dimensions
function calculateLayoutDimensions(
  images: ImageFile[],
  options: ImageMergerOptions
): { width: number; height: number; positions: Array<{ x: number; y: number; width: number; height: number }> } {
  const { layout, spacing, maxWidth = 4000, maxHeight = 4000, gridColumns = 2, gridRows } = options;

  if (layout === 'horizontal') {
    return calculateHorizontalLayout(images, spacing, maxWidth, maxHeight);
  } else if (layout === 'vertical') {
    return calculateVerticalLayout(images, spacing, maxWidth, maxHeight);
  } else if (layout === 'grid') {
    return calculateGridLayout(images, spacing, maxWidth, maxHeight, gridColumns, gridRows);
  } else {
    return calculateCollageLayout(images, spacing, maxWidth, maxHeight);
  }
}

function calculateHorizontalLayout(
  images: ImageFile[],
  spacing: number,
  maxWidth: number,
  maxHeight: number
) {
  const totalWidth = images.reduce((sum, img) => sum + img.width, 0) + (spacing * (images.length - 1));
  const maxImageHeight = Math.max(...images.map(img => img.height));
  
  // Scale to fit max dimensions
  const scaleX = totalWidth > 0 ? Math.min(1, maxWidth / totalWidth) : 1;
  const scaleY = maxImageHeight > 0 ? Math.min(1, maxHeight / maxImageHeight) : 1;
  const scale = Math.min(scaleX, scaleY);

  const finalWidth = Math.round(totalWidth * scale);
  const finalHeight = Math.round(maxImageHeight * scale);

  const positions: Array<{ x: number; y: number; width: number; height: number }> = [];
  
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const x = i === 0 ? 0 : 
      positions[i - 1].x + positions[i - 1].width + (spacing * scale);
    
    positions.push({
      x: Math.round(x),
      y: 0,
      width: Math.round(img.width * scale),
      height: Math.round(img.height * scale)
    });
  }

  return { width: finalWidth, height: finalHeight, positions };
}

function calculateVerticalLayout(
  images: ImageFile[],
  spacing: number,
  maxWidth: number,
  maxHeight: number
) {
  const maxImageWidth = Math.max(...images.map(img => img.width));
  const totalHeight = images.reduce((sum, img) => sum + img.height, 0) + (spacing * (images.length - 1));
  
  const scaleX = maxImageWidth > 0 ? Math.min(1, maxWidth / maxImageWidth) : 1;
  const scaleY = totalHeight > 0 ? Math.min(1, maxHeight / totalHeight) : 1;
  const scale = Math.min(scaleX, scaleY);

  const finalWidth = Math.round(maxImageWidth * scale);
  const finalHeight = Math.round(totalHeight * scale);

  const positions: Array<{ x: number; y: number; width: number; height: number }> = [];
  
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const y = i === 0 ? 0 : 
      positions[i - 1].y + positions[i - 1].height + (spacing * scale);
    
    positions.push({
      x: 0,
      y: Math.round(y),
      width: Math.round(img.width * scale),
      height: Math.round(img.height * scale)
    });
  }

  return { width: finalWidth, height: finalHeight, positions };
}

function calculateGridLayout(
  images: ImageFile[],
  spacing: number,
  maxWidth: number,
  maxHeight: number,
  gridColumns: number,
  gridRows?: number
) {
  const cols = Math.max(1, gridColumns);
  const rows = Math.max(1, gridRows || Math.ceil(images.length / cols));

  // Calculate cell dimensions based on largest image
  const maxImageWidth = Math.max(...images.map(img => img.width));
  const maxImageHeight = Math.max(...images.map(img => img.height));

  const cellWidth = Math.max(1, (maxWidth - (spacing * (cols - 1))) / cols);
  const cellHeight = Math.max(1, (maxHeight - (spacing * (rows - 1))) / rows);

  const scaleX = maxImageWidth > 0 ? Math.min(1, cellWidth / maxImageWidth) : 1;
  const scaleY = maxImageHeight > 0 ? Math.min(1, cellHeight / maxImageHeight) : 1;
  const scale = Math.min(scaleX, scaleY);

  const finalWidth = Math.round((cellWidth * cols) + (spacing * (cols - 1)));
  const finalHeight = Math.round((cellHeight * rows) + (spacing * (rows - 1)));

  const positions = images.map((img, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const x = col * (cellWidth + spacing);
    const y = row * (cellHeight + spacing);

    return {
      x: Math.round(x + (cellWidth - img.width * scale) / 2),
      y: Math.round(y + (cellHeight - img.height * scale) / 2),
      width: Math.round(img.width * scale),
      height: Math.round(img.height * scale)
    };
  });

  return { width: finalWidth, height: finalHeight, positions };
}

function calculateCollageLayout(
  images: ImageFile[],
  spacing: number,
  maxWidth: number,
  maxHeight: number
) {
  // Simple collage: arrange images in a more organic pattern
  const positions: Array<{ x: number; y: number; width: number; height: number }> = [];
  
  let currentX = 0;
  let currentY = 0;
  let rowHeight = 0;
  let maxRowWidth = 0;

  for (const img of images) {
    // Scale image to reasonable size
    const maxDimension = Math.max(img.width, img.height);
    const scale = maxDimension > 0 ? Math.min(1, 800 / maxDimension) : 1;
    const scaledWidth = Math.round(img.width * scale);
    const scaledHeight = Math.round(img.height * scale);

    // Check if image fits in current row
    if (currentX + scaledWidth > maxWidth) {
      currentX = 0;
      currentY += rowHeight + spacing;
      rowHeight = 0;
    }

    positions.push({
      x: currentX,
      y: currentY,
      width: scaledWidth,
      height: scaledHeight
    });

    currentX += scaledWidth + spacing;
    rowHeight = Math.max(rowHeight, scaledHeight);
    maxRowWidth = Math.max(maxRowWidth, currentX - spacing);
  }

  return {
    width: Math.min(maxRowWidth, maxWidth),
    height: currentY + rowHeight,
    positions
  };
}

// Draw image on canvas
function drawImageOnCanvas(
  canvas: HTMLCanvasElement,
  imageFile: ImageFile,
  position: { x: number; y: number; width: number; height: number }
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile.file);

    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, position.x, position.y, position.width, position.height);
      URL.revokeObjectURL(url);
      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${imageFile.file.name}`));
    };

    img.src = url;
  });
}

// Main merge function
export async function mergeImages(
  files: File[],
  options: ImageMergerOptions
): Promise<MergedImageResult> {
  try {
    // Validate files
    const validation = validateImageFiles(files);
    if (!validation.valid) {
      return { success: false, error: validation.error, width: 0, height: 0, fileCount: 0 };
    }

    // Validate options
    if (options.spacing < 0 || options.spacing > 100) {
      return { success: false, error: 'Spacing must be between 0 and 100 pixels', width: 0, height: 0, fileCount: 0 };
    }

    if (options.quality < 0.1 || options.quality > 1) {
      return { success: false, error: 'Quality must be between 0.1 and 1', width: 0, height: 0, fileCount: 0 };
    }

    // Load all images
    const imageFiles: ImageFile[] = [];
    for (const file of files) {
      try {
        const imageFile = await loadImage(file);
        imageFiles.push(imageFile);
      } catch (error) {
        return { 
          success: false, 
          error: `Failed to load image: ${file.name}`, 
          width: 0, 
          height: 0, 
          fileCount: 0 
        };
      }
    }

    // Calculate layout
    const layout = calculateLayoutDimensions(imageFiles, options);

    // Validate layout dimensions
    if (layout.width <= 0 || layout.height <= 0) {
      return { 
        success: false, 
        error: 'Invalid layout dimensions calculated', 
        width: 0, 
        height: 0, 
        fileCount: 0 
      };
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = layout.width;
    canvas.height = layout.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { 
        success: false, 
        error: 'Failed to create canvas context', 
        width: 0, 
        height: 0, 
        fileCount: 0 
      };
    }

    // Set background color
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, layout.width, layout.height);

    // Draw images
    for (let i = 0; i < imageFiles.length; i++) {
      try {
        await drawImageOnCanvas(canvas, imageFiles[i], layout.positions[i]);
      } catch (error) {
        return { 
          success: false, 
          error: `Failed to draw image: ${imageFiles[i].file.name}`, 
          width: 0, 
          height: 0, 
          fileCount: 0 
        };
      }
    }

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/png',
        options.quality
      );
    });

    return {
      success: true,
      mergedImage: blob,
      width: layout.width,
      height: layout.height,
      fileCount: imageFiles.length
    };

  } catch (error) {
    console.error('Error merging images:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred while merging images', 
      width: 0, 
      height: 0, 
      fileCount: 0 
    };
  }
}

// Generate filename for merged image
export function generateMergedFilename(files: File[], layout: string): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const baseName = files.length === 1 ? 
    files[0].name.replace(/\.[^/.]+$/, '') : 
    'merged-images';
  
  return `${baseName}-${layout}-${timestamp}.png`;
}
