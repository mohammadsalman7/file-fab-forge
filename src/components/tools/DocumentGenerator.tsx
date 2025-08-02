import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download } from 'lucide-react';
import { createTextPdf } from '@/utils/pdfConverter';
import { toast } from '@/hooks/use-toast';

interface DocumentData {
  type: string;
  companyName: string;
  companyAddress: string;
  recipientName: string;
  recipientAddress: string;
  position?: string;
  salary?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  additionalContent: string;
}

const documentTemplates = {
  'offer-letter': {
    title: 'Offer Letter',
    fields: ['companyName', 'companyAddress', 'recipientName', 'recipientAddress', 'position', 'salary', 'startDate'],
    template: (data: DocumentData) => `
OFFER LETTER

${data.companyName}
${data.companyAddress}

Date: ${new Date().toLocaleDateString()}

Dear ${data.recipientName},

We are pleased to offer you the position of ${data.position} at ${data.companyName}.

Position: ${data.position}
Salary: ${data.salary}
Start Date: ${data.startDate}

Your address:
${data.recipientAddress}

${data.additionalContent}

We look forward to having you on our team.

Sincerely,
${data.companyName}
HR Department
    `
  },
  'nda': {
    title: 'Non-Disclosure Agreement',
    fields: ['companyName', 'companyAddress', 'recipientName', 'recipientAddress'],
    template: (data: DocumentData) => `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into between:

${data.companyName}
${data.companyAddress}

AND

${data.recipientName}
${data.recipientAddress}

Date: ${new Date().toLocaleDateString()}

WHEREAS, the parties wish to explore potential business opportunities that may require disclosure of confidential information;

NOW, THEREFORE, the parties agree as follows:

1. CONFIDENTIAL INFORMATION
All information disclosed between the parties shall be considered confidential.

2. OBLIGATIONS
The receiving party agrees to maintain confidentiality of all disclosed information.

3. DURATION
This agreement shall remain in effect for a period of two (2) years.

${data.additionalContent}

_________________________          _________________________
${data.companyName}                 ${data.recipientName}
Signature                          Signature

Date: _______________              Date: _______________
    `
  },
  'internship-letter': {
    title: 'Internship Letter',
    fields: ['companyName', 'companyAddress', 'recipientName', 'recipientAddress', 'position', 'duration', 'startDate'],
    template: (data: DocumentData) => `
INTERNSHIP OFFER LETTER

${data.companyName}
${data.companyAddress}

Date: ${new Date().toLocaleDateString()}

Dear ${data.recipientName},

We are delighted to offer you an internship position at ${data.companyName}.

Intern Position: ${data.position}
Duration: ${data.duration}
Start Date: ${data.startDate}

Your address:
${data.recipientAddress}

During your internship, you will gain valuable experience and contribute to our team's success.

${data.additionalContent}

We look forward to working with you.

Best regards,
${data.companyName}
HR Department
    `
  },
  'relieving-letter': {
    title: 'Relieving Letter',
    fields: ['companyName', 'companyAddress', 'recipientName', 'recipientAddress', 'position', 'startDate', 'endDate'],
    template: (data: DocumentData) => `
RELIEVING LETTER

${data.companyName}
${data.companyAddress}

Date: ${new Date().toLocaleDateString()}

TO WHOM IT MAY CONCERN

This is to certify that ${data.recipientName} was employed with ${data.companyName} as ${data.position}.

Employee Details:
Name: ${data.recipientName}
Position: ${data.position}
Employment Period: ${data.startDate} to ${data.endDate}

Address:
${data.recipientAddress}

${data.recipientName} has been relieved from duties as of ${data.endDate}. We wish them success in their future endeavors.

${data.additionalContent}

Sincerely,
${data.companyName}
HR Department

_________________________
Authorized Signatory
    `
  }
};

export const DocumentGenerator = () => {
  const [documentData, setDocumentData] = useState<DocumentData>({
    type: 'offer-letter',
    companyName: '',
    companyAddress: '',
    recipientName: '',
    recipientAddress: '',
    position: '',
    salary: '',
    startDate: '',
    endDate: '',
    duration: '',
    additionalContent: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setDocumentData(prev => ({ ...prev, [field]: value }));
  };

  const generateDocument = async () => {
    try {
      const template = documentTemplates[documentData.type as keyof typeof documentTemplates];
      const content = template.template(documentData);
      
      const pdfBlob = await createTextPdf(content, template.title);
      
      // Download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Document Generated",
        description: `${template.title} has been generated and downloaded successfully.`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const currentTemplate = documentTemplates[documentData.type as keyof typeof documentTemplates];

  return (
    <Card className="bg-gradient-glass backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl">Document Generator</CardTitle>
            <p className="text-sm text-muted-foreground">Create professional documents with custom headers and content</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Document Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="document-type">Document Type</Label>
          <Select value={documentData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="offer-letter">Offer Letter</SelectItem>
              <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
              <SelectItem value="internship-letter">Internship Letter</SelectItem>
              <SelectItem value="relieving-letter">Relieving Letter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTemplate.fields.includes('companyName') && (
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={documentData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
          )}

          {currentTemplate.fields.includes('recipientName') && (
            <div className="space-y-2">
              <Label htmlFor="recipient-name">Recipient Name</Label>
              <Input
                id="recipient-name"
                value={documentData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="Enter recipient name"
              />
            </div>
          )}

          {currentTemplate.fields.includes('position') && (
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={documentData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Enter position/role"
              />
            </div>
          )}

          {currentTemplate.fields.includes('salary') && (
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                value={documentData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="Enter salary amount"
              />
            </div>
          )}

          {currentTemplate.fields.includes('startDate') && (
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={documentData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
          )}

          {currentTemplate.fields.includes('endDate') && (
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={documentData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          )}

          {currentTemplate.fields.includes('duration') && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={documentData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 3 months, 6 weeks"
              />
            </div>
          )}
        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTemplate.fields.includes('companyAddress') && (
            <div className="space-y-2">
              <Label htmlFor="company-address">Company Address</Label>
              <Textarea
                id="company-address"
                value={documentData.companyAddress}
                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                placeholder="Enter company address"
                className="min-h-[80px]"
              />
            </div>
          )}

          {currentTemplate.fields.includes('recipientAddress') && (
            <div className="space-y-2">
              <Label htmlFor="recipient-address">Recipient Address</Label>
              <Textarea
                id="recipient-address"
                value={documentData.recipientAddress}
                onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                placeholder="Enter recipient address"
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>

        {/* Additional Content */}
        <div className="space-y-2">
          <Label htmlFor="additional-content">Additional Content</Label>
          <Textarea
            id="additional-content"
            value={documentData.additionalContent}
            onChange={(e) => handleInputChange('additionalContent', e.target.value)}
            placeholder="Add any additional terms, conditions, or content..."
            className="min-h-[120px]"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateDocument}
          className="w-full"
          disabled={!documentData.companyName || !documentData.recipientName}
        >
          <Download className="h-4 w-4 mr-2" />
          Generate {currentTemplate.title}
        </Button>
      </CardContent>
    </Card>
  );
};