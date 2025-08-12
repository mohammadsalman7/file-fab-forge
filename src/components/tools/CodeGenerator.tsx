import { useState } from 'react';
import { QrCode, Barcode, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { generateQRCode, generateBarcode, downloadCode, type CodeGeneratorData, type OutputFormat } from '@/utils/codeGenerator';

export const CodeGenerator = () => {
  const [formData, setFormData] = useState<CodeGeneratorData>({
    name: '',
    number: '',
    link: '',
    address: '',
    pin: ''
  });
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeBlob, setQrCodeBlob] = useState<Blob | null>(null);
  const [barcodeBlob, setBarcodeBlob] = useState<Blob | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [barcodePreview, setBarcodePreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof CodeGeneratorData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasData = Object.values(formData).some(value => value.trim() !== '');

  const generateCodes = async () => {
    if (!hasData) {
      toast.error('Please enter at least one field');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate QR Code
      const qrBlob = await generateQRCode(formData, outputFormat);
      setQrCodeBlob(qrBlob);
      setQrCodePreview(URL.createObjectURL(qrBlob));

      // Generate Barcode
      const barcodeBlob = await generateBarcode(formData, outputFormat);
      setBarcodeBlob(barcodeBlob);
      setBarcodePreview(URL.createObjectURL(barcodeBlob));

      toast.success('Codes generated successfully!');
    } catch (error) {
      console.error('Code generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate codes');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeBlob) {
      downloadCode(qrCodeBlob, `qr-code.${outputFormat}`);
    }
  };

  const downloadBarcode = () => {
    if (barcodeBlob) {
      downloadCode(barcodeBlob, `barcode.${outputFormat}`);
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      number: '',
      link: '',
      address: '',
      pin: ''
    });
    setQrCodeBlob(null);
    setBarcodeBlob(null);
    setQrCodePreview(null);
    setBarcodePreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Code Generator Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="number">Number/ID</Label>
              <Input
                id="number"
                placeholder="Enter number or ID"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link">Website/Link</Label>
              <Input
                id="link"
                placeholder="Enter URL or link"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pin">PIN/Code</Label>
              <Input
                id="pin"
                placeholder="Enter PIN or code"
                value={formData.pin}
                onChange={(e) => handleInputChange('pin', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Output Format</Label>
              <Select value={outputFormat} onValueChange={(value: OutputFormat) => setOutputFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={generateCodes}
              disabled={!hasData || isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <QrCode className="h-4 w-4" />
              )}
              Generate Codes
            </Button>
            
            <Button variant="outline" onClick={clearForm}>
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Codes Preview */}
      {(qrCodePreview || barcodePreview) && (
        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="barcode" className="flex items-center gap-2">
              <Barcode className="h-4 w-4" />
              Barcode
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle>Generated QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {qrCodePreview && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-background p-4 rounded-lg border">
                      <img 
                        src={qrCodePreview} 
                        alt="Generated QR Code" 
                        className="max-w-full h-auto"
                        style={{ maxWidth: '300px' }}
                      />
                    </div>
                    <Button 
                      onClick={downloadQRCode}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download QR Code ({outputFormat.toUpperCase()})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="barcode">
            <Card>
              <CardHeader>
                <CardTitle>Generated Barcode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {barcodePreview && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-background p-4 rounded-lg border">
                      <img 
                        src={barcodePreview} 
                        alt="Generated Barcode" 
                        className="max-w-full h-auto"
                        style={{ maxWidth: '400px' }}
                      />
                    </div>
                    <Button 
                      onClick={downloadBarcode}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Barcode ({outputFormat.toUpperCase()})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};