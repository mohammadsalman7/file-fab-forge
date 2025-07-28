import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isProcessing: boolean;
  progress?: number;
  originalFile?: File | null;
  processedFile?: Blob | null;
  onProcess: () => void;
  onDownload?: () => void;
  disabled?: boolean;
  className?: string;
}

export const ProcessingCard = ({
  title,
  description,
  icon,
  isProcessing,
  progress,
  originalFile,
  processedFile,
  onProcess,
  onDownload,
  disabled = false,
  className
}: ProcessingCardProps) => {
  const downloadUrl = processedFile ? URL.createObjectURL(processedFile) : undefined;

  return (
    <Card className={cn(
      "bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass transition-all duration-300",
      "hover:shadow-glow hover:border-primary/30",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="text-primary">{icon}</div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {originalFile && (
          <div className="p-3 bg-secondary/20 rounded-lg">
            <p className="text-sm font-medium truncate">{originalFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(originalFile.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
            {progress !== undefined && (
              <Progress value={progress} className="w-full" />
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={onProcess}
            disabled={disabled || isProcessing || !originalFile}
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing
              </>
            ) : (
              'Process'
            )}
          </Button>

          {processedFile && downloadUrl && (
            <Button
              variant="outline"
              onClick={onDownload}
              className="border-primary/30 hover:bg-primary/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        {processedFile && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400 font-medium">✓ Processing complete!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};