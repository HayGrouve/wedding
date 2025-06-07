import React from "react";
import TimelineMilestone from "./TimelineMilestone";
import TimelineConnector from "./TimelineConnector";
import {
  mediaQueries,
  responsiveTypography,
  weddingResponsiveUtils,
  responsiveSpacingUtils,
} from "../../lib/responsive";
import {
  TimelineData,
  TimelineConfig,
  DEFAULT_TIMELINE_CONFIG,
} from "../../types/timeline";

interface LoveStoryTimelineProps {
  /** Timeline data with milestones and metadata */
  data: TimelineData;

  /** Configuration options for timeline behavior */
  config?: Partial<TimelineConfig>;

  /** Whether to show connectors between milestones */
  showConnectors?: boolean;

  /** Custom CSS class name */
  className?: string;

  /** Test ID for testing purposes */
  "data-testid"?: string;
}

/**
 * Main Love Story Timeline Component
 *
 * Displays the couple's journey through major milestones with responsive design
 * that adapts from mobile single-column to desktop alternating layout.
 */
export function LoveStoryTimeline({
  data,
  config: userConfig = {},
  showConnectors = true,
  className = "",
  "data-testid": testId = "love-story-timeline",
}: LoveStoryTimelineProps) {
  const config = { ...DEFAULT_TIMELINE_CONFIG, ...userConfig };
  const { milestones, metadata } = data;

  if (!milestones || milestones.length === 0) {
    return (
      <section className={`timeline-empty ${className}`} data-testid={testId}>
        <div className="empty-state">
          <h2>Няма налични моменти</h2>
          <p>Моментите от нашата история ще бъдат добавени скоро.</p>
        </div>

        <style jsx>{`
          .timeline-empty {
            ${weddingResponsiveUtils.contentWrapper}
            text-align: center;
            color: #6b7280;
          }

          .empty-state h2 {
            ${responsiveTypography.h2}
            margin-bottom: 1rem;
            color: #374151;
          }

          .empty-state p {
            ${responsiveTypography.body}
            opacity: 0.8;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section
      className={`love-story-timeline ${className}`}
      data-testid={testId}
    >
      {/* Timeline Header */}
      <header className="timeline-header">
        <h1 className="timeline-title">{metadata.title}</h1>
        {metadata.subtitle && (
          <p className="timeline-description">{metadata.subtitle}</p>
        )}
        <div className="couple-names">
          <span className="bride-name">{metadata.couple.bride}</span>
          <span className="separator"> & </span>
          <span className="groom-name">{metadata.couple.groom}</span>
        </div>
      </header>

      {/* Timeline Content */}
      <div className="timeline-container">
        <div className="timeline-content">
          {/* Timeline Connector */}
          {showConnectors && (
            <TimelineConnector
              milestoneCount={milestones.length}
              className="main-connector"
            />
          )}

          {/* Timeline Milestones */}
          {milestones.map((milestone, index) => (
            <TimelineMilestone
              key={milestone.id}
              milestone={milestone}
              index={index}
              total={milestones.length}
              config={config}
              className="main-milestone"
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .love-story-timeline {
          ${weddingResponsiveUtils.contentWrapper}
          ${responsiveSpacingUtils.sectionSpacing}
          min-height: 50vh;
          position: relative;
        }

        /* Timeline Header Styles */
        .timeline-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .timeline-title {
          ${responsiveTypography.h1}
          color: rgb(var(--wedding-charcoal));
          margin-bottom: 1rem;
          font-weight: 700;
          text-wrap: balance;
        }

        .timeline-description {
          ${responsiveTypography.body}
          color: rgb(var(--wedding-charcoal) / 0.7);
          line-height: 1.6;
          text-wrap: pretty;
          margin-bottom: 2rem;
        }

        .couple-names {
          ${responsiveTypography.h3}
          color: rgb(var(--wedding-rose));
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
        }

        .bride-name,
        .groom-name {
          display: inline-block;
        }

        .separator {
          color: rgb(var(--wedding-sage));
          margin: 0 0.5rem;
        }

        /* Timeline Container */
        .timeline-container {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .timeline-content {
          position: relative;
          padding: 2rem 0;
        }

        /* Mobile Layout - Single Column */
        ${mediaQueries.mobile} {
          .timeline-header {
            margin-bottom: 2rem;
          }

          .timeline-title {
            font-size: 2rem;
          }

          .couple-names {
            font-size: 1.25rem;
          }

          .timeline-content {
            padding: 1rem 0;
          }
        }

        /* Tablet Layout - Optimized Spacing */
        ${mediaQueries.tablet} {
          .timeline-header {
            margin-bottom: 3rem;
          }

          .timeline-content {
            max-width: 700px;
            margin: 0 auto;
          }
        }

        /* Desktop Layout - Full Experience */
        ${mediaQueries.desktop} {
          .timeline-content {
            padding: 3rem 0;
          }
        }

        /* Enhanced Visual Polish */
        .timeline-container {
          background: linear-gradient(
            135deg,
            rgb(var(--background)) 0%,
            rgb(var(--wedding-cream) / 0.05) 50%,
            rgb(var(--background)) 100%
          );
          border-radius: 16px;
          padding: 2rem;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        /* Wedding Theme Integration */
        .love-story-timeline {
          --wedding-rose: 219, 39, 119;
          --wedding-sage: 132, 165, 157;
          --wedding-cream: 254, 252, 249;
          --wedding-charcoal: 55, 65, 81;
          --background: 255, 255, 255;
        }

        /* Accessibility Enhancements */
        @media (prefers-reduced-motion: reduce) {
          .timeline-content {
            transition: none;
          }
        }

        /* Print Styles */
        @media print {
          .love-story-timeline {
            padding: 1rem;
            page-break-inside: avoid;
            box-shadow: none;
            background: white;
          }

          .timeline-container {
            background: white;
            box-shadow: none;
          }
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .timeline-title {
            color: #000;
          }

          .timeline-description {
            color: #333;
          }

          .timeline-container {
            border: 2px solid #000;
            background: white;
          }
        }

        /* Focus Management for Keyboard Navigation */
        .timeline-content:focus-within {
          outline: 2px solid rgb(var(--wedding-rose));
          outline-offset: 4px;
          border-radius: 8px;
        }

        /* Loading State */
        .timeline-content:empty::before {
          content: "Зареждане на моментите...";
          display: block;
          text-align: center;
          color: rgb(var(--wedding-charcoal) / 0.6);
          font-style: italic;
          padding: 4rem;
        }
      `}</style>
    </section>
  );
}

export default LoveStoryTimeline;
