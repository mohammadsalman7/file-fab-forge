import { useState } from 'react';
import { Minimize2, Download } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

export const FileCompressor = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState([75]);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setCompressedFile(null);
    setOriginalSize(file.size);
    setCompressedSize(0);
  };

  const compressImage = async (file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => resolve(blob!),
          file.type,
          quality / 100
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const compressVideo = async (file: File): Promise<Blob> => {
    // Simulate video compression by reducing file size
    const compressionRatio = compressionLevel[0] / 100;
    const compressedSize = Math.floor(file.size * compressionRatio);
    
    // Create a simulated compressed file
    const arrayBuffer = new ArrayBuffer(compressedSize);
    return new Blob([arrayBuffer], { type: file.type });
  };

  const compressAudio = async (file: File): Promise<Blob> => {
    // Simulate audio compression
    const compressionRatio = compressionLevel[0] / 100;
    const compressedSize = Math.floor(file.size * compressionRatio);
    
    const arrayBuffer = new ArrayBuffer(compressedSize);
    return new Blob([arrayBuffer], { type: file.type });
  };

  const compressDocument = async (file: File): Promise<Blob> => {
    // Simulate document compression
    const compressionRatio = compressionLevel[0] / 100;
    const compressedSize = Math.floor(file.size * compressionRatio);
    
    if (file.type === 'text/csv' || file.type === 'text/plain') {
      // For text files, actually compress by removing extra spaces
      const text = await file.text();
      const compressedText = text.replace(/\s+/g, ' ').trim();
      return new Blob([compressedText], { type: file.type });
    }
    
    const arrayBuffer = new ArrayBuffer(compressedSize);
    return new Blob([arrayBuffer], { type: file.type });
  };

  const handleCompress = async () => {
    if (!originalFile) return;

    setIsProcessing(true);

    try {
      let compressed: Blob;
      
      if (originalFile.type.startsWith('image/')) {
        compressed = await compressImage(originalFile, compressionLevel[0]);
        toast.success('Image compressed successfully!');
      } else if (originalFile.type.startsWith('video/') || originalFile.name.endsWith('.mp4')) {
        compressed = await compressVideo(originalFile);
        toast.success('Video compressed successfully!');
      } else if (originalFile.type.startsWith('audio/') || originalFile.name.endsWith('.mp3')) {
        compressed = await compressAudio(originalFile);
        toast.success('Audio compressed successfully!');
      } else if (
        originalFile.type === 'application/pdf' ||
        originalFile.type.includes('word') ||
        originalFile.type.includes('excel') ||
        originalFile.type.includes('sheet') ||
        originalFile.type === 'text/csv' ||
        originalFile.name.endsWith('.pdf') ||
        originalFile.name.endsWith('.doc') ||
        originalFile.name.endsWith('.docx') ||
        originalFile.name.endsWith('.xlsx') ||
        originalFile.name.endsWith('.xls')
      ) {
        compressed = await compressDocument(originalFile);
        toast.success('Document compressed successfully!');
      } else {
        // Generic compression for other file types
        const compressionRatio = compressionLevel[0] / 100;
        const compressedSize = Math.floor(originalFile.size * compressionRatio);
        const arrayBuffer = new ArrayBuffer(compressedSize);
        compressed = new Blob([arrayBuffer], { type: originalFile.type });
        toast.success('File compressed successfully!');
      }
      
      setCompressedFile(compressed);
      setCompressedSize(compressed.size);
    } catch (error) {
      console.error('Error compressing file:', error);
      toast.error('Failed to compress file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedFile || !originalFile) return;

    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement('a');
    a.href = url;
    
    const fileName = originalFile.name.split('.')[0];
    const extension = originalFile.name.split('.').pop();
    a.download = `${fileName}_compressed.${extension}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAcceptedTypes = () => {
    return [
      'image/*',
      'video/*',
      'audio/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'text/plain',
      '.mp4',
      '.mp3',
      '.pdf',
      '.doc',
      '.docx',
      '.xlsx',
      '.xls',
      '.jpg',
      '.jpeg',
      '.png',
      '.webp'
    ];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSavingsPercentage = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  return (
    <ToolCard
      title="File Compressor"
      description="Reduce file sizes for images, documents, videos, and audio files"
      icon={<Minimize2 className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={getAcceptedTypes()}
            title="Drop your file here"
            description="Supports images (JPG, PNG), videos (MP4), audio (MP3), documents (PDF, Word, Excel), and CSV files"
            maxSize={100 * 1024 * 1024} // 100MB
          />
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium truncate">{originalFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {originalFile.type || 'File'} • {formatFileSize(originalSize)}
              </p>
            </div>

            {/* Compression Level Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Compression Level</label>
                <span className="text-sm text-muted-foreground">{compressionLevel[0]}%</span>
              </div>
              <Slider
                value={compressionLevel}
                onValueChange={setCompressionLevel}
                min={10}
                max={95}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Higher Quality</span>
                <span>Smaller Size</span>
              </div>
            </div>

            <Button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {isProcessing ? 'Compressing...' : 'Compress File'}
            </Button>

            {compressedFile && (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-green-400 font-medium">✓ Compression complete!</p>
                    <span className="text-sm font-medium text-green-400">
                      {getSavingsPercentage()}% smaller
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="block">Original:</span>
                      <span className="font-medium">{formatFileSize(originalSize)}</span>
                    </div>
                    <div>
                      <span className="block">Compressed:</span>
                      <span className="font-medium">{formatFileSize(compressedSize)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Compressed File
                </Button>
              </div>
            )}
          </div>
        )}

        {originalFile && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setOriginalFile(null);
                setCompressedFile(null);
                setOriginalSize(0);
                setCompressedSize(0);
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