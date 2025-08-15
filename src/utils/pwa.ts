// PWA Utilities for Vite PWA Plugin Integration
export interface PWAUpdateEvent {
  detail: {
    type: 'vite-pwa:update-found' | 'vite-pwa:offline-ready' | 'vite-pwa:need-refresh';
    data?: any;
  };
}

export class PWAManager {
  private static instance: PWAManager;
  private updateAvailable = false;
  private offlineReady = false;

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  private setupEventListeners(): void {
    // Listen for Vite PWA events
    window.addEventListener('vite-pwa:update-found', this.handleUpdateFound.bind(this));
    window.addEventListener('vite-pwa:offline-ready', this.handleOfflineReady.bind(this));
    window.addEventListener('vite-pwa:need-refresh', this.handleNeedRefresh.bind(this));
  }

  private handleUpdateFound(event: PWAUpdateEvent): void {
    console.log('PWA update found:', event.detail);
    this.updateAvailable = true;
    
    // Show notification to user
    this.showUpdateNotification();
  }

  private handleOfflineReady(event: PWAUpdateEvent): void {
    console.log('PWA offline ready:', event.detail);
    this.offlineReady = true;
    
    // Show offline ready notification
    this.showOfflineReadyNotification();
  }

  private handleNeedRefresh(event: PWAUpdateEvent): void {
    console.log('PWA needs refresh:', event.detail);
    
    // Auto-refresh after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  private showUpdateNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
             new Notification('ImageDocPro Update', {
         body: 'A new version is available. The app will refresh automatically.',
         icon: '/uploads/logo.png',
         tag: 'pwa-update'
       });
    }
  }

  private showOfflineReadyNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
             new Notification('ImageDocPro Ready', {
         body: 'The app is now ready to work offline!',
         icon: '/uploads/logo.png',
         tag: 'pwa-offline'
       });
    }
  }

  /**
   * Check if PWA is ready for offline use
   */
  isOfflineReady(): boolean {
    return this.offlineReady;
  }

  /**
   * Check if an update is available
   */
  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  /**
   * Install PWA (show install prompt)
   */
  async installPWA(): Promise<boolean> {
    if (!('BeforeInstallPromptEvent' in window)) {
      return false;
    }

    // Wait for the beforeinstallprompt event
    return new Promise((resolve) => {
      const handleBeforeInstallPrompt = (event: any) => {
        event.preventDefault();
        event.prompt();
        
        event.userChoice.then((choiceResult: any) => {
          resolve(choiceResult.outcome === 'accepted');
        });
        
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        resolve(false);
      }, 5000);
    });
  }

  /**
   * Check if PWA can be installed
   */
  canInstallPWA(): boolean {
    return 'BeforeInstallPromptEvent' in window;
  }

  /**
   * Check if PWA is installed
   */
  isPWAInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Get PWA installation status
   */
  getInstallationStatus(): {
    canInstall: boolean;
    isInstalled: boolean;
    isOfflineReady: boolean;
    hasUpdate: boolean;
  } {
    return {
      canInstall: this.canInstallPWA(),
      isInstalled: this.isPWAInstalled(),
      isOfflineReady: this.isOfflineReady(),
      hasUpdate: this.isUpdateAvailable()
    };
  }
}

// Export singleton instance
export const pwaManager = PWAManager.getInstance();

// PWA utility functions
export const pwaUtils = {
    /**
   * Initialize PWA features
   */
  init(): void {
    // PWA manager is already initialized as singleton
  },

  /**
   * Request PWA installation
   */
  async requestInstall(): Promise<boolean> {
    return await pwaManager.installPWA();
  },

  /**
   * Get PWA status
   */
  getStatus() {
    return pwaManager.getInstallationStatus();
  },

  /**
   * Check if running in PWA mode
   */
  isPWA(): boolean {
    return pwaManager.isPWAInstalled();
  },

  /**
   * Check if offline ready
   */
  isOfflineReady(): boolean {
    return pwaManager.isOfflineReady();
  }
};
