"use client";

import React, { useState } from "react";
import PhotoGallery from "./PhotoGallery";
import ImageLightbox from "./ImageLightbox";
import { galleryImages } from "@/data/gallery";
import { GalleryImage } from "@/types/gallery";

const GalleryWrapper: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (image: GalleryImage, index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < galleryImages.length - 1 ? prev + 1 : prev
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <>
      <PhotoGallery images={galleryImages} onImageClick={handleImageClick} />

      <ImageLightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={handleCloseLightbox}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
    </>
  );
};

export default GalleryWrapper;
