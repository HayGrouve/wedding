"use client";

import * as React from "react";
import DesktopNavigation from "@/components/navigation/DesktopNavigation";
import MobileNavigation from "@/components/navigation/MobileNavigation";

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
            "flex items-center justify-between transition-all duration-200",
            isScrolled ? "h-14 md:h-16" : "h-16 md:h-18"
          )}
        >
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={cn(
                "font-serif font-semibold transition-all duration-200",
                isScrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
              )}
            >
              Анна-Мария & Георги
            </span>
          </div>

          {/* Right side - Navigation */}
          <div className="flex items-center gap-2">
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
