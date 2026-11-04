import { useState, useEffect, ImgHTMLAttributes } from "react";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  webp?: string;
  avif?: string;
  srcSet?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Optimised Image Component with WebP/AVIF support and lazy loading
 * 
 * Features:
 * - Automatic WebP/AVIF fallback support
 * - Lazy loading for below-fold images
 * - Responsive images with srcSet
 * - Priority loading for above-fold images
 * - Automatic width/height to prevent layout shift
 * 
 * @example
 * // Basic usage
 * <OptimizedImage src="/image.jpg" alt="Description" />
 * 
 * // With modern formats
 * <OptimizedImage 
 *   src="/image.jpg" 
 *   webp="/image.webp" 
 *   avif="/image.avif"
 *   alt="Description" 
 * />
 * 
 * // With responsive images
 * <OptimizedImage 
 *   src="/image-800w.jpg"
 *   srcSet="/image-400w.jpg 400w, /image-800w.jpg 800w, /image-1200w.jpg 1200w"
 *   sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
 *   alt="Description" 
 * />
 * 
 * // Priority (above-fold)
 * <OptimizedImage src="/hero.jpg" alt="Hero" priority />
 */
export function OptimizedImage({
  src,
  alt,
  webp,
  avif,
  srcSet,
  sizes,
  priority = false,
  className = "",
  width,
  height,
  loading: loadingProp,
  decoding = "async",
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Determine loading strategy
  const loading = loadingProp || (priority ? "eager" : "lazy");
  
  // Determine if we should use modern formats
  const hasModernFormats = webp || avif;

  useEffect(() => {
    // Preload priority images
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = avif || webp || src;
      if (srcSet) link.setAttribute('imagesrcset', srcSet);
      if (sizes) link.setAttribute('imagesizes', sizes);
      document.head.appendChild(link);
    }
  }, [priority, src, webp, avif, srcSet, sizes]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // Fallback to original src if modern format fails
    if (currentSrc !== src) {
      setCurrentSrc(src);
    }
  };

  // Use picture element for modern format support
  if (hasModernFormats) {
    return (
      <picture className={className}>
        {avif && (
          <source
            type="image/avif"
            srcSet={avif}
            sizes={sizes}
          />
        )}
        {webp && (
          <source
            type="image/webp"
            srcSet={webp}
            sizes={sizes}
          />
        )}
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding={decoding}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          {...props}
        />
      </picture>
    );
  }

  // Standard img element
  return (
    <img
      src={currentSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
      {...props}
    />
  );
}
