import { useState } from 'react';
import { Scissors } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessingCard } from '@/components/ProcessingCard';
import { ToolCard } from '@/components/ToolCard';
import { removeBackground, loadImage } from '@/utils/backgroundRemovalFixed';
import { toast } from 'sonner';

export const BackgroundRemover = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setProcessedFile(null);
    setProgress(0);
  };

  const handleRemoveBackground = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      toast.info('Loading AI model... This may take a moment on first use.');
      setProgress(20);

      const imageElement = await loadImage(originalFile);
      setProgress(40);

      toast.info('Processing image with AI...');
      setProgress(60);
      
      const result = await removeBackground(imageElement);
      setProgress(100);

      setProcessedFile(result);
      toast.success('Background removed successfully! Check the result below.');
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Failed to remove background. The AI model may still be loading, please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile || !originalFile) return;

    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFile.name.split('.')[0]}_no_bg.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolCard
      title="Background Remover"
      description="Remove backgrounds from images using AI"
      icon={<Scissors className="h-6 w-6" />}
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
            title="Remove Background"
            description="AI-powered background removal"
            icon={<Scissors className="h-5 w-5" />}
            isProcessing={isProcessing}
            progress={progress}
            originalFile={originalFile}
            processedFile={processedFile}
            onProcess={handleRemoveBackground}
            onDownload={handleDownload}
          />
        )}

        {originalFile && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setOriginalFile(null);
                setProcessedFile(null);
                setProgress(0);
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