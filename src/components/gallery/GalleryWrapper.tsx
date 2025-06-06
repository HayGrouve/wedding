"use client";

import React from "react";
import PhotoGallery from "./PhotoGallery";
import { galleryImages } from "@/data/gallery";

const GalleryWrapper: React.FC = () => {
  return <PhotoGallery images={galleryImages} />;
};

export default GalleryWrapper;
