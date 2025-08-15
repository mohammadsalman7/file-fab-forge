import { useState, useEffect } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pwaUtils } from '@/utils/pwa';
import { toast } from 'sonner';

export const PWAInstallButton = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const updateInstallState = () => {
      const status = pwaUtils.getStatus();
      setCanInstall(status.canInstall);
      setIsInstalled(status.isInstalled);
    };

    // Initial check
    updateInstallState();

    // Listen for install state changes
    const handleInstallStateChange = (event: CustomEvent) => {
      setCanInstall(event.detail.canInstall);
      setIsInstalled(event.detail.isInstalled);
    };

    window.addEventListener('pwa-install-state-changed', handleInstallStateChange as EventListener);

    // Check periodically for changes
    const interval = setInterval(updateInstallState, 2000);

    return () => {
      window.removeEventListener('pwa-install-state-changed', handleInstallStateChange as EventListener);
      clearInterval(interval);
    };
  }, []);

  const handleInstall = async () => {
    if (!canInstall) return;

    setIsInstalling(true);
    try {
      const success = await pwaUtils.requestInstall();
      if (success) {
        toast.success('PWA installed successfully! You can now use the app offline.');
        setIsInstalled(true);
        setCanInstall(false);
      } else {
        toast.error('PWA installation was cancelled or failed.');
      }
    } catch (error) {
      console.error('Installation error:', error);
      toast.error('Failed to install PWA. Please try again.');
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't show anything if PWA is already installed
  if (isInstalled) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <Check className="h-4 w-4" />
        <span className="text-sm font-medium">Installed</span>
      </div>
    );
  }

  // Don't show if can't install
  if (!canInstall) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      disabled={isInstalling}
      size="sm"
      variant="outline"
      className="flex items-center space-x-2"
    >
      <Download className={`h-4 w-4 ${isInstalling ? 'animate-spin' : ''}`} />
      <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
    </Button>
  );
};
