import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Image optimization configuration
    formats: ["image/webp", "image/avif"],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Enable image optimization
    unoptimized: false,

    // Remote patterns for external images (if needed)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],

    // Minimize external data usage
    minimumCacheTTL: 31536000, // 1 year

    // Disable static imports for better control
    disableStaticImages: false,

    // Dangerous allow SVG (only for controlled content)
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["@/components", "@/lib", "@/utils"],
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Output configuration for static export if needed
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  // Performance optimizations
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
