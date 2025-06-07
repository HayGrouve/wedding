"use client";

import React, { useState } from "react";

interface TimelineContentProps {
  date: string;
  title: string;
  description: string;
  alignment?: "left" | "right";
  maxDescriptionLength?: number;
  showExpandButton?: boolean;
  className?: string;
}

/**
 * TimelineContent - Enhanced text component for timeline milestones
 *
 * Features:
 * - Playfair Display font for titles with proper typography
 * - Wedding-sage color scheme for dates
 * - Text truncation and expansion for long descriptions
 * - CSS text-wrap: balance for better typography
 * - Semantic markup with time elements for dates
 * - Responsive text sizing and spacing
 * - Accessibility support with proper ARIA attributes
 */
export default function TimelineContent({
  date,
  title,
  description,
  alignment = "left",
  maxDescriptionLength = 150,
  showExpandButton = true,
  className = "",
}: TimelineContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if description needs truncation
  const needsTruncation = description.length > maxDescriptionLength;
  const displayDescription =
    needsTruncation && !isExpanded
      ? `${description.slice(0, maxDescriptionLength).trim()}...`
      : description;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`timeline-content ${alignment} ${className}`}>
      <div className="content-wrapper">
        {/* Date with semantic time element */}
        <time className="milestone-date" dateTime={date}>
          {date}
        </time>

        {/* Title with proper heading hierarchy */}
        <h3 className="milestone-title">{title}</h3>

        {/* Description with truncation/expansion */}
        <div className="description-container">
          <p className="milestone-description">{displayDescription}</p>

          {/* Expand/Collapse button */}
          {needsTruncation && showExpandButton && (
            <button
              type="button"
              className="expand-button"
              onClick={toggleExpansion}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Покажи по-малко" : "Покажи повече"}
            >
              {isExpanded ? "Покажи по-малко" : "Покажи повече"}
            </button>
          )}
        </div>
      </div>

      {/* Component Styles */}
      <style jsx>{`
        .timeline-content {
          max-width: 350px;
          width: 100%;
        }

        .timeline-content.left {
          text-align: right;
        }

        .timeline-content.right {
          text-align: left;
        }

        .content-wrapper {
          padding: 1rem;
        }

        /* Date styling with semantic time element */
        .milestone-date {
          display: inline-block;
          background: rgb(var(--wedding-sage) / 0.1);
          color: rgb(var(--wedding-sage));
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
          border: 1px solid rgb(var(--wedding-sage) / 0.2);
          transition: all 200ms ease;
        }

        .milestone-date:hover {
          background: rgb(var(--wedding-sage) / 0.15);
          border-color: rgb(var(--wedding-sage) / 0.3);
        }

        /* Title with Playfair Display font */
        .milestone-title {
          font-family: var(--font-playfair);
          font-size: 1.5rem;
          font-weight: 600;
          color: rgb(var(--wedding-rose));
          margin-bottom: 0.75rem;
          line-height: 1.3;
          text-wrap: balance; /* Better typography for titles */
        }

        /* Description container */
        .description-container {
          position: relative;
        }

        /* Description with enhanced typography */
        .milestone-description {
          font-size: 1rem;
          line-height: 1.6;
          color: rgb(var(--foreground) / 0.8);
          margin: 0 0 0.5rem 0;
          text-wrap: pretty; /* Better text wrapping */
          hyphens: auto; /* Automatic hyphenation for better text flow */
        }

        /* Expand/Collapse button */
        .expand-button {
          background: none;
          border: none;
          color: rgb(var(--wedding-sage));
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0.25rem 0;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: all 200ms ease;
          margin-top: 0.25rem;
        }

        .expand-button:hover {
          color: rgb(var(--wedding-rose));
          text-decoration-thickness: 2px;
        }

        .expand-button:focus {
          outline: 2px solid rgb(var(--wedding-sage) / 0.5);
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .timeline-content {
            max-width: none;
          }

          .timeline-content.left,
          .timeline-content.right {
            text-align: left;
          }

          .content-wrapper {
            padding: 0.5rem;
          }

          .milestone-title {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
          }

          .milestone-description {
            font-size: 0.9375rem;
            line-height: 1.5;
          }

          .milestone-date {
            font-size: 0.875rem;
            padding: 0.25rem 0.5rem;
            margin-bottom: 0.5rem;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .milestone-date {
            border-width: 2px;
          }

          .expand-button {
            text-decoration-thickness: 2px;
          }
        }

        /* Reduced motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .milestone-date,
          .expand-button {
            transition: none;
          }
        }

        /* Print styles */
        @media print {
          .expand-button {
            display: none;
          }

          .milestone-description {
            /* Show full text when printing */
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
