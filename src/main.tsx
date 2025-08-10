import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { performanceMonitor } from './utils/performance'

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
  const criticalResources = [
    '/uploads/logo2.jpg',
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
