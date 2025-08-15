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
  private deferredPrompt: any = null;
  private installButton: HTMLElement | null = null;

  private constructor() {
    this.setupEventListeners();
    this.setupInstallPrompt();
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

  private setupInstallPrompt(): void {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      // Update UI to notify the user they can install the PWA
      this.updateInstallButton();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', (evt) => {
      console.log('PWA was installed');
      this.deferredPrompt = null;
      this.updateInstallButton();
    });
  }

  private updateInstallButton(): void {
    // This will be called when the install button should be shown/hidden
    const event = new CustomEvent('pwa-install-state-changed', {
      detail: {
        canInstall: this.canInstallPWA(),
        isInstalled: this.isPWAInstalled()
      }
    });
    window.dispatchEvent(event);
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
    if (!this.deferredPrompt) {
      console.log('No deferred prompt available');
      return false;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log(`User response to the install prompt: ${outcome}`);
      
      // Clear the deferredPrompt variable
      this.deferredPrompt = null;
      
      // Update the install button
      this.updateInstallButton();
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    }
  }

  /**
   * Check if PWA can be installed
   */
  canInstallPWA(): boolean {
    return this.deferredPrompt !== null;
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
