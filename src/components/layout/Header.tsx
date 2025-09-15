"use client";

import * as React from "react";
import DesktopNavigation from "@/components/navigation/DesktopNavigation";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import Image from "next/image";

import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    e.currentTarget.blur();
  };

  return (
    <div
      className={cn(
        "w-full transition-all duration-200 ease-in-out",
        "border-b border-border/50",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-border"
          : "bg-background/90 backdrop-blur-sm"
      )}
    >
      <div className="container-wedding">
        <div
          className={cn(
            "grid grid-cols-3 items-center transition-all duration-200 relative",
            isScrolled ? "h-14 md:h-16" : "h-16 md:h-18"
          )}
        >
          {/* Left brand text (hide on small screens to avoid wrapping) */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <a
              href="#home"
              aria-label="Начало"
              onClick={handleHomeClick}
              className="focus:outline-none"
            >
              <span
                className={cn(
                  "font-great-vibes font-semibold transition-all duration-200",
                  isScrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
                )}
              >
                Анна-Мария & Георги
              </span>
            </a>
          </div>

          {/* Center logo (absolute centered on mobile, grid-centered on md+) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center md:relative">
            <a href="#home" aria-label="Начало">
              <Image
                src="/logo.png"
                alt="Лого Анна-Мария и Георги"
                width={isScrolled ? 44 : 56}
                height={isScrolled ? 44 : 56}
                priority
              />
            </a>
          </div>

          {/* Right side - Navigation */}
          <div className="absolute right-0 flex items-center justify-end gap-2 md:static">
            {/* Desktop Navigation */}
            <DesktopNavigation />

            {/* Mobile Navigation */}
            <MobileNavigation />
          </div>
        </div>
      </div>
    </div>
  );
}
