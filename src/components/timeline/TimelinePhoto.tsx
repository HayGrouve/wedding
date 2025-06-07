"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TimelinePhoto as TimelinePhotoType } from "@/types/timeline";
// Client-side image optimization utilities
const TIMELINE_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px";

const getImageErrorFallback = (): string => {
  // Use URL encoding instead of base64 to handle Cyrillic characters
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
};

interface TimelinePhotoProps {
  photo: TimelinePhotoType;
  className?: string;
  priority?: boolean;
  showCaption?: boolean;
  size?: "small" | "medium" | "large";
  hoverEffect?: boolean;
}

/**
 * TimelinePhoto - Optimized photo component for timeline milestones
 *
 * Features:
 * - Next.js Image optimization with WebP support and JPEG fallback
 * - Lazy loading with blur placeholder for progressive enhancement
 * - Responsive sizing with 4:3 aspect ratio (400x300px base)
 * - Configurable hover effects with CSS transforms
 * - Accessible image captions and alt text
 * - Multiple size variants for different contexts
 */
export default function TimelinePhoto({
  photo,
  className = "",
  priority = false,
  showCaption = true,
  size = "medium",
  hoverEffect = true,
}: TimelinePhotoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);

  // Size configurations
  const sizeConfig = {
    small: {
      width: 300,
      height: 225,
      maxWidth: "300px",
    },
    medium: {
      width: 400,
      height: 300,
      maxWidth: "400px",
    },
    large: {
      width: 500,
      height: 375,
      maxWidth: "500px",
    },
  };

  const config = sizeConfig[size];

  // Image loading handlers
  const handleLoadStart = () => {
    const startTime = Date.now();
    setLoadStartTime(startTime);
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadComplete = () => {
    setIsLoading(false);

    if (loadStartTime) {
      const loadTime = Date.now() - loadStartTime;
      console.debug(`Image loaded in ${loadTime}ms:`, photo.src);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.warn("Failed to load image:", photo.src);
  };

  return (
    <div className={`timeline-photo ${className}`}>
      <div className="photo-container">
        <div className="image-wrapper">
          {hasError ? (
            <div className="error-placeholder">
              <img
                src={getImageErrorFallback()}
                alt={photo.alt}
                className="error-image"
              />
            </div>
          ) : (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={config.width}
              height={config.height}
              className="optimized-image"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes={TIMELINE_IMAGE_SIZES}
              quality={85}
              onLoadingComplete={handleLoadComplete}
              onError={handleError}
              onLoadStart={handleLoadStart}
            />
          )}

          {/* Loading indicator */}
          {isLoading && !hasError && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>

        {/* Caption */}
        {showCaption && photo.caption && (
          <div className="photo-caption">
            <span className="caption-text">{photo.caption}</span>
          </div>
        )}
      </div>

      {/* Component Styles */}
      <style jsx>{`
        .timeline-photo {
          position: relative;
          width: 100%;
          max-width: ${config.maxWidth};
        }

        .photo-container {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            rgb(var(--wedding-cream) / 0.1),
            rgb(var(--wedding-sage) / 0.05)
          );
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.08);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        ${hoverEffect
          ? `
        .photo-container:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.15),
            0 2px 6px rgba(0, 0, 0, 0.1);
        }
        `
          : ""}

        .image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }

        .optimized-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .error-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgb(var(--wedding-cream) / 0.5);
        }

        .error-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(2px);
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgb(var(--wedding-sage) / 0.3);
          border-top: 3px solid rgb(var(--wedding-sage));
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        ${hoverEffect
          ? `
        .photo-container:hover .optimized-image {
          transform: scale(1.05);
        }
        `
          : ""}

        .photo-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.6) 30%,
            transparent 100%
          );
          padding: 1.5rem 1rem 1rem;
          color: white;
          opacity: 0;
          transform: translateY(10px);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .photo-container:hover .photo-caption {
          opacity: 1;
          transform: translateY(0);
        }

        .caption-text {
          font-size: 0.875rem;
          font-weight: 500;
          text-align: center;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          line-height: 1.4;
          display: block;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .timeline-photo {
            max-width: 100%;
          }

          .photo-container {
            border-radius: 8px;
          }

          ${hoverEffect
            ? `
          .photo-container:hover {
            transform: none;
          }

          .photo-container:hover .optimized-image {
            transform: none;
          }
          `
            : ""}

          .photo-caption {
            position: static;
            background: rgb(var(--wedding-sage) / 0.1);
            color: rgb(var(--wedding-sage));
            opacity: 1;
            transform: none;
            padding: 0.75rem;
            border-radius: 0 0 8px 8px;
            margin-top: -4px;
          }

          .caption-text {
            color: rgb(var(--wedding-sage));
            text-shadow: none;
            font-size: 0.8rem;
          }
        }

        /* High-DPI display optimizations */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .optimized-image {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }

        /* Reduced motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .photo-container,
          .optimized-image,
          .photo-caption {
            transition: none;
          }

          .photo-container:hover {
            transform: none;
          }

          .photo-container:hover .optimized-image {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
