import { useState, useCallback } from 'react';
import { Image, Download, X, Upload, Trash2, Settings, Palette } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mergeImages, validateImageFiles, generateMergedFilename, ImageMergerOptions } from '@/utils/imageMerger';
import { toast } from 'sonner';

export const ImageMerger = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedImage, setMergedImage] = useState<Blob | null>(null);
  const [mergeResult, setMergeResult] = useState<{
    width: number;
    height: number;
    fileCount: number;
  } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Merger options
  const [options, setOptions] = useState<ImageMergerOptions>({
    layout: 'horizontal',
    spacing: 10,
    backgroundColor: '#ffffff',
    maxWidth: 4000,
    maxHeight: 4000,
    gridColumns: 2,
    quality: 0.9
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (newFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    // Check for duplicates
    const existingNames = selectedFiles.map(f => f.name);
    const duplicates = newFiles.filter(f => existingNames.includes(f.name));
    
    if (duplicates.length > 0) {
      toast.error(`Duplicate files found: ${duplicates.map(f => f.name).join(', ')}`);
      return;
    }

    // Validate files
    const validation = validateImageFiles([...selectedFiles, ...newFiles]);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setMergedImage(null);
    setMergeResult(null);
    toast.success(`${newFiles.length} image file(s) added`);
  }, [selectedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setMergedImage(null);
    setMergeResult(null);
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setMergedImage(null);
    setMergeResult(null);
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      toast.error('Please select at least 2 image files to merge');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await mergeImages(selectedFiles, options);
      
      if (result.success && result.mergedImage) {
        setMergedImage(result.mergedImage);
        setMergeResult({
          width: result.width,
          height: result.height,
          fileCount: result.fileCount
        });
        toast.success(`Successfully merged ${result.fileCount} images into ${result.width}x${result.height} image`);
      } else {
        toast.error(result.error || 'Failed to merge images');
      }
    } catch (error) {
      console.error('Error merging images:', error);
      toast.error('An unexpected error occurred while merging images');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedImage) return;

    const url = URL.createObjectURL(mergedImage);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateMergedFilename(selectedFiles, options.layout);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Merged image downloaded successfully!');
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <ToolCard
      title="Image Merger"
      description="Merge multiple images into a single image with various layouts"
      icon={<Image className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* File Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            {isDragActive ? 'Drop image files here' : 'Drop image files here or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports up to 20 images (PNG, JPG, GIF, WebP, BMP), max 50MB each
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFiles}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-destructive hover:text-destructive ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total size: {(totalSize / (1024 * 1024)).toFixed(1)} MB</span>
              <span>Files: {selectedFiles.length}</span>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && selectedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Merge Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    value={options.layout}
                    onValueChange={(value: any) => setOptions(prev => ({ ...prev, layout: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="collage">Collage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spacing">Spacing (px)</Label>
                  <Input
                    type="number"
                    value={options.spacing}
                    onChange={(e) => setOptions(prev => ({ ...prev, spacing: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {options.layout === 'grid' && (
                <div className="space-y-2">
                  <Label htmlFor="gridColumns">Grid Columns</Label>
                  <Input
                    type="number"
                    value={options.gridColumns}
                    onChange={(e) => setOptions(prev => ({ ...prev, gridColumns: parseInt(e.target.value) || 2 }))}
                    min="1"
                    max="10"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={options.backgroundColor}
                    onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    value={options.backgroundColor}
                    onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Quality: {Math.round(options.quality * 100)}%</Label>
                <Slider
                  value={[options.quality]}
                  onValueChange={(value) => setOptions(prev => ({ ...prev, quality: value[0] }))}
                  max={1}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Merge Button */}
        {selectedFiles.length >= 2 && (
          <Button
            onClick={handleMerge}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Merging Images...
              </>
            ) : (
              `Merge ${selectedFiles.length} Images (${options.layout})`
            )}
          </Button>
        )}

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={undefined} className="w-full" />
            <p className="text-xs text-muted-foreground text-center">
              Processing images...
            </p>
          </div>
        )}

        {/* Merge Result */}
        {mergedImage && mergeResult && (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-400 font-medium">✓ Images merged successfully!</p>
                  <p className="text-xs text-green-400/80 mt-1">
                    {mergeResult.fileCount} files • {mergeResult.width}x{mergeResult.height}px
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  {(mergedImage.size / (1024 * 1024)).toFixed(1)} MB
                </Badge>
              </div>
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-4 bg-secondary/20">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="max-w-full overflow-auto">
                <img
                  src={URL.createObjectURL(mergedImage)}
                  alt="Merged image preview"
                  className="max-w-full h-auto rounded"
                />
              </div>
            </div>

            <Button
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Merged Image
            </Button>
          </div>
        )}

        {/* Instructions */}
        {selectedFiles.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Select 2 or more image files to merge them into a single image.</p>
            <p className="mt-1">Choose from horizontal, vertical, grid, or collage layouts.</p>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
