"use client";

import React from "react";
import {
  TimelineGalleryProps,
  DEFAULT_TIMELINE_CONFIG,
} from "@/types/timeline";
import { getMilestonesWithAutoPlacement } from "@/data/timeline-data";
import TimelineConnector from "./TimelineConnector";
import TimelineMilestone from "./TimelineMilestone";

/**
 * TimelineGallery - Main container component for the love story timeline
 *
 * Features:
 * - Responsive CSS Grid layout
 * - Vertical timeline with alternating left/right placement
 * - Mobile-first responsive design
 * - Semantic HTML structure with proper ARIA labels
 * - Wedding theme integration
 */
export default function TimelineGallery({
  data,
  config = {},
  className = "",
  style = {},
}: TimelineGalleryProps) {
  // Merge user config with defaults
  const timelineConfig = { ...DEFAULT_TIMELINE_CONFIG, ...config };

  // Get milestones with proper placement
  const milestones = timelineConfig.autoAlternate
    ? getMilestonesWithAutoPlacement()
    : data.milestones;

  // Limit milestones if maxMilestones is set
  const displayMilestones = timelineConfig.maxMilestones
    ? milestones.slice(0, timelineConfig.maxMilestones)
    : milestones;

  return (
    <section
      className={`timeline-gallery ${className}`}
      style={style}
      aria-labelledby="timeline-title"
    >
      {/* Timeline Header */}
      <div className="timeline-header">
        <div className="container-wedding">
          <div className="text-center mb-12">
            <h2
              id="timeline-title"
              className="text-3xl md:text-4xl font-bold mb-4 wedding-text-gradient font-playfair"
            >
              {data.metadata.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {data.metadata.subtitle}
            </p>
            <div className="text-sm text-muted-foreground mt-2">
              <span className="font-medium">
                {data.metadata.couple.bride} & {data.metadata.couple.groom}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="timeline-container">
        <div className="timeline-wrapper">
          {/* Timeline connector with visual elements */}
          <TimelineConnector
            milestoneCount={displayMilestones.length}
            activeIndex={undefined} // Will be enhanced later with scroll detection
          />

          {/* Timeline milestones */}
          <div className="timeline-content">
            {displayMilestones.map((milestone, index) => (
              <TimelineMilestone
                key={milestone.id}
                milestone={milestone}
                index={index}
                total={displayMilestones.length}
                config={timelineConfig}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Styles */}
      <style jsx>{`
        .timeline-gallery {
          --timeline-line-color: rgb(var(--wedding-rose) / 0.3);
          --timeline-dot-color: rgb(var(--wedding-rose));
          --timeline-content-bg: rgb(var(--background));
          --timeline-border-color: rgb(var(--border));
          --timeline-text-muted: rgb(var(--muted-foreground));
          --timeline-animation-duration: ${timelineConfig.animationDuration}ms;
        }

        .timeline-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1rem;
          position: relative;
        }

        .timeline-wrapper {
          position: relative;
          padding: 2rem 0;
        }

        /* Timeline connector positioning */
        .timeline-wrapper {
          position: relative;
        }

        .timeline-content {
          position: relative;
          z-index: 2;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .timeline-container {
            padding: 0 0.5rem;
          }

          .timeline-wrapper {
            padding: 1rem 0;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .timeline-gallery {
            --timeline-animation-duration: 0ms;
          }
        }
      `}</style>
    </section>
  );
}
