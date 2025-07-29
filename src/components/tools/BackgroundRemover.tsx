import { useState, useRef } from 'react';
import { Scissors, Download, Palette, Focus, Sparkles, Upload } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ToolCard } from '@/components/ToolCard';
import { removeBackground, loadImage } from '@/utils/advancedBackgroundRemoval';
import { addCustomBackground, addBlurBackground, addShadowEffect } from '@/utils/backgroundRemovalFixed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export const BackgroundRemover = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [transparentImage, setTransparentImage] = useState<HTMLImageElement | null>(null);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [blurRadius, setBlurRadius] = useState([10]);
  const [shadowOffsetX, setShadowOffsetX] = useState([10]);
  const [shadowOffsetY, setShadowOffsetY] = useState([10]);
  const [shadowBlur, setShadowBlur] = useState([15]);
  const backgroundFileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setTransparentImage(null);
    setProcessedFile(null);
    setProgress(0);
  };

  const handleRemoveBackground = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      toast.info('Loading advanced AI model for precise edge detection...');
      setProgress(20);

      const imageElement = await loadImage(originalFile);
      setProgress(40);

      toast.info('Analyzing borders and removing background...');
      setProgress(60);
      
      const result = await removeBackground(imageElement);
      setProgress(80);

      // Create transparent image element for further processing
      const transparentImg = new Image();
      transparentImg.onload = () => {
        setTransparentImage(transparentImg);
        setProgress(100);
        toast.success('Background removed with precision! Now add professional effects below.');
      };
      transparentImg.src = URL.createObjectURL(result);
      
      setProcessedFile(result);
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomBackground = async (type: 'color' | 'image' | 'blur' | 'shadow') => {
    if (!transparentImage) return;

    setIsProcessing(true);
    try {
      let result: Blob;
      
      switch (type) {
        case 'color':
          result = await addCustomBackground(transparentImage, backgroundColor);
          toast.success('Custom background added!');
          break;
        case 'image':
          if (backgroundFileRef.current?.files?.[0]) {
            const bgImg = await loadImage(backgroundFileRef.current.files[0]);
            result = await addCustomBackground(transparentImage, bgImg);
            toast.success('Background image applied!');
          } else {
            toast.error('Please select a background image first');
            return;
          }
          break;
        case 'blur':
          result = await addBlurBackground(transparentImage, blurRadius[0]);
          toast.success('Blur effect applied!');
          break;
        case 'shadow':
          result = await addShadowEffect(
            transparentImage,
            'rgba(0,0,0,0.3)',
            shadowOffsetX[0],
            shadowOffsetY[0],
            shadowBlur[0]
          );
          toast.success('Shadow effect added for realistic depth!');
          break;
        default:
          return;
      }
      
      setProcessedFile(result);
    } catch (error) {
      console.error('Error applying effect:', error);
      toast.error('Failed to apply effect. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (!processedFile || !originalFile) return;

    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFile.name.split('.')[0]}_${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolCard
      title="Professional Background Remover"
      description="AI-powered background removal with professional photo editing features"
      icon={<Scissors className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={['image/*']}
            title="Drop your image here for professional editing"
            description="Supports JPG, PNG, WebP formats"
          />
        ) : (
          <div className="space-y-6">
            {/* Step 1: Background Removal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Step 1: Remove Background
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isProcessing && !transparentImage ? (
                  <div className="space-y-4">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      Processing with advanced edge detection...
                    </p>
                  </div>
                ) : !transparentImage ? (
                  <Button onClick={handleRemoveBackground} className="w-full">
                    <Scissors className="h-4 w-4 mr-2" />
                    Remove Background with Precision
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-green-600">✓ Background removed successfully!</p>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload('transparent')}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Transparent Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Professional Effects */}
            {transparentImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Step 2: Professional Effects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="background" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="background">Custom Background</TabsTrigger>
                      <TabsTrigger value="image">Image Background</TabsTrigger>
                      <TabsTrigger value="blur">Blur Effect</TabsTrigger>
                      <TabsTrigger value="shadow">Add Shadow</TabsTrigger>
                    </TabsList>

                    <TabsContent value="background" className="space-y-4">
                      <div className="space-y-3">
                        <Label>Background Color</Label>
                        <div className="flex gap-3">
                          <Input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-20 h-10"
                          />
                          <Button
                            onClick={() => handleCustomBackground('color')}
                            disabled={isProcessing}
                            className="flex-1"
                          >
                            <Palette className="h-4 w-4 mr-2" />
                            Apply Color Background
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="image" className="space-y-4">
                      <div className="space-y-3">
                        <Label>Background Image</Label>
                        <Input
                          ref={backgroundFileRef}
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                        />
                        <Button
                          onClick={() => handleCustomBackground('image')}
                          disabled={isProcessing}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Apply Image Background
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="blur" className="space-y-4">
                      <div className="space-y-3">
                        <Label>Blur Radius: {blurRadius[0]}px</Label>
                        <Slider
                          value={blurRadius}
                          onValueChange={setBlurRadius}
                          min={5}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                        <Button
                          onClick={() => handleCustomBackground('blur')}
                          disabled={isProcessing}
                          className="w-full"
                        >
                          <Focus className="h-4 w-4 mr-2" />
                          Apply Blur Background
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="shadow" className="space-y-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Shadow X: {shadowOffsetX[0]}px</Label>
                            <Slider
                              value={shadowOffsetX}
                              onValueChange={setShadowOffsetX}
                              min={-20}
                              max={20}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Shadow Y: {shadowOffsetY[0]}px</Label>
                            <Slider
                              value={shadowOffsetY}
                              onValueChange={setShadowOffsetY}
                              min={-20}
                              max={20}
                              step={1}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Shadow Blur: {shadowBlur[0]}px</Label>
                          <Slider
                            value={shadowBlur}
                            onValueChange={setShadowBlur}
                            min={5}
                            max={30}
                            step={1}
                          />
                        </div>
                        <Button
                          onClick={() => handleCustomBackground('shadow')}
                          disabled={isProcessing}
                          className="w-full"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Add Realistic Shadow
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {processedFile && (
                    <div className="mt-6 pt-4 border-t">
                      <Button
                        onClick={() => handleDownload('professional')}
                        className="w-full"
                        size="lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Professional Image
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Image Preview */}
            {processedFile && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(processedFile)}
                      alt="Processed"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setTransparentImage(null);
                  setProcessedFile(null);
                  setProgress(0);
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