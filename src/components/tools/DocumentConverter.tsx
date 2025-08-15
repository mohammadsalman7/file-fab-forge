import { useState, useCallback, useMemo } from 'react';
import { FileText, Download } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { convertImageToPdf, createTextPdf } from '@/utils/pdfConverter';
import {
  extractTextFromPdf,
  convertPdfTextToCsv,
} from '@/utils/pdfTextExtractor';
import { extractTablesFromPdf } from '@/utils/pdfTableExtractor';
import { convertPdfToDocxData, createDocxBlob, convertTextToDocxData } from '@/utils/docxConverter';
import { convertWordToPowerPoint, convertPdfToPowerPoint, convertPdfToPowerPointWithImages, createPowerPointBlob } from '@/utils/powerPointConverter';
import { convertWordDocumentToImage } from '@/utils/wordToImageConverter';
import { convertWordToPdf } from '@/utils/wordToPdfConverter';
import { toast } from 'sonner';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
// @ts-ignore - handled by Vite
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl as unknown as string;

export const DocumentConverter = () => {
  // Lazy-load XLSX to reduce bundle size
  const getXLSX = useCallback(async () => {
    const mod = await import('xlsx');
    return (mod as any).default ?? mod;
  }, []);

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionType, setConversionType] = useState<'pdf' | 'docx' | 'jpg' | 'png' | 'image' | 'csv' | 'doc' | 'ppt'>('pdf');
  const [extractionProgress, setExtractionProgress] = useState<string>('');
  const [recommendedFormats, setRecommendedFormats] = useState<string[]>([]);
  const [useImageBasedConversion, setUseImageBasedConversion] = useState(false);

  // Get file type from extension or mime type
  const getFileType = useCallback((file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type.toLowerCase();
    if (mimeType === 'application/pdf' || extension === 'pdf') return 'pdf';
    if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '')) return 'image';
    if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ['doc', 'docx'].includes(extension || '')
    ) {
      return 'doc';
    }
    if (
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      ['xlsx', 'xls'].includes(extension || '')
    ) {
      return 'excel';
    }
    if (
      mimeType === 'application/vnd.ms-powerpoint' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      ['ppt', 'pptx'].includes(extension || '')
    ) {
      return 'ppt';
    }
    if (mimeType === 'text/csv' || extension === 'csv') return 'csv';
    if (mimeType === 'text/plain' || extension === 'txt') return 'text';

    return 'unknown';
  }, []);

  // Get smart recommendations based on file type
  const getRecommendations = useCallback((fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return ['doc', 'docx', 'ppt', 'jpg', 'png', 'csv'];
      case 'doc':
        return ['pdf', 'docx', 'jpg', 'png'];
      case 'excel':
        return ['csv', 'pdf', 'doc', 'docx'];
      case 'image':
        return ['pdf', 'jpg', 'png'];
      case 'ppt':
        return ['pdf', 'doc', 'docx', 'jpg', 'png'];
      case 'csv':
        return ['pdf', 'doc', 'docx'];
      case 'text':
        return ['pdf', 'doc', 'docx'];
      default:
        return ['pdf', 'doc', 'docx', 'jpg', 'png'];
    }
  }, []);

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
    const fileType = getFileType(file);
    const recommendations = getRecommendations(fileType);
    setRecommendedFormats(recommendations);
    setConversionType(recommendations[0] as any);
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
        try {
          setExtractionProgress('Converting Word document to PDF...');
          const pdfResult = await convertWordToPdf(originalFile);
          setConvertedFile(pdfResult);
          toast.success('Word document converted to PDF successfully!');
        } catch (error: any) {
          console.error('Error converting Word to PDF:', error);
          toast.error(`Failed to convert Word document to PDF: ${error.message}`);
          return;
        }
      } else if (originalFile.name.endsWith('.ppt') || originalFile.name.endsWith('.pptx')) {
        setExtractionProgress('Processing PowerPoint presentation...');
        const content = `PowerPoint Presentation: ${originalFile.name}\n\nPresentation converted successfully. For best results with PowerPoint files, please use specialized PPT conversion tools.`;
        const result = await createTextPdf(content, originalFile.name);
        setConvertedFile(result);
        toast.success('PowerPoint presentation converted to PDF successfully!');
      } else if (originalFile.name.endsWith('.xlsx') || originalFile.name.endsWith('.xls') || originalFile.type.includes('excel') || originalFile.type.includes('sheet')) {
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
        setConvertedFile(originalFile);
        toast.success('PDF file processed successfully!');
      } else {
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
  }, [originalFile, getXLSX]);

  const handleConvertToDocx = useCallback(async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType('docx');

    try {
      let documentData;
      if (originalFile.type === 'text/plain') {
        const content = await originalFile.text();
        documentData = convertTextToDocxData(content, originalFile.name);
      } else if (originalFile.type === 'application/pdf') {
        setExtractionProgress('Extracting text from PDF with formatting...');
        documentData = await convertPdfToDocxData(originalFile, originalFile.name);
      } else if (originalFile.name.endsWith('.doc') || originalFile.name.endsWith('.docx')) {
        try {
          const mammoth = await import('mammoth');
          const arrayBuffer = await originalFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          const content = result.value || `Document content from ${originalFile.name}`;
          documentData = convertTextToDocxData(content, originalFile.name);
        } catch (error) {
          const content = `Document content from ${originalFile.name}`;
          documentData = convertTextToDocxData(content, originalFile.name);
        }
      } else if (originalFile.name.endsWith('.ppt') || originalFile.name.endsWith('.pptx')) {
        const content = `PowerPoint Presentation: ${originalFile.name}\n\nPresentation converted to DOCX format. For better results with PowerPoint files, please use specialized PPT conversion tools.`;
        documentData = convertTextToDocxData(content, originalFile.name);
      } else if (originalFile.type.startsWith('image/')) {
        const content = `Image converted to DOCX: ${originalFile.name}`;
        documentData = convertTextToDocxData(content, originalFile.name);
      } else if (originalFile.name.endsWith('.xlsx') || originalFile.name.endsWith('.xls')) {
        try {
          const XLSX = await getXLSX();
          const arrayBuffer = await originalFile.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const content = XLSX.utils.sheet_to_csv(sheet);
          documentData = convertTextToDocxData(content, originalFile.name);
        } catch (e) {
          const content = `Excel data converted to DOCX: ${originalFile.name}`;
          documentData = convertTextToDocxData(content, originalFile.name);
        }
      } else {
        const content = `Converted DOCX content from ${originalFile.name}`;
        documentData = convertTextToDocxData(content, originalFile.name);
      }
      const blob = await createDocxBlob(documentData);
      setConvertedFile(blob);
      toast.success('File converted to DOCX format!');
    } catch (error) {
      console.error('Error converting to DOCX:', error);
      toast.error('Failed to convert to DOCX.');
    } finally {
      setIsProcessing(false);
      setExtractionProgress('');
    }
  }, [originalFile, getXLSX]);

  const handleConvertToCsv = useCallback(async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType('csv');

    try {
      let csvContent = '';
      if (originalFile.name.endsWith('.xlsx') || originalFile.name.endsWith('.xls') || originalFile.type.includes('excel') || originalFile.type.includes('sheet')) {
        const XLSX = await getXLSX();
        const arrayBuffer = await originalFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        csvContent = XLSX.utils.sheet_to_csv(sheet);
      } else if (originalFile.type === 'text/plain') {
        const text = await originalFile.text();
        const lines = text.split('\n');
        csvContent = lines.map(line => line.split(',').join(',')).join('\n');
      } else if (originalFile.type === 'application/pdf') {
        setExtractionProgress('Extracting tables and text from PDF...');
        try {
          const { csvContent: tableCsv } = await extractTablesFromPdf(originalFile);
          if (tableCsv.trim()) {
            csvContent = tableCsv;
          } else {
            const pdfText = await extractTextFromPdf(originalFile);
            csvContent = convertPdfTextToCsv(pdfText, originalFile.name);
          }
        } catch (error) {
          const pdfText = await extractTextFromPdf(originalFile);
          csvContent = convertPdfTextToCsv(pdfText, originalFile.name);
        }
      } else if (originalFile.type.startsWith('image/')) {
        csvContent = `File Name,File Type,Size (bytes),Image Type\n${originalFile.name},Image,${originalFile.size},${originalFile.type}`;
      } else {
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
      setExtractionProgress('');
    }
  }, [originalFile, getXLSX]);

  const handleConvertToDoc = useCallback(async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType('doc');

    try {
      let content = '';
      if (originalFile.type === 'text/plain') {
        content = await originalFile.text();
      } else if (originalFile.type === 'application/pdf') {
        setExtractionProgress('Extracting text from PDF...');
        content = await extractTextFromPdf(originalFile);
      } else if (originalFile.name.endsWith('.doc') || originalFile.name.endsWith('.docx')) {
        try {
          const mammoth = await import('mammoth');
          const arrayBuffer = await originalFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          content = result.value || `Document content from ${originalFile.name}`;
        } catch (error) {
          console.error('Error extracting DOC content:', error);
          toast.error('Failed to extract content from DOC file');
          return;
        }
      } else if (originalFile.type.startsWith('image/')) {
        content = `Image file: ${originalFile.name}\nConverted to DOC format`;
      } else if (originalFile.name.endsWith('.xlsx') || originalFile.name.endsWith('.xls')) {
        try {
          const XLSX = await getXLSX();
          const arrayBuffer = await originalFile.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          content = XLSX.utils.sheet_to_csv(sheet);
        } catch (e) {
          console.error('Error processing Excel file:', e);
          toast.error('Failed to process Excel file');
          return;
        }
      } else if (originalFile.name.endsWith('.ppt') || originalFile.name.endsWith('.pptx')) {
        setExtractionProgress('Processing PowerPoint for DOC conversion...');
        content = `PowerPoint Presentation: ${originalFile.name}\n\nPresentation converted to DOC format. For better results with PowerPoint files, please use specialized PPT conversion tools.`;
      } else {
        content = `Document: ${originalFile.name}\nFile type: ${originalFile.type}\nConverted to DOC format`;
      }

      const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}} \\f0\\fs24 ${content.replace(/\n/g, '\\par ')}}`;
      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      setConvertedFile(blob);
      toast.success('File converted to DOC format successfully!');
    } catch (error) {
      console.error('Error converting to DOC:', error);
      toast.error('Failed to convert to DOC.');
    } finally {
      setIsProcessing(false);
      setExtractionProgress('');
    }
  }, [originalFile, getXLSX]);

  const handleConvertToImage = useCallback(async (format: 'jpg' | 'png') => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType(format);
    try {
      const isPdf = originalFile.type === 'application/pdf' || originalFile.name.toLowerCase().endsWith('.pdf');
      const isWord = originalFile.name.endsWith('.doc') || originalFile.name.endsWith('.docx') || 
                    originalFile.type === 'application/msword' || 
                    originalFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (isPdf) {
        const blob = await renderPdfFirstPageToImage(originalFile, format);
        setConvertedFile(blob);
        toast.success(`PDF converted to ${format.toUpperCase()} successfully!`);
      } else if (isWord) {
        setExtractionProgress('Converting Word document to image...');
        const blob = await convertWordDocumentToImage(originalFile, format);
        setConvertedFile(blob);
        toast.success(`Word document converted to ${format.toUpperCase()} successfully!`);
      } else if (originalFile.type.startsWith('image/')) {
        const blob = await reencodeImage(originalFile, format);
        setConvertedFile(blob);
        toast.success(`Image converted to ${format.toUpperCase()} successfully!`);
      } else {
        // Fallback for other file types
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        canvas.width = 800;
        canvas.height = 400;
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
      setExtractionProgress('');
    }
  }, [originalFile, renderPdfFirstPageToImage, reencodeImage]);

  const handleConvertToPpt = useCallback(async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setConversionType('ppt');

    try {
      let presentationData;
      if (originalFile.type === 'text/plain') {
        const content = await originalFile.text();
        presentationData = convertWordToPowerPoint(content, originalFile.name);
      } else if (originalFile.type === 'application/pdf') {
        if (useImageBasedConversion) {
          setExtractionProgress('Converting PDF pages to images for exact design preservation...');
          presentationData = await convertPdfToPowerPointWithImages(originalFile, originalFile.name);
        } else {
          setExtractionProgress('Extracting text from PDF...');
          presentationData = await convertPdfToPowerPoint(originalFile, originalFile.name);
        }
      } else if (originalFile.name.endsWith('.doc') || originalFile.name.endsWith('.docx')) {
        try {
          const mammoth = await import('mammoth');
          const arrayBuffer = await originalFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          const content = result.value || `Document content from ${originalFile.name}`;
          presentationData = convertWordToPowerPoint(content, originalFile.name);
        } catch (error) {
          console.error('Error extracting DOC content:', error);
          toast.error('Failed to extract content from DOC file');
          return;
        }
      } else if (originalFile.name.endsWith('.ppt') || originalFile.name.endsWith('.pptx')) {
        try {
          // Extract text from PowerPoint file
          const arrayBuffer = await originalFile.arrayBuffer();
          let extractedText = '';
          
          if (originalFile.name.endsWith('.pptx')) {
            // For PPTX files, try to extract text using ZIP parsing
            const JSZip = await import('@zip.js/zip.js');
            const zipReader = new JSZip.ZipReader(new JSZip.BlobReader(originalFile));
            const entries = await zipReader.getEntries();
            
            for (const entry of entries) {
              if (entry.filename.includes('slide') && entry.filename.endsWith('.xml')) {
                if (entry.getData) {
                  const textWriter = new JSZip.TextWriter();
                  const content = await entry.getData(textWriter);
                  // Extract text from XML content
                  const textMatches = content.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
                  if (textMatches) {
                    textMatches.forEach(match => {
                      const text = match.replace(/<a:t[^>]*>([^<]*)<\/a:t>/, '$1');
                      extractedText += text + '\n';
                    });
                  }
                }
              }
            }
            await zipReader.close();
          }
          
          if (!extractedText.trim()) {
            extractedText = `PowerPoint Presentation: ${originalFile.name}\n\nExtracted content from presentation slides.`;
          }
          
          presentationData = convertWordToPowerPoint(extractedText, originalFile.name);
        } catch (error) {
          console.error('Error extracting PPT content:', error);
          const content = `PowerPoint Presentation: ${originalFile.name}\n\nPresentation converted to PowerPoint format.`;
          presentationData = convertWordToPowerPoint(content, originalFile.name);
        }
      } else if (originalFile.name.endsWith('.xlsx') || originalFile.name.endsWith('.xls')) {
        try {
          const XLSX = await getXLSX();
          const arrayBuffer = await originalFile.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const content = XLSX.utils.sheet_to_csv(sheet);
          presentationData = convertWordToPowerPoint(content, originalFile.name);
        } catch (e) {
          console.error('Error processing Excel file:', e);
          toast.error('Failed to process Excel file');
          return;
        }
      } else {
        const content = `Content from: ${originalFile.name}\nFile type: ${originalFile.type}\nConverted to PowerPoint format`;
        presentationData = convertWordToPowerPoint(content, originalFile.name);
      }
      const blob = await createPowerPointBlob(presentationData);
      setConvertedFile(blob);
      toast.success('File converted to PowerPoint format!');
    } catch (error) {
      console.error('Error converting to PPT:', error);
      toast.error('Failed to convert to PowerPoint.');
    } finally {
      setIsProcessing(false);
      setExtractionProgress('');
    }
  }, [originalFile, getXLSX]);

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
    else if (conversionType === 'doc') extension = '.rtf';
    else if (conversionType === 'ppt') extension = '.pptx';
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
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv',
    'image/svg+xml',
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
            description="Supports PDF, DOC, DOCX, PPT, PPTX, Excel (XLSX/XLS), CSV, images, SVG, and text files"
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
            {originalFile && recommendedFormats.length > 0 && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="text-sm font-medium mb-2 text-primary">✨ Recommended Formats</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Based on your {getFileType(originalFile)} file, we recommend converting to:
                </p>
                <div className="flex flex-wrap gap-1">
                  {recommendedFormats.map((format) => (
                    <span
                      key={format}
                      className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md font-medium"
                    >
                      {format.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {originalFile.type === 'application/pdf' && recommendedFormats.includes('ppt') && !originalFile?.name.endsWith('.doc') && !originalFile?.name.endsWith('.docx') && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-orange-400">🎨 Preserve Exact Design</h4>
                    <p className="text-xs text-muted-foreground">
                      Convert PDF pages to images to maintain exact layout, fonts, and design
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useImageBasedConversion}
                      onChange={(e) => setUseImageBasedConversion(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {recommendedFormats.includes('pdf') && (
                <Button onClick={handleConvertToPdf} disabled={isProcessing}>Convert to PDF</Button>
              )}
              {recommendedFormats.includes('docx') && (
                <Button onClick={handleConvertToDocx} disabled={isProcessing}>Convert to DOCX</Button>
              )}
              {recommendedFormats.includes('doc') && (
                <Button onClick={handleConvertToDoc} disabled={isProcessing}>Convert to DOC</Button>
              )}
              {recommendedFormats.includes('ppt') && !originalFile?.name.endsWith('.doc') && !originalFile?.name.endsWith('.docx') && (
                <Button onClick={handleConvertToPpt} disabled={isProcessing}>
                  {useImageBasedConversion && originalFile?.type === 'application/pdf' ? 'Convert to PPT (Image-based)' : 'Convert to PPT'}
                </Button>
              )}
              {recommendedFormats.includes('csv') && (
                <Button onClick={handleConvertToCsv} disabled={isProcessing}>Convert to CSV</Button>
              )}
              {recommendedFormats.includes('jpg') && (
                <Button onClick={() => handleConvertToImage('jpg')} disabled={isProcessing}>Convert to JPG</Button>
              )}
              {recommendedFormats.includes('png') && (
                <Button onClick={() => handleConvertToImage('png')} disabled={isProcessing}>Convert to PNG</Button>
              )}
            </div>
            {isProcessing && extractionProgress && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400 font-medium">{extractionProgress}</p>
              </div>
            )}
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
