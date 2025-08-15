import { useState } from 'react';
import { FileText, Download, Table, Layout } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { extractTextFromPdfWithFormatting } from '@/utils/pdfTextExtractor';
import { extractTablesFromPdf } from '@/utils/pdfTableExtractor';
import { toast } from 'sonner';

export const EnhancedPdfExtractor = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<{
    text: string;
    pages: any[];
    tables: any[];
    csvContent: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'tables' | 'csv'>('text');

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setExtractedData(null);
  };

  const handleExtractText = async () => {
    if (!originalFile) return;
    setIsProcessing(true);

    try {
      // Extract text with formatting
      const pages = await extractTextFromPdfWithFormatting(originalFile);
      const text = pages.map(page => page.text).join('\n\n');
      
      // Extract tables
      const { tables, csvContent } = await extractTablesFromPdf(originalFile);
      
      setExtractedData({
        text,
        pages,
        tables,
        csvContent
      });
      
      toast.success('Text and tables extracted successfully!');
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to extract text from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadText = () => {
    if (!extractedData || !originalFile) return;
    
    const blob = new Blob([extractedData.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFile.name.split('.')[0]}_extracted_text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    if (!extractedData || !originalFile) return;
    
    const blob = new Blob([extractedData.csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFile.name.split('.')[0]}_extracted_tables.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolCard
      title="Enhanced PDF Extractor"
      description="Extract text and tables from PDF with preserved formatting"
      icon={<FileText className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={['application/pdf']}
            title="Drop your PDF file here"
            description="Supports PDF files with text content and tables"
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
              {isProcessing ? 'Extracting...' : 'Extract Text & Tables'}
            </Button>

            {extractedData && (
              <div className="space-y-4">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400 font-medium">✓ Extraction complete!</p>
                  <p className="text-xs text-green-400/80 mt-1">
                    {extractedData.text.length} characters, {extractedData.tables.length} tables found
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'text' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Layout className="h-4 w-4 inline mr-2" />
                    Formatted Text
                  </button>
                  <button
                    onClick={() => setActiveTab('tables')}
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'tables' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Table className="h-4 w-4 inline mr-2" />
                    Tables ({extractedData.tables.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('csv')}
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'csv' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileText className="h-4 w-4 inline mr-2" />
                    CSV Export
                  </button>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto p-3 bg-muted/20 rounded-lg border">
                  {activeTab === 'text' && (
                    <div className="space-y-4">
                      {extractedData.pages.map((page, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <h4 className="font-semibold text-sm mb-2">Page {page.page}</h4>
                          <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                            {page.text}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === 'tables' && (
                    <div className="space-y-4">
                      {extractedData.tables.length > 0 ? (
                        extractedData.tables.map((table, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <h4 className="font-semibold text-sm mb-2">Table {index + 1}</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-xs">
                                <tbody>
                                  {table.rows.map((row: any, rowIndex: number) => (
                                    <tr key={rowIndex}>
                                      {row.cells.map((cell: any, cellIndex: number) => (
                                        <td key={cellIndex} className="border px-2 py-1">
                                          {cell.text}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No tables detected in this PDF.</p>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'csv' && (
                    <div>
                      <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                        {extractedData.csvContent || 'No CSV content available.'}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Download buttons */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleDownloadText} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Text
                  </Button>
                  {extractedData.tables.length > 0 && (
                    <Button 
                      onClick={handleDownloadCsv} 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setExtractedData(null);
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
