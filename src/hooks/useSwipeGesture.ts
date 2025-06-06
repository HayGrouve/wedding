import { useEffect, useRef } from "react";

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number;
  preventScrollOnSwipe?: boolean;
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
  preventScrollOnSwipe = true,
}: SwipeGestureOptions) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      if (preventScrollOnSwipe) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchStartX.current - touchEndX;
      const deltaY = touchStartY.current - touchEndY;

      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0 && onSwipeLeft) {
            onSwipeLeft();
          } else if (deltaX < 0 && onSwipeRight) {
            onSwipeRight();
          }
        }
      }

      // Reset touch coordinates
      touchStartX.current = null;
      touchStartY.current = null;
    };

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, minSwipeDistance, preventScrollOnSwipe]);

  return elementRef;
};
