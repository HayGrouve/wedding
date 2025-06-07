"use client";

import React from "react";
import { TimelineMilestoneProps } from "@/types/timeline";
import TimelinePhoto from "./TimelinePhoto";
import TimelineContent from "./TimelineContent";

/**
 * TimelineMilestone - Individual milestone component for the timeline
 *
 * Features:
 * - Alternating left/right layout for desktop
 * - Stacked layout for mobile
 * - Optimized image loading with Next.js Image
 * - Semantic HTML structure with article tags
 * - Wedding theme styling integration
 * - Responsive design with proper spacing
 */
export default function TimelineMilestone({
  milestone,
  index,
  total,
  config,
  className = "",
}: TimelineMilestoneProps) {
  const isLeft = milestone.placement === "left";
  const isLast = index === total - 1;

  return (
    <article
      className={`timeline-milestone ${isLeft ? "left" : "right"} ${className}`}
      aria-labelledby={`milestone-title-${milestone.id}`}
    >
      {/* Milestone Content Container */}
      <div className="milestone-container">
        {/* Photo Section */}
        <div className="milestone-photo">
          <TimelinePhoto
            photo={milestone.photo}
            priority={index === 0}
            size="medium"
            hoverEffect={true}
            showCaption={true}
            className="milestone-photo-component"
          />
        </div>

        {/* Content Section */}
        <div className="milestone-content">
          <TimelineContent
            date={milestone.date}
            title={milestone.title}
            description={milestone.description}
            alignment={index % 2 === 0 ? "left" : "right"}
            maxDescriptionLength={200}
            showExpandButton={true}
          />
        </div>
      </div>

      {/* Milestone Styles */}
      <style jsx>{`
        .timeline-milestone {
          position: relative;
          width: 100%;
          margin-bottom: ${isLast ? "2rem" : "4rem"};
          padding: 0 2rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp ${config.animationDuration}ms ease-out
            ${index * 150}ms forwards;
        }

        .milestone-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Left placement */
        .timeline-milestone.left .milestone-container {
          grid-template-areas: "content photo";
        }

        .timeline-milestone.left .milestone-photo {
          grid-area: photo;
          justify-self: start;
        }

        .timeline-milestone.left .milestone-content {
          grid-area: content;
          text-align: right;
          justify-self: end;
        }

        /* Right placement */
        .timeline-milestone.right .milestone-container {
          grid-template-areas: "photo content";
        }

        .timeline-milestone.right .milestone-photo {
          grid-area: photo;
          justify-self: end;
        }

        .timeline-milestone.right .milestone-content {
          grid-area: content;
          text-align: left;
          justify-self: start;
        }

        /* Photo styling */
        .milestone-photo {
          position: relative;
          max-width: 400px;
          width: 100%;
        }

        .milestone-photo-component {
          width: 100%;
        }

        /* Content styling */
        .milestone-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .timeline-milestone {
            padding: 0 1rem 0 3.5rem;
            margin-bottom: ${isLast ? "1.5rem" : "3rem"};
          }

          .milestone-container {
            grid-template-columns: 1fr;
            grid-template-areas:
              "photo"
              "content";
            gap: 1.5rem;
            max-width: none;
          }

          .timeline-milestone.left .milestone-content,
          .timeline-milestone.right .milestone-content {
            text-align: left;
            justify-self: stretch;
          }

          .timeline-milestone.left .milestone-photo,
          .timeline-milestone.right .milestone-photo {
            justify-self: center;
          }

          .milestone-photo {
            max-width: 280px;
          }

          .milestone-content {
            max-width: none;
          }
        }

        /* Animation keyframes */
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .timeline-milestone {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .photo-wrapper,
          .milestone-image {
            transition: none;
          }

          .photo-wrapper:hover {
            transform: none;
          }
        }
      `}</style>
    </article>
  );
}
