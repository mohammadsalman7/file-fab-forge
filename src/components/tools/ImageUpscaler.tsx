import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessingCard } from '@/components/ProcessingCard';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { upscaleImage, downscaleImage } from '@/utils/imageUpscaler';
import { loadImage } from '@/utils/backgroundRemovalFixed';
import { toast } from 'sonner';

export const ImageUpscaler = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState(2);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setProcessedFile(null);
  };

  const handleUpscale = async () => {
    if (!originalFile) return;

    setIsProcessing(true);

    try {
      toast.info(`Upscaling image to ${scale}x HD quality... This may take a moment.`);
      const imageElement = await loadImage(originalFile);
      
      const result = await upscaleImage(imageElement, scale);
      
      setProcessedFile(result);
      toast.success(`Image successfully upscaled to ${scale}x HD quality! Download to see the full resolution.`);
    } catch (error) {
      console.error('Error upscaling image:', error);
      toast.error('Failed to upscale image. Please try a smaller scale factor.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimize = async () => {
    if (!originalFile) return;

    setIsProcessing(true);

    try {
      toast.info('Optimizing image for web... Reducing file size while maintaining quality.');
      const imageElement = await loadImage(originalFile);
      const result = await downscaleImage(imageElement, 1024);
      
      setProcessedFile(result);
      toast.success('Image optimized successfully! File size reduced while maintaining quality.');
    } catch (error) {
      console.error('Error optimizing image:', error);
      toast.error('Failed to optimize image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile || !originalFile) return;

    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFile.name.split('.')[0]}_upscaled_${scale}x_hd.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolCard
      title="Image Upscaler"
      description="Enhance image quality with AI upscaling to HD"
      icon={<Maximize2 className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={['image/*']}
            title="Drop your image here"
            description="Supports JPG, PNG, WebP formats"
          />
        ) : (
          <ProcessingCard
            title="Upscale to HD"
            description="AI-powered image enhancement"
            icon={<Maximize2 className="h-5 w-5" />}
            isProcessing={isProcessing}
            progress={isProcessing ? 75 : 0}
            originalFile={originalFile}
            processedFile={processedFile}
            onProcess={handleUpscale}
            onDownload={handleDownload}
          />
        )}

        {originalFile && !isProcessing && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setScale(2)}
              variant={scale === 2 ? "default" : "outline"}
              className="text-sm"
            >
              2x HD
            </Button>
            <Button
              onClick={() => setScale(4)}
              variant={scale === 4 ? "default" : "outline"}
              className="text-sm"
            >
              4x Ultra HD
            </Button>
          </div>
        )}

        {originalFile && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setOriginalFile(null);
                setProcessedFile(null);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Choose different image
            </button>
          </div>
        )}
      </div>
    </ToolCard>
  );
};