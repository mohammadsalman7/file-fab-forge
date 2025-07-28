import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  title?: string;
  description?: string;
  className?: string;
}

export const FileDropzone = ({ 
  onFileSelect, 
  acceptedTypes = ['image/*'], 
  maxSize = 10 * 1024 * 1024, // 10MB
  title = "Drop your file here",
  description = "or click to browse",
  className 
}: FileDropzoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false
  });

  const getIcon = () => {
    if (acceptedTypes.includes('image/*')) return <Image className="h-12 w-12" />;
    if (acceptedTypes.includes('application/pdf')) return <File className="h-12 w-12" />;
    return <Upload className="h-12 w-12" />;
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer rounded-xl border-2 border-dashed border-border/50 p-8 text-center transition-all duration-300",
        "hover:border-primary hover:bg-accent/20 hover:shadow-glow",
        "bg-gradient-glass backdrop-blur-sm",
        isDragActive && "border-primary bg-accent/30 shadow-glow",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
          {getIcon()}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          {maxSize && (
            <p className="text-xs text-muted-foreground">
              Max size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          )}
        </div>
      </div>
      
      {fileRejections.length > 0 && (
        <div className="mt-4 text-sm text-destructive">
          {fileRejections[0].errors[0].message}
        </div>
      )}
    </div>
  );
};