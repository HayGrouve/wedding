"use client";

import * as React from "react";
import DesktopNavigation from "@/components/navigation/DesktopNavigation";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  activeSection?: string;
}

export default function Header({ activeSection }: HeaderProps) {
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
          ? "bg-background/95 backdrop-blur-md shadow-sm border-border"
          : "bg-background/60 backdrop-blur-sm"
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
            <Heart
              className={cn(
                "text-primary transition-all duration-200 hover:scale-110",
                "hover:text-wedding-rose cursor-pointer",
                isScrolled ? "h-5 w-5 md:h-6 md:w-6" : "h-6 w-6 md:h-7 md:w-7"
              )}
            />
            <span
              className={cn(
                "font-serif font-semibold transition-all duration-200",
                isScrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
              )}
            >
              Ана-Мария & Георги
            </span>
          </div>

          {/* Right side - Navigation and Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <DesktopNavigation activeSection={activeSection} />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Navigation */}
            <MobileNavigation activeSection={activeSection} />
          </div>
        </div>
      </div>
    </div>
  );
}
