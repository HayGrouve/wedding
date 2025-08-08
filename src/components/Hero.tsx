"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  onScrollToDetails?: () => void;
}

function getHeaderHeight(): number {
  const el = document.querySelector<HTMLElement>('header[role="banner"]');
  return el?.offsetHeight ?? 80;
}

export default function Hero({
  brideName = "Анна-Мария",
  groomName = "Георги",
  onScrollToDetails,
}: HeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleScrollToDetails = useCallback(() => {
    if (onScrollToDetails) {
      onScrollToDetails();
    } else {
      const detailsSection = document.getElementById("details");
      if (detailsSection) {
        const headerHeight = getHeaderHeight();
        const extra = 18;
        const elementTop = detailsSection.getBoundingClientRect().top + window.pageYOffset;
        const offset = Math.max(0, elementTop - headerHeight + extra);
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }
  }, [onScrollToDetails]);

  return (
    <section
      className="hero-section relative w-full h-screen min-h-[70vh] md:min-h-[80vh] lg:h-screen overflow-hidden"
      role="banner"
      aria-label="Hero section with wedding announcement"
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        {/* YouTube Video Embed - Using nocookie domain and optimized parameters */}
        <iframe
          src="https://www.youtube-nocookie.com/embed/_pkBDiVYarw?autoplay=1&mute=1&loop=1&playlist=_pkBDiVYarw&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&color=white&origin=https://localhost:3000&enablejsapi=0&widget_referrer=https://localhost:3000"
          className="w-full h-full object-cover"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={() => setVideoLoaded(true)}
          onError={() => {
            console.log("YouTube video failed to load, showing fallback image");
            setVideoLoaded(true);
          }}
          title="Wedding background video"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '120vw', /* Slightly larger to ensure full coverage */
            height: '120vh', /* Slightly larger to ensure full coverage */
            transform: 'translate(-50%, -50%)',
            zIndex: -1,
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />

        {/* Enhanced overlay for better text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"
          aria-hidden="true"
        />
        {/* Additional decorative overlay */}
        <div
          className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/30"
          aria-hidden="true"
        />
        {/* Video loading indicator */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-white text-lg">Зареждане на видеото...</div>
          </div>
        )}
      </div>

      {/* Content Overlay Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">

        {/* Main Heading - Bride & Groom Names */}
        <h1 className="hero-title mb-4 lg:mb-6" role="heading" aria-level={1}>
          <span
            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-2xl shadow-black/50"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            {brideName}
          </span>
          <span
            className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white/90 my-2 lg:my-4 drop-shadow-xl"
            aria-hidden="true"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
          >
            &
          </span>
          <span
            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-2xl shadow-black/50 mt-[-25px]"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            {groomName}
          </span>
        </h1>

        {/* Wedding Subtitle */}
        <p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-2 lg:mb-4 font-light tracking-wide drop-shadow-lg"
          style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.8)" }}
        >
          Ви канят на сватба
        </p>

        {/* Professional Call to Action Button */}
        <Button
          onClick={handleScrollToDetails}
          size="lg"
          className="bg-white text-black font-semibold px-8 py-4 mt-2 text-base md:text-lg lg:text-xl focus:outline-none transition-all duration-200 ease-in-out border border-gray-300 rounded-md hover:shadow-md focus:shadow-md hover:bg-gray-100/80 focus:bg-gray-100/80"
          aria-label="Scroll to wedding details section"
          style={{
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Детайли
        </Button>
      </div>
    </section>
  );
}
