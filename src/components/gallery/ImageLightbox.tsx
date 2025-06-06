"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GalleryImage, GALLERY_CATEGORIES } from "@/types/gallery";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  MapPin,
  Calendar,
  Camera,
} from "lucide-react";

interface ImageLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}) => {
  const currentImage = images[currentIndex];

  // Swipe gesture support for mobile
  const swipeRef = useSwipeGesture({
    onSwipeLeft: () => {
      if (currentIndex < images.length - 1) onNext();
    },
    onSwipeRight: () => {
      if (currentIndex > 0) onPrevious();
    },
    minSwipeDistance: 50,
    preventScrollOnSwipe: false,
  });

  // Get category information
  const getCategoryInfo = (categoryId: string) => {
    return (
      GALLERY_CATEGORIES.find((cat) => cat.id === categoryId) ||
      GALLERY_CATEGORIES[1]
    );
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          onPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, onPrevious, onNext, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open and manage focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Announce to screen readers that lightbox opened
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = `Отворена е галерия със снимки. Снимка ${currentIndex + 1} от ${images.length}. ${currentImage?.title || ""}`;
      document.body.appendChild(announcement);

      // Clean up announcement after screen reader has time to read it
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 1000);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentIndex, images.length, currentImage?.title]);

  if (!currentImage) return null;

  const categoryInfo = getCategoryInfo(currentImage.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-7xl max-h-[95vh] p-0 gap-0 bg-black/95 border-wedding-rose/20 backdrop-blur-md"
        aria-describedby="lightbox-description"
      >
        {/* Header with close button and image info */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 pb-2 bg-gradient-to-b from-black/80 to-transparent relative z-10">
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-wedding-rose/90 text-white border-0 font-medium"
            >
              {categoryInfo.nameBg}
            </Badge>
            <DialogTitle className="text-white font-serif text-lg md:text-xl">
              {currentImage.title}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm hidden sm:block">
              {currentIndex + 1} от {images.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10 hover:text-white"
              aria-label="Затвори галерията"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Main image container */}
        <div
          ref={swipeRef}
          className="relative flex-1 flex items-center justify-center min-h-[400px] md:min-h-[600px]"
        >
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="absolute left-4 z-20 bg-black/50 text-white hover:bg-black/70 hover:text-white disabled:opacity-30 h-12 w-12 rounded-full"
            aria-label="Предишна снимка"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 z-20 bg-black/50 text-white hover:bg-black/70 hover:text-white disabled:opacity-30 h-12 w-12 rounded-full"
            aria-label="Следваща снимка"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Main image */}
          <div className="relative w-full h-full max-w-6xl max-h-[70vh] mx-4">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              title={currentImage.title}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 95vw, 90vw"
              placeholder={currentImage.blurDataURL ? "blur" : "empty"}
              blurDataURL={currentImage.blurDataURL}
            />
          </div>
        </div>

        {/* Footer with image details and actions */}
        <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <div className="p-4">
              {/* Image description */}
              {currentImage.description && (
                <p
                  id="lightbox-description"
                  className="text-white/90 text-sm md:text-base mb-4 leading-relaxed"
                >
                  {currentImage.description}
                </p>
              )}

              {/* Image metadata */}
              <div className="flex flex-wrap gap-4 text-xs md:text-sm text-white/70 mb-4">
                {currentImage.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{currentImage.location}</span>
                  </div>
                )}

                {currentImage.dateTaken && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(currentImage.dateTaken).toLocaleDateString(
                        "bg-BG"
                      )}
                    </span>
                  </div>
                )}

                {currentImage.photographer && (
                  <div className="flex items-center gap-1">
                    <Camera className="h-4 w-4" />
                    <span>{currentImage.photographer}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30 border-white/30"
                    onClick={() => {
                      // Download functionality - for SVG files we'll just open in new tab
                      window.open(currentImage.src, "_blank");
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Изтегли
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30 border-white/30"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: currentImage.title,
                          text: currentImage.description,
                          url: window.location.href,
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Сподели
                  </Button>
                </div>

                {/* Thumbnail navigation */}
                <div className="hidden md:flex gap-1 max-w-xs overflow-x-auto">
                  {images
                    .slice(Math.max(0, currentIndex - 2), currentIndex + 3)
                    .map((image, idx) => {
                      const actualIndex = Math.max(0, currentIndex - 2) + idx;
                      return (
                        <button
                          key={image.id}
                          onClick={() => {
                            const diff = actualIndex - currentIndex;
                            if (diff > 0) {
                              for (let i = 0; i < diff; i++) onNext();
                            } else if (diff < 0) {
                              for (let i = 0; i < Math.abs(diff); i++)
                                onPrevious();
                            }
                          }}
                          className={`relative w-12 h-12 rounded overflow-hidden transition-all duration-200 ${
                            actualIndex === currentIndex
                              ? "ring-2 ring-wedding-rose scale-110"
                              : "opacity-60 hover:opacity-100"
                          }`}
                          aria-label={`Отиди към снимка ${actualIndex + 1}`}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
