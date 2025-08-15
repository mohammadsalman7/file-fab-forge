import { useState, useEffect } from 'react';
import { serviceWorkerManager, serviceWorkerUtils } from '@/utils/serviceWorker';

interface ServiceWorkerState {
  isSupported: boolean;
  isActive: boolean;
  isUpdateAvailable: boolean;
  isUpdating: boolean;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: serviceWorkerUtils.isSupported(),
    isActive: false,
    isUpdateAvailable: false,
    isUpdating: false
  });

  useEffect(() => {
    if (!state.isSupported) return;

    const checkServiceWorkerStatus = () => {
      const registration = serviceWorkerManager.getRegistration();
      setState(prev => ({
        ...prev,
        isActive: serviceWorkerManager.isActive()
      }));
    };

    // Check initial status
    checkServiceWorkerStatus();

    // Set up periodic checks
    const interval = setInterval(checkServiceWorkerStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [state.isSupported]);

  const checkForUpdates = async (): Promise<boolean> => {
    if (!state.isSupported) return false;

    setState(prev => ({ ...prev, isUpdating: true }));

    try {
      const hasUpdates = await serviceWorkerManager.checkForUpdates();
      setState(prev => ({ 
        ...prev, 
        isUpdateAvailable: hasUpdates,
        isUpdating: false 
      }));
      return hasUpdates;
    } catch (error) {
      setState(prev => ({ ...prev, isUpdating: false }));
      console.error('Failed to check for updates:', error);
      return false;
    }
  };

  const clearCaches = async (): Promise<void> => {
    if (!state.isSupported) return;

    try {
      await serviceWorkerUtils.clearAllCaches();
      console.log('Caches cleared successfully');
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  };

  const unregister = async (): Promise<boolean> => {
    if (!state.isSupported) return false;

    try {
      const success = await serviceWorkerManager.unregister();
      if (success) {
        setState(prev => ({ 
          ...prev, 
          isActive: false,
          isUpdateAvailable: false 
        }));
      }
      return success;
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
      return false;
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!state.isSupported) return false;

    try {
      const granted = await serviceWorkerUtils.requestNotificationPermission();
      return granted;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  };

  return {
    ...state,
    checkForUpdates,
    clearCaches,
    unregister,
    requestNotificationPermission
  };
};
