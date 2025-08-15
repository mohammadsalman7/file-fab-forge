// Site configuration for easy environment switching
export const siteConfig = {
  // Base URL - change this based on environment
  baseUrl: import.meta.env.PROD 
    ? 'https://imagedocpro.com' 
    : window.location.origin,
  
  // Site metadata
  name: 'ImageDocPro',
  description: 'Free online background remover, image upscaler, and file converter. Remove background from images online free with AI precision.',
  
  // Social media
  twitter: '@imagedocpro',
  
  // Google AdSense
  googleAdsenseAccount: 'ca-pub-5022395460457488',
  
  // Default image
  defaultImage: '/uploads/logo2.jpg',
  
  // Get full URL for a path
  getUrl: (path: string = '') => {
    const base = siteConfig.baseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
  },
  
  // Get relative URL (for local development)
  getRelativeUrl: (path: string = '') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return cleanPath;
  }
};

// Helper function to get the appropriate URL based on environment
export const getSiteUrl = (path: string = '') => {
  return import.meta.env.PROD ? siteConfig.getUrl(path) : siteConfig.getRelativeUrl(path);
};
