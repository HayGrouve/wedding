import { getPlaiceholder } from "plaiceholder";

/**
 * Image optimization utilities for the wedding website
 *
 * Features:
 * - Blur placeholder generation using plaiceholder
 * - Loading state management
 * - Error handling for failed image loads
 * - Performance monitoring utilities
 * - Progressive image enhancement
 */

export interface ImageOptimizationConfig {
  quality?: number;
  format?: "webp" | "avif" | "jpeg" | "png";
  blur?: boolean;
  sizes?: string;
  priority?: boolean;
}

export interface OptimizedImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  placeholder?: "blur" | "empty";
}

/**
 * Generate blur placeholder for an image
 * @param src - Image source URL or path
 * @returns Promise with blur data URL
 */
export async function generateBlurPlaceholder(src: string): Promise<string> {
  try {
    // For remote images, fetch and process
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));
    return base64;
  } catch (error) {
    console.warn("Failed to generate blur placeholder:", error);
    // Return a default blur placeholder
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
  }
}

/**
 * Optimize image data with blur placeholder
 * @param imageData - Basic image data
 * @param config - Optimization configuration
 * @returns Promise with optimized image data
 */
export async function optimizeImageData(
  imageData: Omit<OptimizedImageData, "blurDataURL" | "placeholder">,
  config: ImageOptimizationConfig = {}
): Promise<OptimizedImageData> {
  const optimized: OptimizedImageData = {
    ...imageData,
    placeholder: config.blur !== false ? "blur" : "empty",
  };

  if (config.blur !== false) {
    try {
      optimized.blurDataURL = await generateBlurPlaceholder(imageData.src);
    } catch (error) {
      console.warn("Failed to optimize image:", error);
      optimized.placeholder = "empty";
    }
  }

  return optimized;
}

/**
 * Generate responsive image sizes string
 * @param breakpoints - Array of breakpoint configurations
 * @returns Sizes string for Next.js Image component
 */
export function generateResponsiveSizes(
  breakpoints: Array<{ maxWidth: number; imageWidth: string }>
): string {
  const sizeQueries = breakpoints.map(
    ({ maxWidth, imageWidth }) => `(max-width: ${maxWidth}px) ${imageWidth}`
  );

  // Add default size for larger screens
  const defaultSize =
    breakpoints[breakpoints.length - 1]?.imageWidth || "100vw";

  return [...sizeQueries, defaultSize].join(", ");
}

/**
 * Default responsive sizes for timeline images
 */
export const TIMELINE_IMAGE_SIZES = generateResponsiveSizes([
  { maxWidth: 640, imageWidth: "100vw" },
  { maxWidth: 768, imageWidth: "50vw" },
  { maxWidth: 1024, imageWidth: "400px" },
]);

/**
 * Image loading state management
 */
export class ImageLoadingManager {
  private loadingStates = new Map<string, boolean>();
  private errorStates = new Map<string, boolean>();
  private loadStartTimes = new Map<string, number>();

  /**
   * Mark image as loading
   */
  startLoading(src: string): void {
    this.loadingStates.set(src, true);
    this.errorStates.set(src, false);
    this.loadStartTimes.set(src, Date.now());
  }

  /**
   * Mark image as loaded successfully
   */
  finishLoading(src: string): void {
    this.loadingStates.set(src, false);
    this.errorStates.set(src, false);

    // Log performance metrics
    const startTime = this.loadStartTimes.get(src);
    if (startTime) {
      const loadTime = Date.now() - startTime;
      console.debug(`Image loaded in ${loadTime}ms:`, src);
      this.loadStartTimes.delete(src);
    }
  }

  /**
   * Mark image as failed to load
   */
  markError(src: string): void {
    this.loadingStates.set(src, false);
    this.errorStates.set(src, true);
    this.loadStartTimes.delete(src);
  }

  /**
   * Check if image is currently loading
   */
  isLoading(src: string): boolean {
    return this.loadingStates.get(src) || false;
  }

  /**
   * Check if image failed to load
   */
  hasError(src: string): boolean {
    return this.errorStates.get(src) || false;
  }

  /**
   * Clear state for an image
   */
  clearState(src: string): void {
    this.loadingStates.delete(src);
    this.errorStates.delete(src);
    this.loadStartTimes.delete(src);
  }

  /**
   * Get loading statistics
   */
  getStats(): {
    totalImages: number;
    loadingImages: number;
    errorImages: number;
  } {
    const totalImages = this.loadingStates.size;
    const loadingImages = Array.from(this.loadingStates.values()).filter(
      Boolean
    ).length;
    const errorImages = Array.from(this.errorStates.values()).filter(
      Boolean
    ).length;

    return { totalImages, loadingImages, errorImages };
  }
}

/**
 * Global image loading manager instance
 */
export const imageLoadingManager = new ImageLoadingManager();

/**
 * Performance monitoring utilities
 */
export class ImagePerformanceMonitor {
  private metrics = new Map<
    string,
    {
      loadTime: number;
      size: number;
      format: string;
      timestamp: number;
    }
  >();

  /**
   * Record image load performance
   */
  recordLoad(
    src: string,
    loadTime: number,
    size?: number,
    format?: string
  ): void {
    this.metrics.set(src, {
      loadTime,
      size: size || 0,
      format: format || "unknown",
      timestamp: Date.now(),
    });
  }

  /**
   * Get performance statistics
   */
  getStats(): {
    averageLoadTime: number;
    totalImages: number;
    totalSize: number;
    formatBreakdown: Record<string, number>;
  } {
    const metrics = Array.from(this.metrics.values());

    if (metrics.length === 0) {
      return {
        averageLoadTime: 0,
        totalImages: 0,
        totalSize: 0,
        formatBreakdown: {},
      };
    }

    const averageLoadTime =
      metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
    const totalSize = metrics.reduce((sum, m) => sum + m.size, 0);

    const formatBreakdown = metrics.reduce(
      (acc, m) => {
        acc[m.format] = (acc[m.format] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      averageLoadTime,
      totalImages: metrics.length,
      totalSize,
      formatBreakdown,
    };
  }

  /**
   * Clear old metrics (older than 1 hour)
   */
  cleanup(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    for (const [src, metric] of this.metrics.entries()) {
      if (metric.timestamp < oneHourAgo) {
        this.metrics.delete(src);
      }
    }
  }
}

/**
 * Global performance monitor instance
 */
export const imagePerformanceMonitor = new ImagePerformanceMonitor();

/**
 * Error handling utilities
 */
export function getImageErrorFallback(): string {
  // Return a wedding-themed placeholder SVG with URL encoding for Cyrillic support
  const svgContent = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f5f0"/>
      <g transform="translate(200,150)">
        <circle cx="0" cy="-20" r="15" fill="#d4a574" opacity="0.6"/>
        <path d="M-20,-5 Q0,-25 20,-5 Q0,15 -20,-5" fill="#c4a484" opacity="0.8"/>
        <text x="0" y="40" text-anchor="middle" font-family="serif" font-size="14" fill="#8b7355">
          Снимка не е налична
        </text>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}

/**
 * Preload critical images
 * @param imageSrcs - Array of image sources to preload
 */
export function preloadImages(imageSrcs: string[]): Promise<void[]> {
  return Promise.all(
    imageSrcs.map((src) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error(`Failed to preload image: ${src}`));
        img.src = src;
      });
    })
  );
}

/**
 * Check if WebP is supported
 */
export function isWebPSupported(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  });
}

/**
 * Check if AVIF is supported
 */
export function isAVIFSupported(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=";
  });
}
