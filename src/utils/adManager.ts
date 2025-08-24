// Ad Manager Utility for Google AdSense Compliance
import { siteConfig } from '@/config/site';

export interface AdConfig {
  slot: string;
  format: 'auto' | 'rectangle' | 'banner' | 'sidebar';
  position: 'top' | 'bottom' | 'sidebar' | 'content';
  minContentWords?: number;
  minContentHeight?: number;
  fallbackContent?: string;
}

export class AdManager {
  private static instance: AdManager;
  private adConfigs: Map<string, AdConfig> = new Map();
  private contentCache: Map<string, { words: number; height: number }> = new Map();

  private constructor() {
    this.initializeDefaultConfigs();
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  private initializeDefaultConfigs(): void {
    // Default ad configurations for different page types
    const defaultConfigs: Record<string, AdConfig> = {
      'image-merger': {
        slot: 'image-merger-main',
        format: 'rectangle',
        position: 'content',
        minContentWords: 500,
        minContentHeight: 1200,
        fallbackContent: 'Learn more about image merging techniques'
      },
      'background-remover': {
        slot: 'background-remover-main',
        format: 'rectangle',
        position: 'content',
        minContentWords: 500,
        minContentHeight: 1200,
        fallbackContent: 'Discover professional background removal tips'
      },
      'image-upscaler': {
        slot: 'image-upscaler-main',
        format: 'rectangle',
        position: 'content',
        minContentWords: 500,
        minContentHeight: 1200,
        fallbackContent: 'Learn about AI image upscaling technology'
      },
      'file-compressor': {
        slot: 'file-compressor-main',
        format: 'rectangle',
        position: 'content',
        minContentWords: 500,
        minContentHeight: 1200,
        fallbackContent: 'Optimize your file compression workflow'
      },
      'pdf-password-remover': {
        slot: 'pdf-password-remover-main',
        format: 'rectangle',
        position: 'content',
        minContentWords: 500,
        minContentHeight: 1200,
        fallbackContent: 'Secure PDF password removal techniques'
      }
    };

    Object.entries(defaultConfigs).forEach(([key, config]) => {
      this.adConfigs.set(key, config);
    });
  }

  public getAdConfig(pageKey: string): AdConfig | null {
    return this.adConfigs.get(pageKey) || null;
  }

  public setAdConfig(pageKey: string, config: AdConfig): void {
    this.adConfigs.set(pageKey, config);
  }

  public checkContentSufficiency(pageKey: string): boolean {
    const config = this.getAdConfig(pageKey);
    if (!config) return false;

    const mainContent = document.querySelector('main');
    if (!mainContent) return false;

    const textContent = mainContent.textContent || '';
    const wordCount = textContent.trim().split(/\s+/).length;
    const contentHeight = mainContent.scrollHeight;

    const hasEnoughWords = wordCount >= (config.minContentWords || 300);
    const hasEnoughHeight = contentHeight >= (config.minContentHeight || 800);

    // Cache the content metrics
    this.contentCache.set(pageKey, { words: wordCount, height: contentHeight });

    return hasEnoughWords && hasEnoughHeight;
  }

  public getContentMetrics(pageKey: string): { words: number; height: number } | null {
    return this.contentCache.get(pageKey) || null;
  }

  public shouldShowAd(pageKey: string): boolean {
    // Check if we have sufficient content
    const hasSufficientContent = this.checkContentSufficiency(pageKey);
    
    // Additional checks for AdSense compliance
    const hasValidAdSenseAccount = !!siteConfig.googleAdsenseAccount;
    const isNotBlocked = !this.isAdBlocked();
    
    return hasSufficientContent && hasValidAdSenseAccount && isNotBlocked;
  }

  private isAdBlocked(): boolean {
    // Check if ads are being blocked
    if (typeof window === 'undefined') return false;
    
    // Check for common ad blockers
    const adBlockIndicators = [
      'adsbygoogle',
      'googleadservices',
      'googlesyndication'
    ];

    return adBlockIndicators.some(indicator => {
      try {
        return !window[indicator as keyof Window];
      } catch {
        return true;
      }
    });
  }

  public getAdElement(slot: string, format: string): HTMLElement | null {
    if (typeof window === 'undefined') return null;

    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    adElement.setAttribute('data-ad-client', siteConfig.googleAdsenseAccount);
    adElement.setAttribute('data-ad-slot', slot);
    adElement.setAttribute('data-ad-format', format);
    adElement.setAttribute('data-full-width-responsive', 'true');

    return adElement;
  }

  public loadAd(container: HTMLElement, slot: string, format: string): boolean {
    try {
      const adElement = this.getAdElement(slot, format);
      if (!adElement) return false;

      container.innerHTML = '';
      container.appendChild(adElement);

      // Push to Google AdSense
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        return true;
      }
    } catch (error) {
      console.warn('Failed to load ad:', error);
    }
    return false;
  }

  public getFallbackContent(pageKey: string): string {
    const config = this.getAdConfig(pageKey);
    return config?.fallbackContent || 'Learn more about our tools and services';
  }

  // Analytics and reporting
  public reportAdPerformance(pageKey: string, success: boolean): void {
    // Track ad performance for optimization
    const metrics = this.getContentMetrics(pageKey);
    if (metrics) {
      console.log(`Ad performance for ${pageKey}:`, {
        success,
        contentWords: metrics.words,
        contentHeight: metrics.height,
        timestamp: new Date().toISOString()
      });
    }
  }
}

// Export singleton instance
export const adManager = AdManager.getInstance();

// Declare global adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
