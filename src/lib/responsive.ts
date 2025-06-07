/**
 * Responsive Breakpoint System for Wedding Website
 *
 * CSS-in-JS responsive utilities providing mobile-first design approach
 * with standardized breakpoints and spacing values.
 */

export interface BreakpointConfig {
  mobile: {
    max: number;
    query: string;
  };
  tablet: {
    min: number;
    max: number;
    query: string;
  };
  desktop: {
    min: number;
    query: string;
  };
}

export interface SpacingConfig {
  mobile: {
    padding: string;
    verticalSpacing: string;
  };
  desktop: {
    verticalSpacing: string;
    timelineSpacing: string;
  };
}

/**
 * Standardized breakpoint configuration
 * Mobile-first approach with progressive enhancement
 */
export const breakpoints: BreakpointConfig = {
  mobile: {
    max: 767,
    query: "(max-width: 767px)",
  },
  tablet: {
    min: 768,
    max: 1023,
    query: "(min-width: 768px) and (max-width: 1023px)",
  },
  desktop: {
    min: 1024,
    query: "(min-width: 1024px)",
  },
};

/**
 * Standardized spacing configuration
 */
export const spacing: SpacingConfig = {
  mobile: {
    padding: "24px",
    verticalSpacing: "32px",
  },
  desktop: {
    verticalSpacing: "40px",
    timelineSpacing: "60px",
  },
};

/**
 * Media query utilities for CSS-in-JS
 */
export const mediaQueries = {
  mobile: `@media ${breakpoints.mobile.query}`,
  tablet: `@media ${breakpoints.tablet.query}`,
  desktop: `@media ${breakpoints.desktop.query}`,
  tabletAndUp: `@media (min-width: ${breakpoints.tablet.min}px)`,
  desktopAndUp: `@media (min-width: ${breakpoints.desktop.min}px)`,
  mobileOnly: `@media ${breakpoints.mobile.query}`,
};

/**
 * Container query utilities (for modern browsers)
 */
export const containerQueries = {
  small: "@container (max-width: 400px)",
  medium: "@container (min-width: 401px) and (max-width: 800px)",
  large: "@container (min-width: 801px)",
};

/**
 * Generate responsive styles helper
 * @param styles - Object with mobile, tablet, desktop styles
 * @returns CSS string with media queries
 */
export function responsive<T extends Record<string, string | number>>(styles: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
}): string {
  let css = "";

  // Base styles (mobile-first)
  if (styles.mobile) {
    css += Object.entries(styles.mobile)
      .map(([prop, value]) => `${prop}: ${value};`)
      .join(" ");
  }

  // Tablet styles
  if (styles.tablet) {
    css += ` ${mediaQueries.tablet} {`;
    css += Object.entries(styles.tablet)
      .map(([prop, value]) => `${prop}: ${value};`)
      .join(" ");
    css += " }";
  }

  // Desktop styles
  if (styles.desktop) {
    css += ` ${mediaQueries.desktop} {`;
    css += Object.entries(styles.desktop)
      .map(([prop, value]) => `${prop}: ${value};`)
      .join(" ");
    css += " }";
  }

  return css;
}

/**
 * Generate CSS grid responsive layout
 * @param config - Grid configuration for different breakpoints
 */
export function responsiveGrid(config: {
  mobile?: {
    columns?: string | number;
    gap?: string;
    areas?: string;
  };
  tablet?: {
    columns?: string | number;
    gap?: string;
    areas?: string;
  };
  desktop?: {
    columns?: string | number;
    gap?: string;
    areas?: string;
  };
}): string {
  let css = "display: grid; ";

  // Mobile grid (base)
  if (config.mobile) {
    if (config.mobile.columns) {
      css += `grid-template-columns: ${
        typeof config.mobile.columns === "number"
          ? `repeat(${config.mobile.columns}, 1fr)`
          : config.mobile.columns
      }; `;
    }
    if (config.mobile.gap) css += `gap: ${config.mobile.gap}; `;
    if (config.mobile.areas)
      css += `grid-template-areas: ${config.mobile.areas}; `;
  }

  // Tablet grid
  if (config.tablet) {
    css += ` ${mediaQueries.tablet} {`;
    if (config.tablet.columns) {
      css += `grid-template-columns: ${
        typeof config.tablet.columns === "number"
          ? `repeat(${config.tablet.columns}, 1fr)`
          : config.tablet.columns
      }; `;
    }
    if (config.tablet.gap) css += `gap: ${config.tablet.gap}; `;
    if (config.tablet.areas)
      css += `grid-template-areas: ${config.tablet.areas}; `;
    css += " }";
  }

  // Desktop grid
  if (config.desktop) {
    css += ` ${mediaQueries.desktop} {`;
    if (config.desktop.columns) {
      css += `grid-template-columns: ${
        typeof config.desktop.columns === "number"
          ? `repeat(${config.desktop.columns}, 1fr)`
          : config.desktop.columns
      }; `;
    }
    if (config.desktop.gap) css += `gap: ${config.desktop.gap}; `;
    if (config.desktop.areas)
      css += `grid-template-areas: ${config.desktop.areas}; `;
    css += " }";
  }

  return css;
}

/**
 * Generate responsive font sizes
 * @param config - Font size configuration for breakpoints
 */
