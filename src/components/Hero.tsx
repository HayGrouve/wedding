"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  onScrollToDetails?: () => void;
}

export default function Hero({
  brideName = "Ана-Мария",
  groomName = "Георги",
  weddingDate = "15 юни 2024",
  onScrollToDetails,
}: HeroProps) {
  const handleScrollToDetails = useCallback(() => {
    if (onScrollToDetails) {
      onScrollToDetails();
    } else {
      // Fallback smooth scroll to details section
      const detailsSection = document.getElementById("details");
      if (detailsSection) {
        detailsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [onScrollToDetails]);

  return (
    <section
      className="hero-section relative w-full h-screen min-h-[70vh] md:min-h-[80vh] lg:h-screen overflow-hidden"
      role="banner"
      aria-label="Hero section with wedding announcement"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-placeholder.webp"
          alt="Wedding background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
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
            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-2xl shadow-black/50"
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
          Ви канят на тяхната сватба
        </p>

        {/* Wedding Date */}
        <p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 lg:mb-12 font-light drop-shadow-lg"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}
        >
          <time dateTime="2024-06-15">{weddingDate}</time>
        </p>

        {/* Professional Call to Action Button */}
        <Button
          onClick={handleScrollToDetails}
          size="lg"
                      className="hero-cta-button bg-white/95 hover:bg-white text-primary hover:text-primary/80 font-semibold px-8 py-4 text-base md:text-lg lg:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent border border-white/30 hover:border-white/50 backdrop-blur-sm"
          aria-label="Scroll to wedding details section"
          style={{
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <span className="flex items-center">
            Детайли за сватбата
            <ChevronDown className="ml-2 w-5 h-5 animate-bounce transition-transform duration-200 hover:translate-y-0.5" />
          </span>
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <div className="animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/70" />
        </div>
      </div>
    </section>
  );
}
