# Required Assets for Wedding Website

This document lists the assets that need to be added to complete the hero section implementation.

## Hero Section Assets

### 1. Hero Poster Image

**File:** `hero-poster.jpg`
**Purpose:** Fallback image displayed while video loads or if video fails
**Specifications:**

- Format: JPG or WebP
- Dimensions: 1920x1080 (16:9 aspect ratio)
- Size: Under 500KB for optimal loading
- Content: Beautiful wedding scene, garden, or romantic background
- Style: Should match the rose/gold/sage color palette

### 2. Hero Video Files

**Files:** `hero-video.webm` and `hero-video.mp4`
**Purpose:** Background video for hero section
**Specifications:**

- Duration: 10-30 seconds (loops seamlessly)
- Dimensions: 1920x1080 minimum
- WebM format for modern browsers (better compression)
- MP4 format for fallback compatibility
- Size: Under 5MB total for both files
- Content: Romantic wedding scenes, nature, or abstract visuals
- Style: Subtle, non-distracting, matches color theme

## Recommended Sources

- **Unsplash.com:** Free high-quality images (search: "wedding", "garden wedding")
- **Pexels.com:** Free videos and images
- **Professional photography:** Custom wedding photos
- **Stock sites:** Shutterstock, Getty Images, etc.

## Asset Guidelines

- All assets should be optimized for web
- Consider multiple formats for better browser support
- Ensure content is appropriate and matches the Bulgarian wedding theme
- Test on various devices and connection speeds

## Implementation Notes

- Hero component will gracefully fallback to poster image if video fails
- Video has autoplay (muted) for better user experience
- Responsive design ensures assets work on all screen sizes
