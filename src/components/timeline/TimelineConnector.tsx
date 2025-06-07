"use client";

import React from "react";
import { TimelineConnectorProps } from "@/types/timeline";

/**
 * TimelineConnector - Visual connector component for the timeline
 *
 * Features:
 * - Vertical connecting line with gradient styling
 * - Circular milestone markers positioned at each milestone
 * - Responsive design with different sizes for mobile/desktop
 * - Wedding theme colors integration
 * - Active milestone highlighting
 */
export default function TimelineConnector({
  milestoneCount,
  activeIndex,
  className = "",
}: TimelineConnectorProps) {
  // Generate milestone markers
  const milestoneMarkers = Array.from(
    { length: milestoneCount },
    (_, index) => {
      const isActive = activeIndex !== undefined && index === activeIndex;
      const isPast = activeIndex !== undefined && index < activeIndex;

      return (
        <div
          key={index}
          className={`timeline-marker ${isActive ? "active" : ""} ${isPast ? "past" : ""}`}
          style={{
            top: `${(index / Math.max(milestoneCount - 1, 1)) * 100}%`,
          }}
          aria-hidden="true"
        >
          <div className="timeline-marker-dot" />
          <div className="timeline-marker-pulse" />
        </div>
      );
    }
  );

  return (
    <div className={`timeline-connector ${className}`} aria-hidden="true">
      {/* Main connector line */}
      <div className="timeline-connector-line" />

      {/* Milestone markers */}
      <div className="timeline-markers">{milestoneMarkers}</div>

      {/* Connector Styles */}
      <style jsx>{`
        .timeline-connector {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          transform: translateX(-50%);
          z-index: 5;
          pointer-events: none;
        }

        .timeline-connector-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgb(var(--wedding-sage) / 0.6) 5%,
            rgb(var(--wedding-sage) / 0.8) 50%,
            rgb(var(--wedding-sage) / 0.6) 95%,
            transparent 100%
          );
          border-radius: 2px;
        }

        .timeline-markers {
          position: relative;
          height: 100%;
        }

        .timeline-marker {
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          transition: all 0.3s ease;
        }

        .timeline-marker-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgb(var(--wedding-rose));
          border: 3px solid rgb(var(--background));
          box-shadow:
            0 0 0 2px rgb(var(--wedding-rose) / 0.3),
            0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .timeline-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgb(var(--wedding-rose) / 0.2);
          transform: translate(-50%, -50%);
          z-index: 1;
          animation: pulse 2s infinite ease-in-out;
        }

        /* Active marker styles */
        .timeline-marker.active .timeline-marker-dot {
          width: 24px;
          height: 24px;
          background: rgb(var(--wedding-rose));
          box-shadow:
            0 0 0 3px rgb(var(--background)),
            0 0 0 6px rgb(var(--wedding-rose) / 0.4),
            0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .timeline-marker.active .timeline-marker-pulse {
          width: 30px;
          height: 30px;
          animation: activePulse 1.5s infinite ease-in-out;
        }

        /* Past marker styles */
        .timeline-marker.past .timeline-marker-dot {
          background: rgb(var(--wedding-sage));
          box-shadow:
            0 0 0 2px rgb(var(--background)),
            0 0 0 4px rgb(var(--wedding-sage) / 0.3),
            0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .timeline-marker.past .timeline-marker-pulse {
          background: rgb(var(--wedding-sage) / 0.2);
          animation: none;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .timeline-connector {
            left: 2rem;
            width: 2px;
          }

          .timeline-marker-dot {
            width: 16px;
            height: 16px;
            border-width: 2px;
          }

          .timeline-marker.active .timeline-marker-dot {
            width: 18px;
            height: 18px;
          }

          .timeline-marker-pulse {
            width: 16px;
            height: 16px;
          }

          .timeline-marker.active .timeline-marker-pulse {
            width: 24px;
            height: 24px;
          }
        }

        /* Animations */
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes activePulse {
          0%,
          100% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .timeline-marker,
          .timeline-marker-dot,
          .timeline-marker-pulse {
            transition: none;
          }

          .timeline-marker-pulse {
            animation: none;
          }

          .timeline-marker.active .timeline-marker-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
