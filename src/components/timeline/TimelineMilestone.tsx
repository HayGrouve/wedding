"use client";

import React from "react";
import Image from "next/image";
import { TimelineMilestoneProps } from "@/types/timeline";

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
          <div className="photo-wrapper">
            <Image
              src={milestone.photo.src}
              alt={milestone.photo.alt}
              width={milestone.photo.width}
              height={milestone.photo.height}
              className="milestone-image"
              loading={config.lazyLoading ? "lazy" : "eager"}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {milestone.photo.caption && (
              <div className="photo-caption">{milestone.photo.caption}</div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="milestone-content">
          <div className="content-wrapper">
            {/* Date */}
            <div className="milestone-date">{milestone.date}</div>

            {/* Title */}
            <h3
              id={`milestone-title-${milestone.id}`}
              className="milestone-title"
            >
              {milestone.title}
            </h3>

            {/* Description */}
            <p className="milestone-description">{milestone.description}</p>
          </div>
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
          max-width: 350px;
        }

        .photo-wrapper {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.08);
          transition:
            transform ${config.animationDuration}ms ease,
            box-shadow ${config.animationDuration}ms ease;
        }

        .photo-wrapper:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.15),
            0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .milestone-image {
          width: 100%;
          height: auto;
          border-radius: 12px;
          transition: transform ${config.animationDuration}ms ease;
        }

        .photo-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          color: white;
          padding: 1rem;
          font-size: 0.875rem;
          text-align: center;
          font-style: italic;
        }

        /* Content styling */
        .milestone-content {
          max-width: 350px;
        }

        .content-wrapper {
          padding: 1rem;
        }

        .milestone-date {
          display: inline-block;
          background: rgb(var(--wedding-sage) / 0.1);
          color: rgb(var(--wedding-sage));
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
          border: 1px solid rgb(var(--wedding-sage) / 0.2);
        }

        .milestone-title {
          font-family: var(--font-playfair);
          font-size: 1.5rem;
          font-weight: 600;
          color: rgb(var(--wedding-rose));
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .milestone-description {
          font-size: 1rem;
          line-height: 1.6;
          color: rgb(var(--foreground) / 0.8);
          margin: 0;
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

          .content-wrapper {
            padding: 0.5rem;
          }

          .milestone-title {
            font-size: 1.25rem;
          }

          .milestone-description {
            font-size: 0.9375rem;
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
