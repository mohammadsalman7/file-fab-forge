import React, { useEffect, useState, useRef } from 'react';
import { siteConfig } from '@/config/site';

interface SmartAdProps {
  adSlot: string;
  adFormat: 'auto' | 'rectangle' | 'banner' | 'sidebar';
  className?: string;
  fallbackContent?: React.ReactNode;
  minContentHeight?: number; // Minimum content height required to show ads
}

export const SmartAd: React.FC<SmartAdProps> = ({
  adSlot,
  adFormat,
  className = '',
  fallbackContent,
  minContentHeight = 800
}) => {
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if there's sufficient content on the page
    const checkContentSufficiency = () => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const contentHeight = mainContent.scrollHeight;
        const hasSubstantialContent = contentHeight >= minContentHeight;
        
        // Also check for text content
        const textContent = mainContent.textContent || '';
        const wordCount = textContent.trim().split(/\s+/).length;
        const hasEnoughText = wordCount >= 300; // At least 300 words
        
        setShouldShowAd(hasSubstantialContent && hasEnoughText);
      }
    };

    // Check after a short delay to allow content to load
    const timer = setTimeout(checkContentSufficiency, 1000);
    
    // Also check when window resizes
    window.addEventListener('resize', checkContentSufficiency);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkContentSufficiency);
    };
  }, [minContentHeight]);

  useEffect(() => {
    if (!shouldShowAd || adLoaded) return;

    // Only load ads if we have sufficient content
    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        try {
          // Create ad element
          const adElement = document.createElement('ins');
          adElement.className = 'adsbygoogle';
          adElement.style.display = 'block';
          adElement.setAttribute('data-ad-client', siteConfig.googleAdsenseAccount);
          adElement.setAttribute('data-ad-slot', adSlot);
          adElement.setAttribute('data-ad-format', adFormat);
          adElement.setAttribute('data-full-width-responsive', 'true');
          
          if (adRef.current) {
            adRef.current.innerHTML = '';
            adRef.current.appendChild(adElement);
            
            // Push the ad to Google AdSense
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdLoaded(true);
          }
        } catch (error) {
          console.warn('Failed to load ad:', error);
          setAdLoaded(false);
        }
      }
    };

    // Load ad after a short delay
    const adTimer = setTimeout(loadAd, 500);
    
    return () => clearTimeout(adTimer);
  }, [shouldShowAd, adSlot, adFormat, adLoaded]);

  // Don't render anything if we shouldn't show ads
  if (!shouldShowAd) {
    return fallbackContent ? (
      <div className={className}>
        {fallbackContent}
      </div>
    ) : null;
  }

  return (
    <div ref={containerRef} className={`ad-container ${className}`}>
      <div 
        ref={adRef} 
        className="ad-placeholder"
        style={{
          minHeight: adFormat === 'rectangle' ? '250px' : 
                     adFormat === 'banner' ? '90px' : '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.05)',
          border: '1px dashed rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        {!adLoaded && (
          <div className="text-center text-muted-foreground">
            <div className="text-sm">Loading advertisement...</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Declare global adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
