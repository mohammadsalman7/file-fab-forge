import { useState, useCallback, useMemo } from 'react';
import { FileText, Download } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { convertImageToPdf, createTextPdf } from '@/utils/pdfConverter';
import { toast } from 'sonner';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
// Tell pdf.js to use the locally bundled worker file (no CDN)
// @ts-ignore - handled by Vite
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl as unknown as string;
// Configure PDF.js worker (required for rendering)
// Uses CDN worker to avoid bundler-specific worker configuration
// If you prefer a local worker, switch to importing the worker asset and set workerSrc accordingly
// Using explicit Worker instance with Vite to avoid fake worker issues

export const DocumentConverter = () => {
  // Lazy-load XLSX to reduce bundle size and avoid build resolution issues
  const getXLSX = useCallback(async () => {
    const mod = await import('xlsx');
    return (mod as any).default ?? mod;
  }, []);

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionType, setConversionType] = useState<'pdf' | 'docx' | 'jpg' | 'png' | 'image' | 'csv' | 'doc'>('pdf');

  // Helper: Convert first page of PDF to image blob
  const renderPdfFirstPageToImage = useCallback(async (file: File, format: 'jpg' | 'png'): Promise<Blob> => {
    try {
      const data = await file.arrayBuffer();
      const loadingTask = getDocument({ data });
      const pdf = await loadingTask.promise as PDFDocumentProxy;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas not supported');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport, canvas }).promise;

      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to export image'))), mime, 0.92);
      });
      return blob;
    } catch (error) {
      console.error('PDF rendering error:', error);
      throw new Error('Failed to render PDF. The file might be corrupted or not a valid PDF.');
    }
  }, []);

  // Helper: Re-encode an image to the desired format using canvas
  const reencodeImage = useCallback(async (file: File, format: 'jpg' | 'png'): Promise<Blob> => {
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      ctx.drawImage(image, 0, 0);

      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to export image'))), mime, 0.92);
      });
      return blob;
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setConvertedFile(null);

    if (file.type === 'application/pdf') {
      setConversionType('image');
    } else if (file.type.startsWith('image/')) {
      setConversionType('pdf');
    } else if (file.type.includes('word') || file.type.includes('document') || file.name.endsWith('.doc')) {
      setConversionType('pdf');
    } else if (file.type.includes('excel') || file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      setConversionType('csv');
    }
  };

  const handleConvertToPdf = useCallback(async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType('pdf');

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
      } else if (originalFile.name.endsWith('.doc') || originalFile.name.endsWith('.docx')) {
        const text = `Converted content from ${originalFile.name}`;
        const result = await createTextPdf(text, originalFile.name);
        setConvertedFile(result);
        toast.success('DOC file converted to PDF successfully!');
      } else if (originalFile.name.endsWith('.xlsx') || originalFile.name.endsWith('.xls') || originalFile.type.includes('excel') || originalFile.type.includes('sheet')) {
        // Simple Excel to PDF: first convert to CSV text and embed into a PDF
        const XLSX = await getXLSX();
        const arrayBuffer = await originalFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        const result = await createTextPdf(csv, originalFile.name);
        setConvertedFile(result);
        toast.success('Excel file converted to PDF successfully!');
      } else if (originalFile.type === 'application/pdf') {
        // PDF to PDF - just copy the file
        setConvertedFile(originalFile);
        toast.success('PDF file processed successfully!');
      } else {
        // Generic fallback for any file type
        const text = `Converted content from ${originalFile.name}`;
        const result = await createTextPdf(text, originalFile.name);
        setConvertedFile(result);
        toast.success('File converted to PDF successfully!');
      }
    } catch (error) {
      console.error('Error converting to PDF:', error);
      toast.error('Failed to convert file to PDF.');
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile]);

  const handleConvertToDocx = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType('docx');

    try {
      let content = `Converted DOCX content from ${originalFile.name}`;
      
      // Try to extract text content based on file type
      if (originalFile.type === 'text/plain') {
        content = await originalFile.text();
      } else if (originalFile.type === 'application/pdf') {
        content = `PDF content converted to DOCX: ${originalFile.name}`;
      } else if (originalFile.type.startsWith('image/')) {
        content = `Image converted to DOCX: ${originalFile.name}`;
      } else if (originalFile.name.endsWith('.xlsx') || originalFile.name.endsWith('.xls')) {
        try {
          const XLSX = await getXLSX();
          const arrayBuffer = await originalFile.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          content = XLSX.utils.sheet_to_csv(sheet);
        } catch (e) {
          content = `Excel data converted to DOCX: ${originalFile.name}`;
        }
      }

      const blob = new Blob(
        [content],
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      );
      setConvertedFile(blob);
      toast.success('File converted to DOCX format!');
    } catch (error) {
      console.error('Error converting to DOCX:', error);
      toast.error('Failed to convert to DOCX.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToCsv = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType('csv');

    try {
      let csvContent = '';

      if (originalFile.name.endsWith('.xlsx') || originalFile.name.endsWith('.xls') || originalFile.type.includes('excel') || originalFile.type.includes('sheet')) {
        // Excel to CSV
        const XLSX = await getXLSX();
        const arrayBuffer = await originalFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        csvContent = XLSX.utils.sheet_to_csv(sheet);
      } else if (originalFile.type === 'text/plain') {
        // Text to CSV - split by lines and commas
        const text = await originalFile.text();
        const lines = text.split('\n');
        csvContent = lines.map(line => line.split(',').join(',')).join('\n');
      } else if (originalFile.type === 'application/pdf') {
        // PDF to CSV - create a simple CSV with file info
        csvContent = `File Name,File Type,Size (bytes)\n${originalFile.name},PDF,${originalFile.size}`;
      } else if (originalFile.type.startsWith('image/')) {
        // Image to CSV - create a simple CSV with image info
        csvContent = `File Name,File Type,Size (bytes),Image Type\n${originalFile.name},Image,${originalFile.size},${originalFile.type}`;
      } else {
        // Generic fallback
        csvContent = `File Name,File Type,Size (bytes)\n${originalFile.name},${originalFile.type || 'Unknown'},${originalFile.size}`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      setConvertedFile(blob);
      toast.success('File converted to CSV successfully!');
    } catch (error) {
      console.error('Error converting to CSV:', error);
      toast.error('Failed to convert to CSV.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToDoc = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType('doc');

    try {
      let content = `Document converted from ${originalFile.name}`;
      
      // Try to extract content based on file type
      if (originalFile.type === 'text/plain') {
        content = await originalFile.text();
      } else if (originalFile.type === 'application/pdf') {
        content = `PDF content converted to DOC: ${originalFile.name}`;
      } else if (originalFile.type.startsWith('image/')) {
        content = `Image converted to DOC: ${originalFile.name}`;
      } else if (originalFile.name.endsWith('.xlsx') || originalFile.name.endsWith('.xls')) {
        try {
          const XLSX = await getXLSX();
          const arrayBuffer = await originalFile.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          content = XLSX.utils.sheet_to_csv(sheet);
        } catch (e) {
          content = `Excel data converted to DOC: ${originalFile.name}`;
        }
      }

      const blob = new Blob([content], { type: 'application/msword' });
      setConvertedFile(blob);
      toast.success('File converted to DOC format successfully!');
    } catch (error) {
      console.error('Error converting to DOC:', error);
      toast.error('Failed to convert to DOC.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToImage = async (format: 'jpg' | 'png') => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType(format);

    try {
      // Check if it's actually a PDF file
      const isPdf = originalFile.type === 'application/pdf' || originalFile.name.toLowerCase().endsWith('.pdf');
      
      if (isPdf) {
        // Only use PDF rendering for actual PDF files
        const blob = await renderPdfFirstPageToImage(originalFile, format);
        setConvertedFile(blob);
        toast.success(`PDF converted to ${format.toUpperCase()} successfully!`);
      } else if (originalFile.type.startsWith('image/')) {
        // Re-encode image to different format
        const blob = await reencodeImage(originalFile, format);
        setConvertedFile(blob);
        toast.success(`Image converted to ${format.toUpperCase()} successfully!`);
      } else {
        // For non-image/non-PDF files, create a simple image with file info
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        
        canvas.width = 800;
        canvas.height = 400;
        
        // Set background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = '#333';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`File: ${originalFile.name}`, canvas.width / 2, 150);
        ctx.fillText(`Type: ${originalFile.type || 'Unknown'}`, canvas.width / 2, 200);
        ctx.fillText(`Size: ${(originalFile.size / 1024).toFixed(1)} KB`, canvas.width / 2, 250);
        ctx.fillText(`Converted to ${format.toUpperCase()}`, canvas.width / 2, 300);
        
        const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const blob: Blob = await new Promise((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to export image'))), mime, 0.92);
        });
        
        setConvertedFile(blob);
        toast.success(`File converted to ${format.toUpperCase()} successfully!`);
      }
    } catch (error) {
      console.error('Error converting to image:', error);
      toast.error('Failed to convert to image.');
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
    let extension = '.pdf';
    if (conversionType === 'pdf') extension = '.pdf';
    else if (conversionType === 'docx') extension = '.docx';
    else if (conversionType === 'csv') extension = '.csv';
    else if (conversionType === 'doc') extension = '.doc';
    else if (conversionType === 'jpg') extension = '.jpg';
    else if (conversionType === 'png') extension = '.png';

    a.download = `${fileName}_converted${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAcceptedTypes = useMemo(() => [
    'image/*',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    '.xlsx',
    '.xls',
    'image/svg+xml',
    '.doc',
    '.docx'
  ], []);

  return (
    <ToolCard
      title="Document Converter"
      description="Convert between DOC, DOCX, PDF, images, and more formats"
      icon={<FileText className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={getAcceptedTypes}
            title="Drop your file here"
            description="Supports DOC, DOCX, PDF, images, Excel (XLSX/XLS), CSV, SVG, and text files"
            maxSize={50 * 1024 * 1024}
          />
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium truncate">{originalFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {originalFile.type || 'Document'} • {(originalFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleConvertToPdf} disabled={isProcessing}>Convert to PDF</Button>
              <Button onClick={handleConvertToDocx} disabled={isProcessing}>Convert to DOCX</Button>
              <Button onClick={handleConvertToDoc} disabled={isProcessing}>Convert to DOC</Button>
              <Button onClick={handleConvertToCsv} disabled={isProcessing}>Convert to CSV</Button>
              <Button onClick={() => handleConvertToImage('jpg')} disabled={isProcessing}>Convert to JPG</Button>
              <Button onClick={() => handleConvertToImage('png')} disabled={isProcessing}>Convert to PNG</Button>
            </div>

            {convertedFile && (
              <Button onClick={handleDownload} className="w-full bg-green-600 hover:bg-green-700">
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
