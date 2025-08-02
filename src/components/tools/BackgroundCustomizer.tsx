import { useState } from 'react';
import { Upload, Palette, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDropzone } from '@/components/FileDropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BackgroundCustomizerProps {
  transparentImage: string;
  onCustomBackground: (backgroundBlob: Blob) => void;
  className?: string;
}

export const BackgroundCustomizer = ({ 
  transparentImage, 
  onCustomBackground,
  className 
}: BackgroundCustomizerProps) => {
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedColors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#008000', '#ffc0cb', '#a52a2a', '#808080', '#000080'
  ];

  const handleColorBackground = async (color: string) => {
    setIsProcessing(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = transparentImage;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      canvas.width = img.width;
      canvas.height = img.height;

      // Fill background with color
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw transparent image on top
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          onCustomBackground(blob);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error adding color background:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageBackground = async () => {
    if (!backgroundImageFile) return;
    
    setIsProcessing(true);
    try {
      const foregroundImg = new Image();
      const backgroundImg = new Image();
      
      foregroundImg.crossOrigin = 'anonymous';
      backgroundImg.crossOrigin = 'anonymous';

      await Promise.all([
        new Promise((resolve, reject) => {
          foregroundImg.onload = resolve;
          foregroundImg.onerror = reject;
          foregroundImg.src = transparentImage;
        }),
        new Promise((resolve, reject) => {
          backgroundImg.onload = resolve;
          backgroundImg.onerror = reject;
          backgroundImg.src = URL.createObjectURL(backgroundImageFile);
        })
      ]);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Use foreground image dimensions
      canvas.width = foregroundImg.width;
      canvas.height = foregroundImg.height;

      // Draw background image (scaled to fit)
      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

      // Draw transparent foreground on top
      ctx.drawImage(foregroundImg, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          onCustomBackground(blob);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error adding image background:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackgroundImageSelect = (file: File) => {
    setBackgroundImageFile(file);
    setBackgroundImageUrl(URL.createObjectURL(file));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Custom Background</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="color" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="color">Color Background</TabsTrigger>
            <TabsTrigger value="image">Image Background</TabsTrigger>
          </TabsList>
          
          <TabsContent value="color" className="space-y-4">
            <div className="space-y-3">
              <Label>Choose Background Color</Label>
              
              {/* Color Picker */}
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-12 h-10 rounded border-0 cursor-pointer"
                />
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleColorBackground(selectedColor)}
                  disabled={isProcessing}
                  size="sm"
                >
                  Apply
                </Button>
              </div>

              {/* Predefined Colors */}
              <div>
                <Label className="text-sm text-muted-foreground">Quick Colors</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorBackground(color)}
                      disabled={isProcessing}
                      className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <div className="space-y-3">
              <Label>Upload Background Image</Label>
              
              {!backgroundImageFile ? (
                <FileDropzone
                  onFileSelect={handleBackgroundImageSelect}
                  acceptedTypes={['image/*']}
                  title="Drop background image here"
                  description="JPG, PNG, WebP supported"
                />
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={backgroundImageUrl!}
                      alt="Background preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBackgroundImageFile(null);
                        setBackgroundImageUrl(null);
                      }}
                      className="absolute top-2 right-2"
                    >
                      Change
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleImageBackground}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Apply Background Image
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};