import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { convertImageToPdf, createTextPdf } from '@/utils/pdfConverter';
import { loadImage } from '@/utils/backgroundRemoval';
import { toast } from 'sonner';

export const DocumentConverter = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionType, setConversionType] = useState<'pdf' | 'image'>('pdf');

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setConvertedFile(null);
    
    // Auto-detect conversion type based on file
    if (file.type === 'application/pdf') {
      setConversionType('image');
    } else if (file.type.startsWith('image/')) {
      setConversionType('pdf');
    }
  };

  const handleConvertToPdf = async () => {
    if (!originalFile) return;

    setIsProcessing(true);

    try {
      if (originalFile.type.startsWith('image/')) {
        const result = await convertImageToPdf(originalFile);
        setConvertedFile(result);
        toast.success('Image converted to PDF successfully!');
      } else if (originalFile.type === 'text/plain') {
        const text = await originalFile.text();
        const result = await createTextPdf(text, originalFile.name);
        setConvertedFile(result);
        toast.success('Text converted to PDF successfully!');
      } else {
        toast.error('Unsupported file type for PDF conversion.');
      }
    } catch (error) {
      console.error('Error converting to PDF:', error);
      toast.error('Failed to convert file to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToImage = async () => {
    if (!originalFile || originalFile.type !== 'application/pdf') {
      toast.error('PDF to image conversion requires a PDF file.');
      return;
    }

    setIsProcessing(true);

    try {
      // Note: This is a simplified implementation
      // Full PDF to image conversion would require a more complex library
      toast.info('PDF to image conversion is not fully implemented in this demo.');
      
      // Placeholder for PDF to image conversion
      // In a real implementation, you would use a library like pdf2pic or PDF.js
      
    } catch (error) {
      console.error('Error converting PDF to image:', error);
      toast.error('Failed to convert PDF to image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile || !originalFile) return;

    const url = URL.createObjectURL(convertedFile);
    const a = document.createElement('a');
    a.href = url;
    
    let fileName = originalFile.name.split('.')[0];
    let extension = conversionType === 'pdf' ? '.pdf' : '.jpg';
    a.download = `${fileName}_converted${extension}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAcceptedTypes = () => {
    return ['image/*', 'application/pdf', 'text/plain'];
  };

  return (
    <ToolCard
      title="Document Converter"
      description="Convert between images, PDFs, and documents"
      icon={<FileText className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={getAcceptedTypes()}
            title="Drop your file here"
            description="Supports images, PDFs, and text files"
            maxSize={50 * 1024 * 1024} // 50MB
          />
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium truncate">{originalFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {originalFile.type} • {(originalFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(originalFile.type.startsWith('image/') || originalFile.type === 'text/plain') && (
                <Button
                  onClick={handleConvertToPdf}
                  disabled={isProcessing}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Convert to PDF
                </Button>
              )}

              {originalFile.type === 'application/pdf' && (
                <Button
                  onClick={handleConvertToImage}
                  disabled={isProcessing}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Convert to Images
                </Button>
              )}
            </div>

            {convertedFile && (
              <Button
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Converted File
              </Button>
            )}

            {convertedFile && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-400 font-medium">✓ Conversion complete!</p>
              </div>
            )}
          </div>
        )}

        {originalFile && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setOriginalFile(null);
                setConvertedFile(null);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Choose different file
            </button>
          </div>
        )}
      </div>
    </ToolCard>
  );
};