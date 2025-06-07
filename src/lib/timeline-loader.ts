import { TimelineData } from "@/types/timeline";
import {
  TimelineDataManager,
  TimelineDataMigrator,
} from "./timeline-data-manager";
import timelineJson from "@/data/timeline.json";

/**
 * Timeline Data Loader
 *
 * Provides utilities for loading timeline data from various sources
 * with validation, migration, and error handling.
 */

export interface TimelineLoadResult {
  success: boolean;
  data?: TimelineData;
  errors?: string[];
  warnings?: string[];
  migrated?: boolean;
}

/**
 * Load timeline data from JSON file
 */
export async function loadTimelineFromJson(): Promise<TimelineLoadResult> {
  try {
    const manager = TimelineDataManager.getInstance();

    // Validate the JSON data
    const validation = manager.validateData(timelineJson);

    if (validation.isValid) {
      return {
        success: true,
        data: timelineJson as TimelineData,
        warnings: [],
      };
    }

    // Try migration if validation fails
    const migrated = TimelineDataMigrator.autoMigrate(timelineJson);
    if (migrated) {
      return {
        success: true,
        data: migrated,
        warnings: ["Data was migrated from older format"],
        migrated: true,
      };
    }

    return {
      success: false,
      errors: validation.errors || ["Unknown validation error"],
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        `Failed to load timeline data: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
    };
  }
}

/**
 * Load timeline data from external URL
 */
export async function loadTimelineFromUrl(
  url: string
): Promise<TimelineLoadResult> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        errors: [
          `Failed to fetch data: ${response.status} ${response.statusText}`,
        ],
      };
    }

    const data = await response.json();
    const manager = TimelineDataManager.getInstance();

    // Validate the fetched data
    const validation = manager.validateData(data);

    if (validation.isValid) {
      return {
        success: true,
        data: data as TimelineData,
      };
    }

    // Try migration if validation fails
    const migrated = TimelineDataMigrator.autoMigrate(data);
    if (migrated) {
      return {
        success: true,
        data: migrated,
        warnings: ["Data was migrated from older format"],
        migrated: true,
      };
    }

    return {
      success: false,
      errors: validation.errors || ["Unknown validation error"],
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        `Failed to load timeline from URL: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
    };
  }
}

/**
 * Load timeline data from file upload
 */
