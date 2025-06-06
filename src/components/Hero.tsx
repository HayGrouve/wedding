"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown } from "lucide-react";

interface HeroProps {
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  onScrollToDetails?: () => void;
}

export default function Hero({
  brideName = "Ана-Мария",
  groomName = "Иван",
  weddingDate = "15 юни 2024",
  onScrollToDetails,
}: HeroProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);

  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Intersection Observer for lazy loading and performance monitoring
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Delay video loading slightly to ensure smooth page load
            const loadTimer = setTimeout(() => {
              setShouldLoadVideo(true);
            }, 300);

            return () => clearTimeout(loadTimer);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: "50px", // Start loading 50px before the section comes into view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      intersectionObserverRef.current = observer;
    }

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, []);

  // Video event handlers with performance monitoring
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const startTime = performance.now();

    const handleLoadStart = () => {
      setLoadingProgress(0);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          setLoadingProgress((bufferedEnd / duration) * 100);
        }
      }
    };

    const handleLoadedData = () => {
      const loadTime = performance.now() - startTime;
      setIsVideoLoaded(true);
      setLoadingProgress(100);

      // Log performance metrics (could be sent to analytics)
      console.log(`Video loaded in ${loadTime.toFixed(2)}ms`);
    };

    const handleCanPlayThrough = () => {
      // Video can play through without buffering
      if (!prefersReducedMotion) {
        video.play().catch((error) => {
          console.warn("Video autoplay failed:", error);
          setIsVideoError(true);
        });
      }
    };

    const handleError = (error: Event) => {
      console.error("Video loading error:", error);
      setIsVideoError(true);
      setIsVideoLoaded(false);
    };

    const handleStalled = () => {
      console.warn("Video loading stalled - network may be slow");
    };

    // Add event listeners
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("error", handleError);
    video.addEventListener("stalled", handleStalled);

    // Preload video metadata
    video.load();

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("error", handleError);
      video.removeEventListener("stalled", handleStalled);
    };
  }, [shouldLoadVideo, prefersReducedMotion]);

  const handleScrollToDetails = useCallback(() => {
    if (onScrollToDetails) {
      onScrollToDetails();
    } else {
      // Fallback smooth scroll to details section
      const detailsSection = document.getElementById("wedding-details");
      if (detailsSection) {
        detailsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [onScrollToDetails]);

  // Handle user interaction to trigger video play (for mobile/autoplay restrictions)
  const handleUserInteraction = useCallback(() => {
    const video = videoRef.current;
    if (
      video &&
      !isVideoError &&
      isVideoLoaded &&
      video.paused &&
      !prefersReducedMotion
    ) {
      video.play().catch((error) => {
        console.warn("Manual video play failed:", error);
      });
    }
  }, [isVideoError, isVideoLoaded, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative w-full h-screen min-h-[70vh] md:min-h-[80vh] lg:h-screen overflow-hidden"
      onClick={handleUserInteraction}
      role="banner"
      aria-label="Hero section with wedding announcement"
    >
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Poster/Fallback Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 bg-center bg-cover transition-opacity duration-1000 ${
            isVideoLoaded && !isVideoError ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `linear-gradient(135deg, hsl(var(--primary)/0.3), hsl(var(--secondary)/0.2), hsl(var(--accent)/0.3))`,
          }}
          aria-hidden="true"
        />

        {/* Video Loading Progress Indicator */}
        {shouldLoadVideo && !isVideoLoaded && !isVideoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-5">
            <div className="bg-white/90 rounded-full p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Зареждане {Math.round(loadingProgress)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Video Element - Only render when needed */}
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded && !isVideoError ? "opacity-100" : "opacity-0"
            }`}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            aria-label="Background video of wedding scene"
          >
            <source src="/hero-video.webm" type="video/webm" />
            <source src="/hero-video.mp4" type="video/mp4" />
            Вашият браузър не поддържа видео.
          </video>
        )}

        {/* Overlay gradient for better text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"
          aria-hidden="true"
        />
      </div>

      {/* Content Overlay Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        {/* Heart Icon */}
        <div className="mb-6 lg:mb-8">
          <Heart
            className={`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white/90 ${
              prefersReducedMotion ? "" : "animate-pulse"
            }`}
            aria-hidden="true"
          />
        </div>

        {/* Main Heading - Bride & Groom Names */}
        <h1 className="hero-title mb-4 lg:mb-6" role="heading" aria-level={1}>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-lg">
            {brideName}
          </span>
          <span
            className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white/90 my-2 lg:my-4"
            aria-hidden="true"
          >
            &
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-lg">
            {groomName}
          </span>
        </h1>

        {/* Wedding Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-2 lg:mb-4 font-light tracking-wide">
          Ви канят на тяхната сватба
        </p>

        {/* Wedding Date */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 lg:mb-12 font-light">
          <time dateTime="2024-06-15">{weddingDate}</time>
        </p>

        {/* Call to Action Button */}
        <Button
          onClick={handleScrollToDetails}
          size="lg"
          className="hero-cta-button bg-white/90 hover:bg-white text-primary hover:text-primary/90 font-semibold px-8 py-4 text-base md:text-lg lg:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Scroll to wedding details section"
        >
          Детайли за сватбата
          <ChevronDown
            className={`ml-2 w-5 h-5 ${prefersReducedMotion ? "" : "animate-bounce"}`}
          />
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <div className={prefersReducedMotion ? "" : "animate-bounce"}>
          <ChevronDown className="w-6 h-6 text-white/70" />
        </div>
      </div>
    </section>
  );
}
