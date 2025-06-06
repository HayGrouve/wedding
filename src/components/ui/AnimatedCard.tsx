import React, { ReactNode } from "react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animationType?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "fadeIn";
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  delay = 0,
  animationType = "fadeInUp",
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px 0px -5% 0px",
    triggerOnce: true,
  });

  const animationClasses = {
    fadeInUp: {
      initial: "opacity-0 translate-y-8",
      animated: "opacity-100 translate-y-0",
    },
    fadeInLeft: {
      initial: "opacity-0 -translate-x-8",
      animated: "opacity-100 translate-x-0",
    },
    fadeInRight: {
      initial: "opacity-0 translate-x-8",
      animated: "opacity-100 translate-x-0",
    },
    fadeIn: {
      initial: "opacity-0",
      animated: "opacity-100",
    },
  };

  const animation = animationClasses[animationType];

  return (
    <div
      ref={ref}
      className={`
        transform transition-all duration-700 ease-out
        ${isIntersecting ? animation.animated : animation.initial}
        ${className}
      `}
      style={{
        transitionDelay: isIntersecting ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
