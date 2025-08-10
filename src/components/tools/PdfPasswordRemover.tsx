import { useState } from 'react';
import { Unlock, Download, Key } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { removePdfPassword, checkPdfPassword } from '@/utils/pdfPasswordRemover';
import { toast } from 'sonner';

export const PdfPasswordRemover = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [unlockedFile, setUnlockedFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file.');
      return;
    }

    setOriginalFile(file);
    setUnlockedFile(null);
    setPassword('');
    setIsPasswordRequired(false);
    setIsChecking(true);

    try {
      const requiresPassword = await checkPdfPassword(file);
      setIsPasswordRequired(requiresPassword);
      
      if (!requiresPassword) {
        toast.info('This PDF is not password protected.');
      } else {
        toast.info('This PDF requires a password to unlock.');
      }
    } catch (error) {
      console.error('Error checking PDF:', error);
      toast.error('Error checking PDF file. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleRemovePassword = async () => {
    if (!originalFile) return;

    if (isPasswordRequired && !password.trim()) {
      toast.error('Please enter the PDF password.');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await removePdfPassword(originalFile, password);
      setUnlockedFile(result);
      toast.success('PDF password removed successfully!');
    } catch (error) {
      console.error('Error removing password:', error);
      if (error instanceof Error && error.message.includes('Incorrect password')) {
        toast.error('Incorrect password. Please try again.');
      } else {
        toast.error('Failed to remove PDF password. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!unlockedFile || !originalFile) return;

    const url = URL.createObjectURL(unlockedFile);
    const a = document.createElement('a');
    a.href = url;
    
    const fileName = originalFile.name.replace('.pdf', '_unlocked.pdf');
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Unlocked PDF downloaded successfully!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolCard
      title="PDF Password Remover"
      description="Remove password protection from PDF files instantly"
      icon={<Unlock className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={['application/pdf']}
            title="Drop your password-protected PDF here"
            description="Upload a PDF file to remove its password protection"
            maxSize={50 * 1024 * 1024} // 50MB
          />
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium truncate">{originalFile.name}</p>
              <p className="text-xs text-muted-foreground">
                PDF Document • {formatFileSize(originalFile.size)}
              </p>
            </div>

            {isChecking && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">Checking PDF protection status...</p>
              </div>
            )}

            {!isChecking && !isPasswordRequired && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-400">✓ This PDF is not password protected</p>
              </div>
            )}

            {!isChecking && isPasswordRequired && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-yellow-400" />
                    <p className="text-sm text-yellow-400">This PDF is password protected</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Enter PDF Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the password to unlock this PDF"
                    className="w-full"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleRemovePassword();
                      }
                    }}
                  />
                </div>

                <Button
                  onClick={handleRemovePassword}
                  disabled={isProcessing || !password.trim()}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  {isProcessing ? 'Removing Password...' : 'Remove Password'}
                </Button>
              </div>
            )}

            {unlockedFile && (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400 font-medium">✓ Password removed successfully!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your PDF is now unlocked and ready to download
                  </p>
                </div>

                <Button
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Unlocked PDF
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
                setUnlockedFile(null);
                setPassword('');
                setIsPasswordRequired(false);
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