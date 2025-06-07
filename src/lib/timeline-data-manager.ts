import { z } from "zod";
import { TimelineData, TimelineMilestone } from "@/types/timeline";
import { timelineData } from "@/data/timeline-data";

/**
 * Timeline Data Management System
 *
 * Provides comprehensive data management for timeline milestones including:
 * - Data validation using Zod schemas
 * - Content versioning and migration
 * - Data fetching and transformation utilities
 * - TypeScript strict mode compliance
 */

// Zod validation schemas
export const TimelinePhotoSchema = z.object({
  src: z.string().url("Photo source must be a valid URL"),
  alt: z.string().min(1, "Alt text is required for accessibility"),
  width: z.number().positive("Width must be a positive number"),
  height: z.number().positive("Height must be a positive number"),
  caption: z.string().optional(),
});

export const TimelineMilestoneSchema = z.object({
  id: z.string().min(1, "Milestone ID is required"),
  date: z.string().min(1, "Date is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  photo: TimelinePhotoSchema,
  placement: z.enum(["left", "right"]),
  order: z.number().optional(),
});

export const TimelineMetadataSchema = z.object({
  title: z.string().min(1, "Timeline title is required"),
  subtitle: z.string().min(1, "Timeline subtitle is required"),
  couple: z.object({
    bride: z.string().min(1, "Bride name is required"),
    groom: z.string().min(1, "Groom name is required"),
  }),
  lastUpdated: z.string().datetime("Last updated must be a valid ISO date"),
});

export const TimelineDataSchema = z.object({
  milestones: z
    .array(TimelineMilestoneSchema)
    .min(1, "At least one milestone is required"),
  metadata: TimelineMetadataSchema,
});

// Data versioning schema
export const TimelineVersionSchema = z.object({
  version: z.string(),
  timestamp: z.string().datetime(),
  data: TimelineDataSchema,
  migrationNotes: z.string().optional(),
});

/**
 * Timeline Data Manager Class
 */
export class TimelineDataManager {
  private static instance: TimelineDataManager;
  private currentData: TimelineData;
  private versions: Array<z.infer<typeof TimelineVersionSchema>> = [];

  private constructor() {
    this.currentData = timelineData;
    this.validateCurrentData();
  }

  /**
   * Singleton pattern for data manager
   */
  public static getInstance(): TimelineDataManager {
    if (!TimelineDataManager.instance) {
      TimelineDataManager.instance = new TimelineDataManager();
    }
    return TimelineDataManager.instance;
  }

  /**
   * Validate timeline data against schema
   */
  public validateData(data: unknown): { isValid: boolean; errors?: string[] } {
    try {
      TimelineDataSchema.parse(data);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          ),
        };
      }
      return {
        isValid: false,
        errors: ["Unknown validation error"],
      };
    }
  }

  /**
   * Validate current data
   */
  private validateCurrentData(): void {
    const validation = this.validateData(this.currentData);
    if (!validation.isValid) {
      console.warn("Timeline data validation warnings:", validation.errors);
    }
  }

  /**
   * Get current timeline data
   */
  public getData(): TimelineData {
    return { ...this.currentData };
  }

  /**
   * Get milestones with enhanced sorting and filtering
   */
  public getMilestones(
    options: {
      sortBy?: "order" | "date" | "title";
      filterBy?: {
        placement?: "left" | "right";
        dateRange?: { start: string; end: string };
      };
      limit?: number;
    } = {}
  ): TimelineMilestone[] {
    let milestones = [...this.currentData.milestones];

    // Apply filters
    if (options.filterBy?.placement) {
      milestones = milestones.filter(
        (m) => m.placement === options.filterBy!.placement
      );
    }

    // Apply sorting
    switch (options.sortBy) {
      case "order":
        milestones.sort((a, b) => (a.order || 0) - (b.order || 0));
        break;
      case "title":
        milestones.sort((a, b) => a.title.localeCompare(b.title, "bg"));
        break;
      case "date":
      default:
        milestones.sort((a, b) => (a.order || 0) - (b.order || 0));
        break;
    }

    // Apply limit
    if (options.limit && options.limit > 0) {
      milestones = milestones.slice(0, options.limit);
    }

    return milestones;
  }

  /**
   * Get milestone by ID with validation
   */
  public getMilestoneById(id: string): TimelineMilestone | null {
    if (!id || typeof id !== "string") {
      return null;
    }
    return this.currentData.milestones.find((m) => m.id === id) || null;
  }

  /**
   * Get milestones with auto-alternating placement
   */
  public getMilestonesWithAutoPlacement(): TimelineMilestone[] {
    const sorted = this.getMilestones({ sortBy: "order" });
    return sorted.map((milestone, index) => ({
      ...milestone,
      placement: (index % 2 === 0 ? "left" : "right") as "left" | "right",
    }));
  }

  /**
   * Get navigation helpers for a milestone
   */
  public getMilestoneNavigation(currentId: string): {
    current: TimelineMilestone | null;
    previous: TimelineMilestone | null;
    next: TimelineMilestone | null;
    index: number;
    total: number;
  } {
    const sorted = this.getMilestones({ sortBy: "order" });
    const currentIndex = sorted.findIndex((m) => m.id === currentId);

    return {
      current: currentIndex !== -1 ? sorted[currentIndex] : null,
      previous: currentIndex > 0 ? sorted[currentIndex - 1] : null,
      next:
        currentIndex !== -1 && currentIndex < sorted.length - 1
          ? sorted[currentIndex + 1]
          : null,
      index: currentIndex,
      total: sorted.length,
    };
  }

  /**
   * Create a new version snapshot
   */
  public createVersion(notes?: string): string {
    const version = `v${Date.now()}`;
    const versionData = {
      version,
      timestamp: new Date().toISOString(),
      data: { ...this.currentData },
      migrationNotes: notes,
    };

    this.versions.push(versionData);
    return version;
  }

  /**
   * Get all versions
   */
  public getVersions(): Array<z.infer<typeof TimelineVersionSchema>> {
    return [...this.versions];
  }

  /**
   * Restore from version
   */
  public restoreFromVersion(version: string): boolean {
    const versionData = this.versions.find((v) => v.version === version);
    if (!versionData) {
      return false;
    }

    const validation = this.validateData(versionData.data);
    if (!validation.isValid) {
      console.error("Cannot restore from invalid version:", validation.errors);
      return false;
    }

    this.currentData = versionData.data;
    return true;
  }

  /**
   * Update timeline data with validation
   */
  public updateData(newData: TimelineData, createBackup = true): boolean {
    const validation = this.validateData(newData);
    if (!validation.isValid) {
      console.error("Cannot update with invalid data:", validation.errors);
      return false;
    }

    if (createBackup) {
      this.createVersion("Auto-backup before update");
    }

    this.currentData = { ...newData };
    return true;
  }

  /**
   * Add new milestone with validation
   */
  public addMilestone(milestone: Omit<TimelineMilestone, "order">): boolean {
    const newMilestone: TimelineMilestone = {
      ...milestone,
      order: this.currentData.milestones.length + 1,
    };

    const validation = this.validateData({
      ...this.currentData,
      milestones: [...this.currentData.milestones, newMilestone],
    });

    if (!validation.isValid) {
      console.error("Cannot add invalid milestone:", validation.errors);
      return false;
    }

    this.createVersion("Added new milestone");
    this.currentData.milestones.push(newMilestone);
    this.updateMetadata();
    return true;
  }

  /**
   * Update existing milestone
   */
  public updateMilestone(
    id: string,
    updates: Partial<TimelineMilestone>
  ): boolean {
    const index = this.currentData.milestones.findIndex((m) => m.id === id);
    if (index === -1) {
      return false;
    }

    const updatedMilestone = {
      ...this.currentData.milestones[index],
      ...updates,
    };
    const newMilestones = [...this.currentData.milestones];
    newMilestones[index] = updatedMilestone;

    const validation = this.validateData({
      ...this.currentData,
      milestones: newMilestones,
    });

    if (!validation.isValid) {
      console.error("Cannot update with invalid milestone:", validation.errors);
      return false;
    }

    this.createVersion(`Updated milestone: ${id}`);
    this.currentData.milestones = newMilestones;
    this.updateMetadata();
    return true;
  }

  /**
   * Remove milestone
   */
  public removeMilestone(id: string): boolean {
    const index = this.currentData.milestones.findIndex((m) => m.id === id);
    if (index === -1) {
      return false;
    }

    this.createVersion(`Removed milestone: ${id}`);
    this.currentData.milestones.splice(index, 1);
    this.reorderMilestones();
    this.updateMetadata();
    return true;
  }

  /**
   * Reorder milestones
   */
  private reorderMilestones(): void {
    this.currentData.milestones.forEach((milestone, index) => {
      milestone.order = index + 1;
    });
  }

  /**
   * Update metadata timestamp
   */
  private updateMetadata(): void {
    this.currentData.metadata.lastUpdated = new Date().toISOString();
  }

  /**
   * Export data as JSON
   */
  public exportData(): string {
    return JSON.stringify(this.currentData, null, 2);
  }

  /**
   * Import data from JSON
   */
  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      return this.updateData(data, true);
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  }

  /**
   * Get data statistics
   */
  public getStatistics(): {
    totalMilestones: number;
    leftPlacement: number;
    rightPlacement: number;
    averageDescriptionLength: number;
    lastUpdated: string;
    hasValidPhotos: number;
  } {
    const milestones = this.currentData.milestones;

    return {
      totalMilestones: milestones.length,
      leftPlacement: milestones.filter((m) => m.placement === "left").length,
      rightPlacement: milestones.filter((m) => m.placement === "right").length,
      averageDescriptionLength: Math.round(
        milestones.reduce((sum, m) => sum + m.description.length, 0) /
          milestones.length
      ),
      lastUpdated: this.currentData.metadata.lastUpdated,
      hasValidPhotos: milestones.filter((m) => m.photo.src && m.photo.alt)
        .length,
    };
  }
}

