import React, { useRef } from 'react';
import { useImageLoader, useIntersectionObserver } from '@/hooks/use-image-loader';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholder?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback,
  placeholder,
  className,
  loading = 'lazy',
  ...props
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const isIntersecting = useIntersectionObserver(imageRef, { threshold: 0.1 });
  
  const { imageSrc, isLoading, error } = useImageLoader({
    src: isIntersecting ? src : '',
    fallback,
  });

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && placeholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {error && fallback && (
        <img
          ref={imageRef}
          src={fallback}
          alt={alt}
          className={cn('w-full h-full object-cover', className)}
          loading={loading}
          {...props}
        />
      )}
      
      {!error && (
        <img
          ref={imageRef}
          src={imageSrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          loading={loading}
          {...props}
        />
      )}
    </div>
  );
};

