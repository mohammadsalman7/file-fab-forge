import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { pwaUtils } from '@/utils/pwa';

export const PWATestPage = () => {
  const [pwaStatus, setPwaStatus] = useState(pwaUtils.getStatus());
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setPwaStatus(pwaUtils.getStatus());
    };

    // Update status every 2 seconds
    const interval = setInterval(updateStatus, 2000);

    // Listen for install state changes
    const handleInstallStateChange = () => {
      updateStatus();
    };

    window.addEventListener('pwa-install-state-changed', handleInstallStateChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('pwa-install-state-changed', handleInstallStateChange);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await pwaUtils.requestInstall();
      console.log('Install result:', success);
      setPwaStatus(pwaUtils.getStatus());
    } catch (error) {
      console.error('Install error:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>PWA Installation Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Can Install:</p>
              <Badge variant={pwaStatus.canInstall ? "default" : "secondary"}>
                {pwaStatus.canInstall ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Is Installed:</p>
              <Badge variant={pwaStatus.isInstalled ? "default" : "secondary"}>
                {pwaStatus.isInstalled ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Offline Ready:</p>
              <Badge variant={pwaStatus.isOfflineReady ? "default" : "secondary"}>
                {pwaStatus.isOfflineReady ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Has Update:</p>
              <Badge variant={pwaStatus.hasUpdate ? "default" : "secondary"}>
                {pwaStatus.hasUpdate ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Installation Requirements:</p>
            <ul className="text-sm space-y-1">
              <li>• HTTPS: {window.location.protocol === 'https:' ? '✅' : '❌'}</li>
              <li>• Service Worker: {'serviceWorker' in navigator ? '✅' : '❌'}</li>
              <li>• Manifest: {document.querySelector('link[rel="manifest"]') ? '✅' : '❌'}</li>
              <li>• BeforeInstallPrompt: {'BeforeInstallPromptEvent' in window ? '✅' : '❌'}</li>
            </ul>
          </div>

          {pwaStatus.canInstall && !pwaStatus.isInstalled && (
            <Button 
              onClick={handleInstall} 
              disabled={isInstalling}
              className="w-full"
            >
              {isInstalling ? 'Installing...' : 'Install PWA'}
            </Button>
          )}

          {pwaStatus.isInstalled && (
            <div className="bg-green-100 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                ✅ PWA is installed! You can now use the app offline.
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p>Debug Info:</p>
            <p>User Agent: {navigator.userAgent}</p>
            <p>Display Mode: {window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'}</p>
            <p>Platform: {navigator.platform}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
