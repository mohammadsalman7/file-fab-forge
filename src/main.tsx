import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { performanceMonitor } from './utils/performance'
import { serviceWorkerUtils } from './utils/serviceWorker'
import { pwaUtils } from './utils/pwa'

// Initialize service worker and PWA features
if (serviceWorkerUtils.isSupported()) {
  window.addEventListener('load', async () => {
    // Initialize our service worker manager (will use existing registration if available)
    await serviceWorkerUtils.init();
    
    // Initialize PWA features
    pwaUtils.init();
    
    // Request notification permission for update notifications
    await serviceWorkerUtils.requestNotificationPermission();
  });
}

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
  const criticalResources = [
    '/uploads/logo.png',
  ];
  
  criticalResources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Run preloading
preloadCriticalResources();

// Initialize performance monitoring
performanceMonitor.measurePageLoad();

createRoot(document.getElementById("root")!).render(<App />)