/**
 * Data migration utilities
 */
export class TimelineDataMigrator {
  /**
   * Migrate data from version 1.0 to current
   */
  static migrateFromV1(oldData: unknown): TimelineData | null {
    try {
      // Type guard for old data structure
      if (
        typeof oldData === "object" &&
        oldData !== null &&
        "timeline" in oldData &&
        Array.isArray((oldData as Record<string, unknown>).timeline)
      ) {
        const data = oldData as Record<string, unknown>;
        const timeline = data.timeline as Array<Record<string, unknown>>;

        return {
          milestones: timeline.map((item, index) => ({
            id: (item.id as string) || `milestone-${index}`,
            date: (item.date as string) || "Unknown",
            title: (item.title as string) || "Untitled",
            description: (item.description as string) || "",
            photo: {
              src:
                (item.image as string) ||
                ((item.photo as Record<string, unknown>)?.src as string) ||
                "/images/placeholder.jpg",
              alt:
                (item.alt as string) ||
                ((item.photo as Record<string, unknown>)?.alt as string) ||
                "Timeline photo",
              width:
                ((item.photo as Record<string, unknown>)?.width as number) ||
                400,
              height:
                ((item.photo as Record<string, unknown>)?.height as number) ||
                300,
              caption:
                (item.caption as string) ||
                ((item.photo as Record<string, unknown>)?.caption as string),
            },
            placement:
              (item.placement as "left" | "right") ||
              (index % 2 === 0 ? "left" : "right"),
            order: (item.order as number) || index + 1,
          })),
          metadata: {
            title: (data.title as string) || "Our Love Story",
            subtitle: (data.subtitle as string) || "Our journey together",
            couple: {
              bride: (data.bride as string) || "Bride",
              groom: (data.groom as string) || "Groom",
            },
            lastUpdated: new Date().toISOString(),
          },
        };
      }
      return null;
    } catch (error) {
      console.error("Migration failed:", error);
      return null;
    }
  }