export async function loadTimelineFromFile(
  file: File
): Promise<TimelineLoadResult> {
  try {
    if (!file.type.includes("json") && !file.name.endsWith(".json")) {
      return {
        success: false,
        errors: ["File must be a JSON file"],
      };
    }

    const text = await file.text();
    const data = JSON.parse(text);
    const manager = TimelineDataManager.getInstance();

    // Validate the file data
    const validation = manager.validateData(data);

    if (validation.isValid) {
      return {
        success: true,
        data: data as TimelineData,
      };
    }

    // Try migration if validation fails
    const migrated = TimelineDataMigrator.autoMigrate(data);
    if (migrated) {
      return {
        success: true,
        data: migrated,
        warnings: ["Data was migrated from older format"],
        migrated: true,
      };
    }

    return {
      success: false,
      errors: validation.errors || ["Unknown validation error"],
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        `Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
    };
  }
}

/**
 * Save timeline data to downloadable JSON file
 */
export function saveTimelineToFile(
  data: TimelineData,
  filename = "timeline.json"
): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to save timeline data:", error);
    throw new Error("Failed to save timeline data");
  }
}

/**
 * Create backup of current timeline data
 */
export function createTimelineBackup(): void {
  const manager = TimelineDataManager.getInstance();
  const data = manager.getData();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `timeline-backup-${timestamp}.json`;

  saveTimelineToFile(data, filename);
}

/**
 * Validate timeline data and return detailed results
 */
export function validateTimelineData(data: unknown): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  statistics?: {
    milestoneCount: number;
    placementBalance: { left: number; right: number };
    averageDescriptionLength: number;
    missingPhotos: string[];
  };
} {
  const manager = TimelineDataManager.getInstance();
  const validation = manager.validateData(data);

  const result = {
    isValid: validation.isValid,
    errors: validation.errors || [],
    warnings: [] as string[],
    statistics: undefined as
      | {
          milestoneCount: number;
          placementBalance: { left: number; right: number };
          averageDescriptionLength: number;
          missingPhotos: string[];
        }
      | undefined,
  };

  if (validation.isValid && data) {
    const timelineData = data as TimelineData;
    const milestones = timelineData.milestones;

    // Generate statistics
    const leftCount = milestones.filter((m) => m.placement === "left").length;
    const rightCount = milestones.filter((m) => m.placement === "right").length;
    const missingPhotos = milestones
      .filter((m) => !m.photo.src || m.photo.src.includes("placeholder"))
      .map((m) => m.id);

    result.statistics = {
      milestoneCount: milestones.length,
      placementBalance: { left: leftCount, right: rightCount },
      averageDescriptionLength: Math.round(
        milestones.reduce((sum, m) => sum + m.description.length, 0) /
          milestones.length
      ),
      missingPhotos,
    };

    // Generate warnings
    if (Math.abs(leftCount - rightCount) > 1) {
      result.warnings.push(
        "Milestone placement is unbalanced (consider alternating left/right)"
      );
    }

    if (missingPhotos.length > 0) {
      result.warnings.push(
        `${missingPhotos.length} milestones have placeholder photos`
      );
    }

    const shortDescriptions = milestones.filter(
      (m) => m.description.length < 50
    );
    if (shortDescriptions.length > 0) {
      result.warnings.push(
        `${shortDescriptions.length} milestones have very short descriptions`
      );
    }
  }

  return result;
}

/**
 * Timeline data loader with caching
 */
class TimelineDataCache {
  private static instance: TimelineDataCache;
  private cachedData: TimelineData | null = null;
  private lastLoaded: number = 0;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): TimelineDataCache {
    if (!TimelineDataCache.instance) {
      TimelineDataCache.instance = new TimelineDataCache();
    }
    return TimelineDataCache.instance;
  }

  public async getTimelineData(
    forceReload = false
  ): Promise<TimelineLoadResult> {
    const now = Date.now();

    if (
      !forceReload &&
      this.cachedData &&
      now - this.lastLoaded < this.cacheTimeout
    ) {
      return {
        success: true,
        data: this.cachedData,
        warnings: ["Data loaded from cache"],
      };
    }

    const result = await loadTimelineFromJson();

    if (result.success && result.data) {
      this.cachedData = result.data;
      this.lastLoaded = now;
    }

    return result;
  }

  public clearCache(): void {
    this.cachedData = null;
    this.lastLoaded = 0;
  }

  public updateCache(data: TimelineData): void {
    this.cachedData = data;
    this.lastLoaded = Date.now();
  }
}

/**
 * Get cached timeline data
 */
export async function getCachedTimelineData(
  forceReload = false
): Promise<TimelineLoadResult> {
  const cache = TimelineDataCache.getInstance();
  return cache.getTimelineData(forceReload);
}

/**
 * Clear timeline data cache
 */
export function clearTimelineCache(): void {
  const cache = TimelineDataCache.getInstance();
  cache.clearCache();
}

/**
 * Update timeline cache with new data
 */
export function updateTimelineCache(data: TimelineData): void {
  const cache = TimelineDataCache.getInstance();
  cache.updateCache(data);
}

/**
 * Timeline data loader utilities
 */
export const timelineLoader = {
  loadFromJson: loadTimelineFromJson,
  loadFromUrl: loadTimelineFromUrl,
  loadFromFile: loadTimelineFromFile,
  saveToFile: saveTimelineToFile,
  createBackup: createTimelineBackup,
  validate: validateTimelineData,
  getCached: getCachedTimelineData,
  clearCache: clearTimelineCache,
  updateCache: updateTimelineCache,
};

export default timelineLoader;
