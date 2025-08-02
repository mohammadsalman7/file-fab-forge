import { useState } from 'react';
import { Upload, Download, Loader2, Edit3, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolCard } from '@/components/ToolCard';
import { FileDropzone } from '@/components/FileDropzone';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { ManualEditor } from './ManualEditor';
import { BackgroundCustomizer } from './BackgroundCustomizer';
import { removeBackground, loadImage } from '@/utils/advancedBackgroundRemoval';
import { toast } from 'sonner';

export const BackgroundRemover = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [showBackgroundCustomizer, setShowBackgroundCustomizer] = useState(false);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setProcessedImage(null);
    setFinalImage(null);
    setCustomBackground(null);
    setProgress(0);
    setShowManualEditor(false);
    setShowBackgroundCustomizer(false);
  };

  const handleRemoveBackground = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      setProgress(30);
      toast.info('Loading AI model... This may take a moment on first use.');
      const imageElement = await loadImage(originalFile);
      
      setProgress(60);
      toast.info('Processing image with AI...');
      const resultBlob = await removeBackground(imageElement);
      
      setProgress(90);
      const imageUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(imageUrl);
      setFinalImage(imageUrl);
      
      setProgress(100);
      toast.success('Background removed successfully!');
    } catch (error) {
      console.error('Background removal failed:', error);
      toast.error('Failed to remove background. Please try a different image.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleManualEdit = (editedBlob: Blob) => {
    const imageUrl = URL.createObjectURL(editedBlob);
    setFinalImage(imageUrl);
    setShowManualEditor(false);
    toast.success('Manual edits applied successfully!');
  };

  const handleCustomBackground = (backgroundBlob: Blob) => {
    const imageUrl = URL.createObjectURL(backgroundBlob);
    setCustomBackground(imageUrl);
    toast.success('Background applied successfully!');
  };

  const handleDownload = (filename: string) => {
    const imageToDownload = customBackground || finalImage || processedImage;
    if (!imageToDownload) return;

    const link = document.createElement('a');
    link.href = imageToDownload;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded successfully!');
  };

  return (
    <ToolCard
      title="AI Background Remover"
      description="Professional background removal with manual editing tools"
      icon={<Upload className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={['image/*']}
            title="Drop your image here"
            description="Supports JPG, PNG, WebP - works with logos, people, products, and text"
          />
        ) : (
          <div className="space-y-6">
            {/* Processing Section */}
            {!processedImage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Ready to Process</h3>
                    <p className="text-sm text-muted-foreground">
                      File: {originalFile.name} ({(originalFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                  <Button 
                    onClick={handleRemoveBackground}
                    disabled={isProcessing}
                    className="min-w-[120px]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Remove Background'
                    )}
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing with AI...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      First-time model loading may take longer. Subsequent uses will be faster.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Before/After Comparison */}
            {originalImageUrl && processedImage && !showManualEditor && !showBackgroundCustomizer && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Before & After Comparison</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowManualEditor(true)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Manual Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBackgroundCustomizer(true)}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Custom Background
                    </Button>
                    <Button
                      onClick={() => handleDownload(`background-removed-${Date.now()}.png`)}
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <BeforeAfterComparison
                  beforeImage={originalImageUrl}
                  afterImage={customBackground || finalImage || processedImage}
                />
              </div>
            )}

            {/* Manual Editor */}
            {showManualEditor && originalImageUrl && processedImage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Manual Editor</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowManualEditor(false)}
                  >
                    Back to Comparison
                  </Button>
                </div>
                
                <ManualEditor
                  originalImage={originalImageUrl}
                  processedImage={processedImage}
                  onSave={handleManualEdit}
                />
              </div>
            )}

            {/* Background Customizer */}
            {showBackgroundCustomizer && processedImage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Background Customizer</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowBackgroundCustomizer(false)}
                  >
                    Back to Comparison
                  </Button>
                </div>
                
                <BackgroundCustomizer
                  transparentImage={finalImage || processedImage}
                  onCustomBackground={handleCustomBackground}
                />
              </div>
            )}

            {/* Start Over */}
            <div className="text-center">
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setOriginalImageUrl(null);
                  setProcessedImage(null);
                  setFinalImage(null);
                  setCustomBackground(null);
                  setProgress(0);
                  setShowManualEditor(false);
                  setShowBackgroundCustomizer(false);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Choose different image
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
};