import { useEffect, useState } from 'react';
import { Lock, Download, Key } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkPdfPassword } from '@/utils/pdfPasswordRemover';
import { addPdfPassword, isProtectAvailable } from '@/utils/pdfProtector';
import { createPasswordProtectedZip } from '@/utils/zipEncrypt';
import { toast } from 'sonner';

export const PdfProtector = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [protectAvailable, setProtectAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const available = await isProtectAvailable();
      if (!cancelled) setProtectAvailable(available);
      if (!available) {
        toast.info('Protect PDF will be enabled once the browser encryption module (WASM) is integrated.');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file.');
      return;
    }

    setOriginalFile(file);
    setProcessedFile(null);
    setIsPasswordRequired(false);
    setNewPassword('');
    setConfirmPassword('');
    setIsChecking(true);

    try {
      const requiresPassword = await checkPdfPassword(file);
      setIsPasswordRequired(requiresPassword);
      if (requiresPassword) {
        toast.info('This PDF is already password protected. Remove the password first to set a new one.');
      } else {
        toast.info('This PDF is not password protected. You can add a password to protect it.');
      }
    } catch (error) {
      console.error('Error checking PDF:', error);
      toast.error('Error checking PDF file. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleProtect = async () => {
    if (!originalFile) return;

    if (!newPassword.trim()) { toast.error('Please enter a password to set.'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match.'); return; }
    if (isPasswordRequired) {
      toast.error('This PDF is already password protected. Remove the password first.');
      return;
    }

    // Quick capability check
    const available = await isProtectAvailable();

    setIsProcessing(true);
    try {
      if (available) {
        const result = await addPdfPassword(originalFile, newPassword);
        toast.success('PDF protected with password successfully!');
        setProcessedFile(result);
      } else {
        // Fallback: create password-protected ZIP containing the PDF
        const zipBlob = await createPasswordProtectedZip([
          { name: originalFile.name.replace(/\/+|\\+/g, '-'), blob: originalFile },
        ], newPassword);
        setProcessedFile(zipBlob);
        toast.success('ZIP created with password successfully!');
      }
    } catch (error) {
      console.error('Error adding password:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to add password to PDF.');
      } else {
        toast.error('Failed to add password to PDF.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile || !originalFile) return;

    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    
    const fileName = originalFile.name.replace(/\.pdf$/i, protectAvailable === false ? '_locked.zip' : '_locked.pdf');
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Locked PDF downloaded successfully!');
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
      title="PDF Protector"
      description="Add password protection to PDF files for enhanced security"
      icon={<Lock className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedTypes={['application/pdf']}
            title="Drop your PDF to protect with a password"
            description="Upload a PDF to add open-password protection"
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

            {!isChecking && (
              <div className="space-y-4">
                {isPasswordRequired ? (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-yellow-400" />
                      <p className="text-sm text-yellow-400">This PDF is already password protected</p>
                    </div>
                    <p className="text-xs text-yellow-400 mt-1">
                      Remove the password first to set a new one using the PDF Password Remover tool.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400">✓ This PDF is not password protected</p>
                    <p className="text-xs text-muted-foreground mt-1">You can add a password to protect this PDF</p>
                  </div>
                )}

                {!isPasswordRequired && (
                  <>
                    {protectAvailable === false && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs">
                        Note: This feature currently protects your PDF by placing it inside a password-protected ZIP.
                        The password will be required when extracting the ZIP, not when opening the PDF directly.
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Set New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleProtect();
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleProtect();
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleProtect}
                      disabled={
                        isProcessing ||
                        !newPassword.trim() ||
                        !confirmPassword.trim()
                      }
                      className="w-full bg-gradient-primary hover:opacity-90"
                    >
                      {isProcessing ? (protectAvailable === false ? 'Creating ZIP...' : 'Protecting PDF...') : 'Protect'}
                    </Button>
                  </>
                )}
              </div>
            )}

            {processedFile && (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400 font-medium">
                    {protectAvailable === false ? '✓ ZIP created with password!' : '✓ PDF protected successfully!'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {protectAvailable === false ? 'Your password-protected ZIP is ready to download' : 'Your password-protected PDF is ready to download'}
                  </p>
                </div>

                <Button
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {protectAvailable === false ? 'Download Locked ZIP' : 'Download Locked PDF'}
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
                setProcessedFile(null);
                setIsPasswordRequired(false);
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Choose different file
            </button>
          </div>
        )}

        {protectAvailable === false && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-400">
              Protect PDF is not available in this browser-only build yet. We will enable it soon once the encryption module is integrated.
            </p>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
