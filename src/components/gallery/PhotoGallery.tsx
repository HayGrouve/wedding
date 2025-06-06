"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { PhotoGalleryProps, GALLERY_CATEGORIES } from "@/types/gallery";

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  loading = false,
  className = "",
  filterCategory = "all",
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (imageId: number) => {
    setLoadedImages((prev) => new Set([...prev, imageId]));
  };

  // Get category information for display
  const getCategoryInfo = (categoryId: string) => {
    return (
      GALLERY_CATEGORIES.find((cat) => cat.id === categoryId) ||
      GALLERY_CATEGORIES[1]
    ); // Default to 'venue'
  };

  // Filter images if needed
  const filteredImages =
    filterCategory === "all"
      ? images
      : images.filter((image) => image.category === filterCategory);

  if (loading) {
    return (
      <section
        id="gallery"
        className={`section-padding bg-gradient-to-br from-wedding-sage/5 via-background to-wedding-cream/10 scroll-offset relative overflow-hidden ${className}`}
        aria-label="Галерия със снимки"
      >
        <div className="container-wedding relative">
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="gallery"
      className={`section-padding bg-gradient-to-br from-wedding-sage/5 via-background to-wedding-cream/10 scroll-offset relative overflow-hidden ${className}`}
      aria-label="Галерия със снимки"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_30%_70%,_theme(colors.wedding.gold)_1px,_transparent_1px)] bg-[length:32px_32px]"
        aria-hidden="true"
      />

      <div className="container-wedding relative">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4"
            id="gallery-heading"
          >
            Галерия
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Моменти от нашата любовна история и красивите места, където ще
            празнуваме заедно.
          </p>
        </div>

        {/* Photo Grid */}
        <div
          className="gallery-grid"
          role="region"
          aria-labelledby="gallery-heading"
        >
          {filteredImages.map((image) => {
            const categoryInfo = getCategoryInfo(image.category);

            return (
              <Card
                key={image.id}
                className="gallery-item group overflow-hidden backdrop-blur-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* Next.js optimized image */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    title={image.title}
                    width={image.width}
                    height={image.height}
                    className={`object-cover w-full h-full transition-all duration-700 group-hover:scale-105 ${
                      loadedImages.has(image.id) ? "opacity-100" : "opacity-0"
                    }`}
                    priority={image.priority}
                    placeholder={image.blurDataURL ? "blur" : "empty"}
                    blurDataURL={image.blurDataURL}
                    sizes="(max-width: 767px) 100vw, 50vw"
                    onLoad={() => handleImageLoad(image.id)}
                    loading={image.priority ? "eager" : "lazy"}
                  />

                  {/* Loading placeholder */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-wedding-cream/20 to-wedding-sage/20 flex items-center justify-center transition-opacity duration-500 ${
                      loadedImages.has(image.id)
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
                    <div className="text-center space-y-3">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-muted-foreground font-medium">
                        Зареждане...
                      </span>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge
                      variant="secondary"
                      className="bg-wedding-rose/90 text-white backdrop-blur-sm hover:bg-wedding-rose border-0 font-medium"
                    >
                      {categoryInfo.nameBg}
                    </Badge>
                  </div>

                  {/* Image info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-serif font-medium text-lg mb-1">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-white/90 text-sm line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty state for when no images */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-wedding-cream/30 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-wedding-rose/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-medium text-foreground mb-2">
              {filterCategory === "all"
                ? "Галерията се подготвя"
                : `Няма снимки в категория "${getCategoryInfo(filterCategory).nameBg}"`}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {filterCategory === "all"
                ? "Скоро ще добавим красиви снимки от нашата любовна история и местата за празненството."
                : "Скоро ще добавим снимки в тази категория."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(PhotoGallery);
