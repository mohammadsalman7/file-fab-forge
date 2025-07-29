import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export const BeforeAfterComparison = ({ beforeImage, afterImage, className }: BeforeAfterComparisonProps) => {
  const [showAfter, setShowAfter] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toggle buttons */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant={!showAfter ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowAfter(false)}
        >
          <EyeOff className="h-4 w-4 mr-2" />
          Original
        </Button>
        <Button
          variant={showAfter ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowAfter(true)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Background Removed
        </Button>
      </div>

      {/* Comparison container */}
      <div className="relative border border-border rounded-lg overflow-hidden bg-checkerboard">
        {/* Before image */}
        <div className="relative">
          <img
            src={beforeImage}
            alt="Original"
            className="w-full h-auto block"
          />
        </div>

        {/* After image with slider overlay */}
        {showAfter && (
          <div className="absolute inset-0">
            {/* Split view container */}
            <div 
              className="relative w-full h-full cursor-col-resize"
              onClick={handleSliderChange}
            >
              {/* After image */}
              <img
                src={afterImage}
                alt="Background removed"
                className="w-full h-full object-cover"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                }}
              />
              
              {/* Slider line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Slider handle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-primary flex items-center justify-center">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Labels */}
        {showAfter && (
          <>
            <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
              Original
            </div>
            <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
              Background Removed
            </div>
          </>
        )}
      </div>

      {showAfter && (
        <p className="text-sm text-muted-foreground text-center">
          Click and drag the slider to compare before and after
        </p>
      )}
    </div>
  );
};