  /**
   * Auto-detect and migrate data
   */
  static autoMigrate(data: unknown): TimelineData | null {
    // Try current format first
    const manager = TimelineDataManager.getInstance();
    const validation = manager.validateData(data);

    if (validation.isValid) {
      return data as TimelineData;
    }

    // Try v1 migration
    const migrated = this.migrateFromV1(data);
    if (migrated) {
      const migratedValidation = manager.validateData(migrated);
      if (migratedValidation.isValid) {
        return migrated;
      }
    }

    return null;
  }
}

/**
 * Utility functions for timeline data management
 */
export const timelineUtils = {
  /**
   * Get timeline data manager instance
   */
  getManager: () => TimelineDataManager.getInstance(),

  /**
   * Quick access to current data
   */
  getData: () => TimelineDataManager.getInstance().getData(),

  /**
   * Quick access to milestones
   */
  getMilestones: (
    options?: Parameters<TimelineDataManager["getMilestones"]>[0]
  ) => TimelineDataManager.getInstance().getMilestones(options),

  /**
   * Quick validation
   */
  validate: (data: unknown) =>
    TimelineDataManager.getInstance().validateData(data),

  /**
   * Quick statistics
   */
  getStats: () => TimelineDataManager.getInstance().getStatistics(),
};

export default TimelineDataManager;