export function responsiveFontSize(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string {
  return responsive({
    mobile: config.mobile ? { "font-size": config.mobile } : undefined,
    tablet: config.tablet ? { "font-size": config.tablet } : undefined,
    desktop: config.desktop ? { "font-size": config.desktop } : undefined,
  });
}

/**
 * Generate responsive spacing (margin/padding)
 * @param property - CSS property (margin, padding, etc.)
 * @param config - Spacing values for breakpoints
 */
export function responsiveSpacing(
  property: string,
  config: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }
): string {
  return responsive({
    mobile: config.mobile ? { [property]: config.mobile } : undefined,
    tablet: config.tablet ? { [property]: config.tablet } : undefined,
    desktop: config.desktop ? { [property]: config.desktop } : undefined,
  });
}

/**
 * Pre-built responsive spacing utilities
 */
export const responsiveSpacingUtils = {
  // Standard padding configurations
  containerPadding: responsiveSpacing("padding", {
    mobile: spacing.mobile.padding,
    desktop: spacing.mobile.padding,
  }),

  // Vertical spacing configurations
  sectionSpacing: responsiveSpacing("margin-bottom", {
    mobile: spacing.mobile.verticalSpacing,
    desktop: spacing.desktop.verticalSpacing,
  }),

  // Timeline-specific spacing
  timelineSpacing: responsiveSpacing("margin-bottom", {
    mobile: spacing.mobile.verticalSpacing,
    desktop: spacing.desktop.timelineSpacing,
  }),

  // Content spacing
  contentSpacing: responsiveSpacing("padding", {
    mobile: "1rem",
    tablet: "1.5rem",
    desktop: "2rem",
  }),
};

/**
 * Container query detection and polyfill support
 */
export function supportsContainerQueries(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return CSS.supports("container-type", "inline-size");
  } catch {
    return false;
  }
}

/**
 * Responsive image sizes utility
 * @param config - Image size configuration for breakpoints
 */
export function responsiveImageSizes(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string {
  const sizes: string[] = [];

  if (config.mobile) {
    sizes.push(`${breakpoints.mobile.query} ${config.mobile}`);
  }
  if (config.tablet) {
    sizes.push(`${breakpoints.tablet.query} ${config.tablet}`);
  }
  if (config.desktop) {
    sizes.push(`${breakpoints.desktop.query} ${config.desktop}`);
  }

  // Add default fallback
  const defaultSize =
    config.desktop || config.tablet || config.mobile || "100vw";
  sizes.push(defaultSize);

  return sizes.join(", ");
}

/**
 * Viewport-based typography scaling
 */
export const responsiveTypography = {
  // Heading scales
  h1: responsiveFontSize({
    mobile: "2rem",
    tablet: "2.5rem",
    desktop: "3rem",
  }),
  h2: responsiveFontSize({
    mobile: "1.75rem",
    tablet: "2rem",
    desktop: "2.5rem",
  }),
  h3: responsiveFontSize({
    mobile: "1.5rem",
    tablet: "1.75rem",
    desktop: "2rem",
  }),
  h4: responsiveFontSize({
    mobile: "1.25rem",
    tablet: "1.5rem",
    desktop: "1.75rem",
  }),

  // Body text scales
  body: responsiveFontSize({
    mobile: "1rem",
    tablet: "1rem",
    desktop: "1.125rem",
  }),
  small: responsiveFontSize({
    mobile: "0.875rem",
    tablet: "0.875rem",
    desktop: "1rem",
  }),

  // Timeline-specific typography
  timelineTitle: responsiveFontSize({
    mobile: "1.25rem",
    tablet: "1.5rem",
    desktop: "1.5rem",
  }),
  timelineDescription: responsiveFontSize({
    mobile: "0.9375rem",
    tablet: "1rem",
    desktop: "1rem",
  }),
};

/**
 * Debug utilities for development
 */
export const debugUtils = {
  /**
   * Add visible breakpoint indicator for development
   */
  showBreakpoints(): string {
    return `
      &::before {
        content: "Mobile";
        position: fixed;
        top: 10px;
        right: 10px;
        background: red;
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        z-index: 9999;
        border-radius: 4px;
      }

      ${mediaQueries.tablet} {
        &::before {
          content: "Tablet";
          background: orange;
        }
      }

      ${mediaQueries.desktop} {
        &::before {
          content: "Desktop";
          background: green;
        }
      }
    `;
  },

  /**
   * Highlight container query support
   */
  showContainerSupport(): string {
    return `
      &::after {
        content: "${supportsContainerQueries() ? "CQ: ✓" : "CQ: ✗"}";
        position: fixed;
        top: 50px;
        right: 10px;
        background: ${supportsContainerQueries() ? "green" : "red"};
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        z-index: 9999;
        border-radius: 4px;
      }
    `;
  },
};

/**
 * Wedding-specific responsive utilities
 */
export const weddingResponsiveUtils = {
  // Timeline container
  timelineContainer: responsiveGrid({
    mobile: {
      columns: "1fr",
      gap: spacing.mobile.verticalSpacing,
    },
    desktop: {
      columns: "1fr 1fr",
      gap: spacing.desktop.timelineSpacing,
    },
  }),

  // Photo gallery responsive sizing
  photoGallery: responsive({
    mobile: {
      "max-width": "280px",
      margin: "0 auto",
    },
    tablet: {
      "max-width": "350px",
    },
    desktop: {
      "max-width": "400px",
    },
  }),

  // Content wrapper responsive padding
  contentWrapper: responsive({
    mobile: {
      padding: spacing.mobile.padding,
    },
    desktop: {
      padding: "2rem",
    },
  }),
};
