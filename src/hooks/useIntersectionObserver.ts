import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -10% 0px",
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if intersection observer is supported
    if (!window.IntersectionObserver) {
      // Fallback for older browsers - assume element is visible
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isCurrentlyIntersecting = entry.isIntersecting;

        if (isCurrentlyIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !isCurrentlyIntersecting) {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref: elementRef, isIntersecting, hasTriggered };
};

export default useIntersectionObserver;
