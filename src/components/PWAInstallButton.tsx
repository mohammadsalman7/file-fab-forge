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
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">App Installed</span>
        </div>
      </div>
    );
  }

  // Don't show if can't install
  if (!canInstall) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Install ImageDocPro</p>
              <p className="text-xs opacity-90">Use offline & get app-like experience</p>
            </div>
          </div>
          <Button
            onClick={handleInstall}
            disabled={isInstalling}
            size="sm"
            variant="secondary"
            className="bg-white text-blue-500 hover:bg-gray-100"
          >
            <Download className={`h-4 w-4 mr-1 ${isInstalling ? 'animate-spin' : ''}`} />
            {isInstalling ? 'Installing...' : 'Install'}
          </Button>
        </div>
      </div>
    </div>
  );
};
