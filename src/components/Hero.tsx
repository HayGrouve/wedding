"use client";

import { useCallback, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface HeroProps {
  weddingDate?: string;
  onScrollToDetails?: () => void;
}

function getHeaderHeight(): number {
  const el = document.querySelector<HTMLElement>('header[role="banner"]');
  return el?.offsetHeight ?? 80;
}

export default function Hero({
  weddingDate = "13.12.2025",
  onScrollToDetails,
}: HeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleScrollToDetails = useCallback(() => {
    if (onScrollToDetails) {
      onScrollToDetails();
    } else {
      const detailsSection = document.getElementById("details");
      if (detailsSection) {
        const extra = 18;
        const elementTop = detailsSection.getBoundingClientRect().top + window.pageYOffset;
        const offset = Math.max(0, elementTop - getHeaderHeight() + extra);
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }
  }, [onScrollToDetails]);

  // Send a command to the YouTube iframe without reloading the video
  const postToYouTubePlayer = (funcName: string, args: unknown[] = []) => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (!iframeWindow) return;
    const message = JSON.stringify({ event: "command", func: funcName, args });
    // Use wildcard targetOrigin for compatibility; YouTube validates origin internally
    iframeWindow.postMessage(message, "*");
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      // Use YouTube IFrame API command so playback is not restarted
      postToYouTubePlayer(nextMuted ? "mute" : "unMute");
      return nextMuted;
    });
  };

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
          ref={iframeRef}
          src="https://www.youtube-nocookie.com/embed/_pkBDiVYarw?autoplay=1&mute=1&loop=1&playlist=_pkBDiVYarw&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&color=white&enablejsapi=1"
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

      {/* Sound Control Button - Top Right Corner */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          onClick={toggleMute}
          variant="ghost"
          size="sm"
          className="text-white bg-black/30 focus-visible:bg-black/30 border border-white/50 backdrop-blur-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/80 ring-offset-2 ring-offset-black/30"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Content Overlay Layer - Restructured for top and bottom positioning */}
      <div className="relative z-10 flex flex-col justify-between h-full px-4 sm:px-6 lg:px-8">
        
        {/* Top Section - Wedding Date */}
        <div className="flex justify-center pt-32 md:pt-28 lg:pt-32">
          <h1 className="hero-title text-center" role="heading" aria-level={1}>
            <span
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-2xl shadow-black/50"
              style={{
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)",
              }}
            >
              {weddingDate}
            </span>
          </h1>
        </div>

        {/* Bottom Section - Details Button */}
        <div className="flex justify-center pb-42">
          <Button
            onClick={handleScrollToDetails}
            size="lg"
            className="bg-white text-black font-semibold px-8 py-4 text-base md:text-lg lg:text-xl focus:outline-none transition-all duration-200 ease-in-out border border-gray-300 rounded-md hover:shadow-md focus:shadow-md hover:bg-gray-100/80 focus:bg-gray-100/80"
            aria-label="Scroll to wedding details section"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Детайли
          </Button>
        </div>
      </div>
    </section>
  );
}
