/**
 * Love Story Timeline Types
 *
 * Defines the data structure for the timeline gallery that tells
 * the couple's love story through photos and narrative text.
 */

export interface TimelinePhoto {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
  /** Optional caption for the photo */
  caption?: string;
}

export interface TimelineMilestone {
  /** Unique identifier for the milestone */
  id: string;
  /** Display date (e.g., "May 2020", "Summer 2021") */
  date: string;
  /** Milestone title (e.g., "First Date", "How We Met") */
  title: string;
  /** Story description (50-100 words) */
  description: string;
  /** Photo for this milestone */
  photo: TimelinePhoto;
  /** Layout placement for desktop (alternating) */
  placement: "left" | "right";
  /** Optional order/priority for sorting */
  order?: number;
}

export interface TimelineData {
  /** Array of timeline milestones */
  milestones: TimelineMilestone[];
  /** Timeline metadata */
  metadata: {
    /** Timeline title */
    title: string;
    /** Timeline subtitle/description */
    subtitle: string;
    /** Couple names */
    couple: {
      bride: string;
      groom: string;
    };
    /** Creation/last updated timestamp */
    lastUpdated: string;
  };
}

/**
 * Configuration for timeline display and behavior
 */
export interface TimelineConfig {
  /** Enable scroll animations */
  enableAnimations: boolean;
  /** Animation duration in milliseconds */
  animationDuration: number;
  /** Enable lazy loading for images */
  lazyLoading: boolean;
  /** Maximum number of milestones to display */
  maxMilestones?: number;
  /** Auto-alternate placement (overrides manual placement) */
  autoAlternate: boolean;
}

/**
 * Props for timeline components
 */
export interface TimelineGalleryProps {
  /** Timeline data */
  data: TimelineData;
  /** Configuration options */
  config?: Partial<TimelineConfig>;
  /** Custom CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface TimelineMilestoneProps {
  /** Milestone data */
  milestone: TimelineMilestone;
  /** Index in the timeline */
  index: number;
  /** Total number of milestones */
  total: number;
  /** Animation configuration */
  config: TimelineConfig;
  /** Custom CSS classes */
  className?: string;
}

export interface TimelineConnectorProps {
  /** Total number of milestones */
  milestoneCount: number;
  /** Current milestone index being viewed */
  activeIndex?: number;
  /** Custom CSS classes */
  className?: string;
}

export interface TimelinePhotoProps {
  /** Photo data */
  photo: TimelinePhoto;
  /** Milestone title for context */
  milestoneTitle: string;
  /** Whether to use lazy loading */
  lazy?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface TimelineContentProps {
  /** Milestone data */
  milestone: Pick<TimelineMilestone, "date" | "title" | "description">;
  /** Content placement */
  placement: "left" | "right";
  /** Custom CSS classes */
  className?: string;
}

/**
 * Animation state for intersection observer
 */
export interface TimelineAnimationState {
  /** Whether the element is visible */
  isVisible: boolean;
  /** Whether the animation has been triggered */
  hasAnimated: boolean;
  /** Animation delay in milliseconds */
  delay?: number;
}

/**
 * Default timeline configuration
 */
export const DEFAULT_TIMELINE_CONFIG: TimelineConfig = {
  enableAnimations: true,
  animationDuration: 300,
  lazyLoading: true,
  autoAlternate: true,
};

/**
 * Milestone categories for content organization
 */
export const MILESTONE_CATEGORIES = {
  MEETING: "How We Met",
  FIRST_DATE: "First Date",
  FIRST_LOVE: 'First "I Love You"',
  MOVING_IN: "Moving In Together",
  PROPOSAL: "The Proposal",
  ENGAGEMENT: "Planning Our Wedding",
  WEDDING: "Our Wedding Day",
  FUTURE: "Our Future Together",
} as const;

export type MilestoneCategory =
  (typeof MILESTONE_CATEGORIES)[keyof typeof MILESTONE_CATEGORIES];
