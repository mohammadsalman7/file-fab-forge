import { useState } from 'react';
import { RefreshCw, Wifi, WifiOff, Settings, Trash2, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { pwaUtils } from '@/utils/pwa';
import { toast } from 'sonner';

export const ServiceWorkerStatus = () => {
  const {
    isSupported,
    isActive,
    isUpdateAvailable,
    isUpdating,
    checkForUpdates,
    clearCaches,
    unregister,
    requestNotificationPermission
  } = useServiceWorker();

  const [showDetails, setShowDetails] = useState(false);
  const pwaStatus = pwaUtils.getStatus();

  const handleCheckUpdates = async () => {
    const hasUpdates = await checkForUpdates();
    if (hasUpdates) {
      toast.success('Update available! The page will refresh automatically.');
    } else {
      toast.info('No updates available.');
    }
  };

  const handleClearCaches = async () => {
    await clearCaches();
    toast.success('Caches cleared successfully.');
  };

  const handleUnregister = async () => {
    const success = await unregister();
    if (success) {
      toast.success('Service Worker unregistered.');
    } else {
      toast.error('Failed to unregister Service Worker.');
    }
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      toast.success('Notification permission granted.');
    } else {
      toast.error('Notification permission denied.');
    }
  };

  const handleInstallPWA = async () => {
    const installed = await pwaUtils.requestInstall();
    if (installed) {
      toast.success('PWA installed successfully!');
    } else {
      toast.error('PWA installation failed or was cancelled.');
    }
  };

  if (!isSupported) {
    return null; // Don't show anything if service worker is not supported
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-3">
        {/* Status indicator */}
        <div className="flex items-center space-x-2 mb-2">
          {isActive ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm font-medium">
            {isActive ? 'Offline Ready' : 'Online Only'}
          </span>
          {pwaStatus.isInstalled && (
            <Smartphone className="h-4 w-4 text-blue-500" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-6 w-6 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Update indicator */}
        {isUpdateAvailable && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2 mb-2">
            <p className="text-xs text-blue-600">
              New version available! Refreshing automatically...
            </p>
          </div>
        )}

        {/* Details panel */}
        {showDetails && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCheckUpdates}
                disabled={isUpdating}
                className="flex-1 text-xs"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? 'Checking...' : 'Check Updates'}
              </Button>
            </div>

            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearCaches}
                className="flex-1 text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear Cache
              </Button>
            </div>

                         <div className="flex space-x-1">
               <Button
                 size="sm"
                 variant="outline"
                 onClick={handleRequestNotifications}
                 className="flex-1 text-xs"
               >
                 Enable Notifications
               </Button>
             </div>

             {pwaStatus.canInstall && !pwaStatus.isInstalled && (
               <div className="flex space-x-1">
                 <Button
                   size="sm"
                   variant="outline"
                   onClick={handleInstallPWA}
                   className="flex-1 text-xs"
                 >
                   <Download className="h-3 w-3 mr-1" />
                   Install App
                 </Button>
               </div>
             )}

            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleUnregister}
                className="flex-1 text-xs"
              >
                Disable Offline
              </Button>
            </div>

                         <div className="text-xs text-muted-foreground pt-1">
               <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
               <p>Version: v3</p>
               {pwaStatus.isInstalled && <p>PWA: Installed</p>}
               {pwaStatus.isOfflineReady && <p>Offline: Ready</p>}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
