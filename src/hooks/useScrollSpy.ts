"use client";

import { useState, useEffect, useRef } from "react";

interface UseScrollSpyOptions {
  sectionIds: string[];
  offset?: number;
  threshold?: number;
}

export function useScrollSpy({
  sectionIds,
  offset = 100,
  threshold = 0.5,
}: UseScrollSpyOptions) {
  const [activeSection, setActiveSection] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Get all visible sections with their intersection ratios
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => ({
          id: entry.target.id,
          ratio: entry.intersectionRatio,
          boundingClientRect: entry.boundingClientRect,
        }))
        .sort((a, b) => {
          // Sort by intersection ratio (higher = more visible)
          if (a.ratio !== b.ratio) {
            return b.ratio - a.ratio;
          }
          // If ratios are equal, prioritize the one closer to the top
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      if (visibleSections.length > 0) {
        const mostVisible = visibleSections[0];
        setActiveSection(mostVisible.id);
      }
    };

    // Create the intersection observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: `-${offset}px 0px -50% 0px`, // Account for header offset
      threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for better tracking
    });

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Set initial active section based on scroll position
    const checkInitialSection = () => {
      const scrollTop = window.scrollY + offset;

      // If we're at the top of the page, default to the first section
      if (scrollTop < 100) {
        setActiveSection(sectionIds[0] || "");
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element && element.offsetTop <= scrollTop) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    // Check initial section after a small delay to ensure elements are rendered
    const timer = setTimeout(checkInitialSection, 100);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearTimeout(timer);
    };
  }, [sectionIds, offset, threshold]);

  return activeSection;
}
