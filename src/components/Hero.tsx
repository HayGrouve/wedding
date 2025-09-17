"use client";

import { useCallback, useEffect, useState, useRef } from "react";
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
  const [playerSize, setPlayerSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [isMessengerIAB, setIsMessengerIAB] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [originParam, setOriginParam] = useState("");

  // Compute iframe size. On mobile: contain 16:9 inside viewport (white bars, no crop).
  // On md+ desktops: cover viewport (no bars, may crop edges slightly).
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ratio = 16 / 9;
      const viewportRatio = vw / vh;
      const isDesktop = vw >= 768;
      if (!isDesktop) {
        // Mobile: contain (show full frame, white bars where needed)
        if (viewportRatio < ratio) {
          const width = vw;
          const height = Math.ceil(width / ratio);
          setPlayerSize({ width, height });
        } else {
          const height = vh;
          const width = Math.ceil(height * ratio);
          setPlayerSize({ width, height });
        }
      } else {
        // Desktop: cover (fill viewport, allow slight crop)
        if (viewportRatio < ratio) {
          const height = vh;
          const width = Math.ceil(height * ratio);
          setPlayerSize({ width, height });
        } else {
          const width = vw;
          const height = Math.ceil(width / ratio);
          setPlayerSize({ width, height });
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Detect Messenger in-app browser to adjust sound and controls
  useEffect(() => {
    const ua =
      (typeof navigator !== "undefined" ? navigator.userAgent : "") || "";
    setIsMessengerIAB(/Messenger|FB_IAB/i.test(ua));
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        setOriginParam(`&origin=${encodeURIComponent(window.location.origin)}`);
      } catch {}
    }
  }, []);

  const iframeSrc = (() => {
    const videoId = "_pkBDiVYarw";
    const muteParam = isMessengerIAB ? "0" : "1";
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${muteParam}&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&color=white&enablejsapi=1${originParam}`;
  })();

  const handleScrollToDetails = useCallback(() => {
    if (onScrollToDetails) {
      onScrollToDetails();
    } else {
      const detailsSection = document.getElementById("details");
      if (detailsSection) {
        const extra = 18;
        const elementTop =
          detailsSection.getBoundingClientRect().top + window.pageYOffset;
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
      className="hero-section relative w-full h-screen min-h-[70vh] md:min-h-[80vh] lg:h-screen overflow-hidden bg-white"
      role="banner"
      aria-label="Hero section with wedding announcement"
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        {/* YouTube Video Embed - Using nocookie domain and optimized parameters */}
        {mounted ? (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="object-contain md:object-cover bg-white"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={() => setVideoLoaded(true)}
            onError={() => {
              console.log(
                "YouTube video failed to load, showing fallback image"
              );
              setVideoLoaded(true);
            }}
            title="Wedding background video"
            style={{
              pointerEvents: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              width: playerSize.width ? `${playerSize.width}px` : "120vw",
              height: playerSize.height ? `${playerSize.height}px` : "120vh",
              transform: "translate(-50%, -50%)",
              zIndex: -1,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-white" aria-hidden="true" />
        )}

        {/* Enhanced overlay for better text readability (desktop only) */}
        <div
          className="hidden md:block absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"
          aria-hidden="true"
        />
        {/* Additional decorative overlay (desktop only) */}
        <div
          className="hidden md:block absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/30"
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
      {!isMessengerIAB && (
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
      )}

      {/* Content Overlay Layer - Restructured for top and bottom positioning */}
      <div className="relative z-10 flex flex-col justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Top Section - Wedding Date */}
        <div className="flex justify-center pt-32 md:pt-28 lg:pt-32">
          <h1 className="hero-title text-center" role="heading" aria-level={1}>
            <span
              className="block text-gray-800 md:text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold drop-shadow-2xl shadow-black/50"
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
