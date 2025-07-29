import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Eraser, Paintbrush, Undo2, RotateCcw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManualEditorProps {
  originalImage: string;
  processedImage: string;
  onSave: (editedBlob: Blob) => void;
  className?: string;
}

export const ManualEditor = ({ originalImage, processedImage, onSave, className }: ManualEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState([10]);
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser'>('eraser');
  const [showOriginal, setShowOriginal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load and draw the processed image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = Math.min(img.width, 800);
      canvas.height = Math.min(img.height, 600);
      
      // Calculate scaling to fit canvas while maintaining aspect ratio
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
      
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      // Save initial state to history
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };
    img.src = processedImage;
  }, [processedImage]);

  const getMousePos = (e: MouseEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Save current state to history before drawing
    setHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);

    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    
    // Configure brush settings
    ctx.lineWidth = brushSize[0];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleToolChange = (tool: 'brush' | 'eraser') => {
    setActiveTool(tool);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Remove current state and restore previous
    const newHistory = history.slice(0, -1);
    const previousState = newHistory[newHistory.length - 1];
    
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  const handleReset = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reload the processed image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
      
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };
    img.src = processedImage;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, 'image/png', 1.0);
  };

  const togglePreview = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    const imageToShow = showOriginal ? processedImage : originalImage;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
      
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    };
    img.src = imageToShow;
    
    setShowOriginal(!showOriginal);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tools */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTool === 'eraser' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToolChange('eraser')}
            >
              <Eraser className="h-4 w-4 mr-2" />
              Eraser
            </Button>
            <Button
              variant={activeTool === 'brush' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToolChange('brush')}
            >
              <Paintbrush className="h-4 w-4 mr-2" />
              Restore
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Brush Size:</span>
            <div className="w-24">
              <Slider
                value={brushSize}
                onValueChange={setBrushSize}
                max={50}
                min={1}
                step={1}
              />
            </div>
            <Badge variant="outline">{brushSize[0]}px</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border border-border rounded-lg overflow-hidden bg-checkerboard">
        <canvas 
          ref={canvasRef} 
          className="max-w-full block mx-auto cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {/* Preview Toggle */}
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePreview}
            className="bg-background/80 backdrop-blur-sm"
          >
            {showOriginal ? 'Show Edited' : 'Show Original'}
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Use the eraser to remove unwanted parts or the brush to restore areas.
        </p>
        <Button onClick={handleSave} className="ml-4">
          <Download className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};