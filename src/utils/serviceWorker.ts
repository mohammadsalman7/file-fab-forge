// Service Worker Registration and Management
export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  /**
   * Register the service worker
   */
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return null;
    }

    try {
      // Check if Vite PWA has already registered a service worker
      const existingRegistration = await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        this.registration = existingRegistration;
        console.log('Using existing Service Worker registration:', this.registration);
        this.setupUpdateHandling();
        return this.registration;
      }

      // Fallback to manual registration if needed
      const swUrl = `${import.meta.env.BASE_URL || '/'}sw.js`;
      this.registration = await navigator.serviceWorker.register(swUrl);
      
      console.log('Service Worker registered successfully:', this.registration);
      
      // Set up update handling
      this.setupUpdateHandling();
      
      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Set up automatic update handling
   */
  private setupUpdateHandling(): void {
    if (!this.registration) return;

    this.registration.onupdatefound = () => {
      const newWorker = this.registration!.installing;
      if (!newWorker) return;

      newWorker.onstatechange = () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version available
          console.log('New version available, refreshing...');
          this.handleUpdate();
        }
      };
    };
  }

  /**
   * Handle service worker updates
   */
  private handleUpdate(): void {
    // Show a notification to the user (optional)
    this.showUpdateNotification();
    
    // Auto-refresh after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  /**
   * Show update notification to user
   */
  private showUpdateNotification(): void {
    // You can customize this to show a toast or notification
         if ('Notification' in window && Notification.permission === 'granted') {
       new Notification('ImageDocPro Updated', {
         body: 'A new version is available. The page will refresh automatically.',
         icon: '/uploads/logo.png'
       });
     }
  }

  /**
   * Check for updates manually
   */
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      await this.registration.unregister();
      this.registration = null;
      console.log('Service Worker unregistered');
      return true;
    } catch (error) {
      console.error('Failed to unregister Service Worker:', error);
      return false;
    }
  }

  /**
   * Get the current registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  /**
   * Check if service worker is active
   */
  isActive(): boolean {
    return this.registration?.active !== null;
  }
}

// Export singleton instance
export const serviceWorkerManager = ServiceWorkerManager.getInstance();

// Utility functions for service worker management
export const serviceWorkerUtils = {
  /**
   * Initialize service worker
   */
  async init(): Promise<void> {
    await serviceWorkerManager.register();
  },

  /**
   * Check if service worker is supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator;
  },

  /**
   * Request notification permission for update notifications
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return Notification.permission === 'granted';
  },

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  }
};
