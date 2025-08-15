// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): void {
    this.metrics.set(name, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.metrics.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(name);
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      return duration;
    }
    return 0;
  }

  measurePageLoad(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        console.log('📊 Page Load Performance:');
        console.log(`  - DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
        console.log(`  - Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
        console.log(`  - Total Load Time: ${navigation.loadEventEnd - navigation.startTime}ms`);
      }
    });
  }

  measureImageLoad(imageElement: HTMLImageElement): Promise<number> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      const onLoad = () => {
        const duration = performance.now() - startTime;
        console.log(`🖼️ Image loaded in ${duration.toFixed(2)}ms`);
        resolve(duration);
        imageElement.removeEventListener('load', onLoad);
      };

      imageElement.addEventListener('load', onLoad);
    });
  }
}

// Debounce utility for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memory usage monitoring
export function getMemoryUsage(): void {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('🧠 Memory Usage:');
    console.log(`  - Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`  - Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`  - Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();
