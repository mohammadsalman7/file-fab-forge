import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { extractTextFromPdf } from '@/utils/pdfTextExtractor';
import { toast } from 'sonner';

export const PdfTextExtractor = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setExtractedText('');
  };

  const handleExtractText = async () => {
    if (!originalFile) return;
    setIsProcessing(true);

    try {
      const text = await extractTextFromPdf(originalFile);
      setExtractedText(text);
      toast.success('Text extracted successfully!');
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to extract text from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadText = () => {
    if (!extractedText || !originalFile) return;
    
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFile.name.split('.')[0]}_extracted_text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolCard
      title="PDF Text Extractor"
      description="Extract text content from PDF files"
      icon={<FileText className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={['application/pdf']}
            title="Drop your PDF file here"
            description="Supports PDF files with text content"
            maxSize={50 * 1024 * 1024}
          />
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium truncate">{originalFile.name}</p>
              <p className="text-xs text-muted-foreground">
                PDF • {(originalFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>

            <Button 
              onClick={handleExtractText} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Extracting...' : 'Extract Text from PDF'}
            </Button>

            {extractedText && (
              <div className="space-y-3">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400 font-medium">✓ Text extracted successfully!</p>
                  <p className="text-xs text-green-400/80 mt-1">
                    {extractedText.length} characters extracted
                  </p>
                </div>

                <div className="max-h-60 overflow-y-auto p-3 bg-muted/20 rounded-lg border">
                  <pre className="text-sm whitespace-pre-wrap break-words">
                    {extractedText}
                  </pre>
                </div>

                <Button 
                  onClick={handleDownloadText} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Extracted Text
                </Button>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setExtractedText('');
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Choose different file
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
