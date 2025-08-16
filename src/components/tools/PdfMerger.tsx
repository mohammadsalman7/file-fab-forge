import { useState, useCallback } from 'react';
import { FileText, Download, X, Upload, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mergePdfs, validatePdfFiles, generateMergedFilename } from '@/utils/pdfMerger';
import { toast } from 'sonner';

export const PdfMerger = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdf, setMergedPdf] = useState<Uint8Array | null>(null);
  const [mergeResult, setMergeResult] = useState<{
    totalPages: number;
    fileCount: number;
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    
    if (newFiles.length === 0) {
      toast.error('Please select valid PDF files');
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
    const validation = validatePdfFiles([...selectedFiles, ...newFiles]);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setMergedPdf(null);
    setMergeResult(null);
    toast.success(`${newFiles.length} PDF file(s) added`);
  }, [selectedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setMergedPdf(null);
    setMergeResult(null);
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setMergedPdf(null);
    setMergeResult(null);
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      toast.error('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await mergePdfs(selectedFiles);
      
      if (result.success && result.mergedPdf) {
        setMergedPdf(result.mergedPdf);
        setMergeResult({
          totalPages: result.totalPages,
          fileCount: result.fileCount
        });
        toast.success(`Successfully merged ${result.fileCount} PDF files into ${result.totalPages} pages`);
      } else {
        toast.error(result.error || 'Failed to merge PDF files');
      }
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast.error('An unexpected error occurred while merging PDFs');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedPdf) return;

    const blob = new Blob([mergedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateMergedFilename(selectedFiles);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Merged PDF downloaded successfully!');
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <ToolCard
      title="PDF Merger"
      description="Merge multiple PDF files into a single document"
      icon={<FileText className="h-6 w-6" />}
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
            {isDragActive ? 'Drop PDF files here' : 'Drop PDF files here or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports up to 20 PDF files, max 50MB each
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h3>
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
                Merging PDFs...
              </>
            ) : (
              `Merge ${selectedFiles.length} PDF Files`
            )}
          </Button>
        )}

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={undefined} className="w-full" />
            <p className="text-xs text-muted-foreground text-center">
              Processing PDF files...
            </p>
          </div>
        )}

        {/* Merge Result */}
        {mergedPdf && mergeResult && (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-400 font-medium">✓ PDFs merged successfully!</p>
                  <p className="text-xs text-green-400/80 mt-1">
                    {mergeResult.fileCount} files • {mergeResult.totalPages} pages
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  {(mergedPdf.length / (1024 * 1024)).toFixed(1)} MB
                </Badge>
              </div>
            </div>

            <Button
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Merged PDF
            </Button>
          </div>
        )}

        {/* Instructions */}
        {selectedFiles.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Select 2 or more PDF files to merge them into a single document.</p>
            <p className="mt-1">Files will be merged in the order they appear above.</p>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
