import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessingCard } from '@/components/ProcessingCard';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { upscaleImage, downscaleImage } from '@/utils/imageUpscaler';
import { loadImage } from '@/utils/backgroundRemoval';
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
      const imageElement = await loadImage(originalFile);
      const result = await upscaleImage(imageElement, scale);
      
      setProcessedFile(result);
      toast.success(`Image upscaled ${scale}x successfully!`);
    } catch (error) {
      console.error('Error upscaling image:', error);
      toast.error('Failed to upscale image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimize = async () => {
    if (!originalFile) return;

    setIsProcessing(true);

    try {
      const imageElement = await loadImage(originalFile);
      const result = await downscaleImage(imageElement, 1024);
      
      setProcessedFile(result);
      toast.success('Image optimized successfully!');
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
    a.download = `${originalFile.name.split('.')[0]}_processed.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolCard
      title="Image Upscaler"
      description="Upscale and optimize your images"
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setScale(2)}
                variant={scale === 2 ? "default" : "outline"}
                className="text-sm"
              >
                2x Scale
              </Button>
              <Button
                onClick={() => setScale(4)}
                variant={scale === 4 ? "default" : "outline"}
                className="text-sm"
              >
                4x Scale
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleUpscale}
                disabled={isProcessing}
                className="bg-gradient-primary hover:opacity-90"
              >
                Upscale {scale}x
              </Button>
              <Button
                onClick={handleOptimize}
                disabled={isProcessing}
                variant="outline"
                className="border-primary/30"
              >
                Optimize
              </Button>
            </div>

            {processedFile && (
              <Button
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Download Result
              </Button>
            )}

            {originalFile && (
              <div className="p-3 bg-secondary/20 rounded-lg">
                <p className="text-sm font-medium truncate">{originalFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(originalFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            )}
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