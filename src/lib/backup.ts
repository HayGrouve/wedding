import { GuestRecord } from "@/types/admin";

export interface BackupMetadata {
  version: string;
  timestamp: string;
  totalGuests: number;
  source: string;
  checksum?: string;
}

export interface BackupData {
  metadata: BackupMetadata;
  guests: GuestRecord[];
}

export interface RestoreResult {
  success: boolean;
  restored: number;
  skipped: number;
  errors: string[];
  warnings: string[];
}

export interface BackupValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: BackupMetadata;
}

/**
 * Generates a simple checksum for data integrity
 */
function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Creates a backup of guest data
 */
export function createBackup(guests: GuestRecord[]): BackupData {
  const guestDataString = JSON.stringify(guests);
  const metadata: BackupMetadata = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    totalGuests: guests.length,
    source: "wedding-website-admin",
    checksum: generateChecksum(guestDataString),
  };

  return {
    metadata,
    guests: [...guests], // Create a deep copy
  };
}

/**
 * Exports backup data as a JSON file
 */
export function exportBackup(guests: GuestRecord[], filename?: string): void {
  try {
    const backup = createBackup(guests);
    const backupJson = JSON.stringify(backup, null, 2);

    const defaultFilename = `wedding-guests-backup-${new Date().toISOString().split("T")[0]}.json`;
    const finalFilename = filename || defaultFilename;

    const blob = new Blob([backupJson], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", finalFilename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      throw new Error("Browser does not support file downloads");
    }
  } catch (error) {
    console.error("Error creating backup:", error);
    throw new Error("Failed to create backup file");
  }
}

/**
 * Validates backup file data
 */
export function validateBackupData(
  backupData: unknown
): BackupValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if it's a valid backup format
  if (!backupData || typeof backupData !== "object") {
    errors.push("Invalid backup file format");
    return { isValid: false, errors, warnings };
  }

  const data = backupData as Record<string, unknown>;

  if (!data.metadata || !data.guests) {
    errors.push("Backup file is missing required fields (metadata, guests)");
    return { isValid: false, errors, warnings };
  }

  const metadata = data.metadata as Record<string, unknown>;
  const guests = data.guests;

  // Validate metadata
  if (!metadata.version) {
    errors.push("Backup metadata is missing version");
  }

  if (!metadata.timestamp) {
    errors.push("Backup metadata is missing timestamp");
  } else if (typeof metadata.timestamp === "string") {
    const timestamp = new Date(metadata.timestamp);
    if (isNaN(timestamp.getTime())) {
      errors.push("Backup metadata has invalid timestamp");
    }
  } else {
    errors.push("Backup metadata has invalid timestamp format");
  }

  if (typeof metadata.totalGuests !== "number") {
    errors.push("Backup metadata is missing or has invalid totalGuests");
  }

  // Validate guests array
  if (!Array.isArray(guests)) {
    errors.push("Backup guests data is not an array");
    return { isValid: false, errors, warnings };
  }

  if (guests.length !== metadata.totalGuests) {
    warnings.push(
      `Guest count mismatch: metadata says ${metadata.totalGuests}, found ${guests.length}`
    );
  }

  // Validate checksum if present
  if (metadata.checksum) {
    const guestDataString = JSON.stringify(guests);
    const calculatedChecksum = generateChecksum(guestDataString);
    if (calculatedChecksum !== metadata.checksum) {
      warnings.push("Backup checksum mismatch - data may have been modified");
    }
  }

  // Validate individual guest records
  guests.forEach((guest: unknown) => {
    if (!guest || typeof guest !== "object") {
      errors.push(`Guest is not a valid object`);
      return;
    }

    const guestObj = guest as Record<string, unknown>;

    // Check required fields
    if (!guestObj.guestName || typeof guestObj.guestName !== "string") {
      errors.push(`Guest is missing or has invalid name`);
    }

    if (!guestObj.email || typeof guestObj.email !== "string") {
      errors.push(`Guest is missing or has invalid email`);
    }

    if (typeof guestObj.attending !== "boolean") {
      errors.push(`Guest has invalid attendance status`);
    }

    // Validate email format
    if (
      typeof guestObj.email === "string" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestObj.email)
    ) {
      const guestName =
        typeof guestObj.guestName === "string" ? guestObj.guestName : "Unknown";
      warnings.push(`Guest "${guestName}" has invalid email format`);
    }

    // Validate submission date
    if (
      guestObj.submissionDate &&
      typeof guestObj.submissionDate === "string"
    ) {
      const date = new Date(guestObj.submissionDate);
      if (isNaN(date.getTime())) {
        const guestName =
          typeof guestObj.guestName === "string"
            ? guestObj.guestName
            : "Unknown";
        warnings.push(`Guest "${guestName}" has invalid submission date`);
      }
    }
  });

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    metadata: isValid ? (metadata as unknown as BackupMetadata) : undefined,
  };
}

/**
 * Processes a backup file upload
 */
export function processBackupFile(file: File): Promise<BackupValidationResult> {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve({
        isValid: false,
        errors: ["No file provided"],
        warnings: [],
      });
      return;
    }

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      resolve({
        isValid: false,
        errors: ["File must be a JSON file"],
        warnings: [],
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const backupData = JSON.parse(content);
        const validation = validateBackupData(backupData);
        resolve(validation);
      } catch {
        resolve({
          isValid: false,
          errors: ["Invalid JSON file format"],
          warnings: [],
        });
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read backup file"));
    };

    reader.readAsText(file);
  });
}

/**
 * Restores guest data from backup (simulation - would need actual API integration)
 */
export function simulateRestoreFromBackup(
  backupData: BackupData,
  existingGuests: GuestRecord[] = []
): RestoreResult {
  const result: RestoreResult = {
    success: false,
    restored: 0,
    skipped: 0,
    errors: [],
    warnings: [],
  };

  try {
    // Validate backup first
    const validation = validateBackupData(backupData);

    if (!validation.isValid) {
      result.errors = validation.errors;
      return result;
    }

    // Add any warnings from validation
    result.warnings = [...validation.warnings];

    // Create a map of existing guests by email for duplicate detection
    const existingGuestsMap = new Map(
      existingGuests.map((guest) => [guest.email.toLowerCase(), guest])
    );

    // Process each guest from backup
    backupData.guests.forEach((guest) => {
      const emailKey = guest.email.toLowerCase();

      if (existingGuestsMap.has(emailKey)) {
        result.skipped++;
        result.warnings.push(
          `Skipped guest "${guest.guestName}" - email already exists`
        );
      } else {
        result.restored++;
        // In a real implementation, this would call the API to add the guest
      }
    });

    result.success = true;

    if (result.restored > 0) {
      result.warnings.push(
        `In a real implementation, ${result.restored} guests would be added to the database`
      );
    }
  } catch (err) {
    result.errors.push(
      `Restore failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }

  return result;
}

/**
 * Enhanced email export formats for communication platforms
 */
export interface EmailPlatformConfig {
  platform: "mailchimp" | "constant-contact" | "sendgrid" | "generic";
  includeNames?: boolean;
  includePhones?: boolean;
  includeDietary?: boolean;
  format?: "csv" | "txt";
}

/**
 * Exports email list optimized for specific communication platforms
 */
export function exportEmailsForPlatform(
  guests: GuestRecord[],
  config: EmailPlatformConfig,
  attendingOnly: boolean = false
): string {
  const filteredGuests = attendingOnly
    ? guests.filter((guest) => guest.attending)
    : guests;

  if (filteredGuests.length === 0) {
    throw new Error("No guests to export");
  }

  const {
    platform,
    includeNames = true,
    includePhones = false,
    includeDietary = false,
    format = "csv",
  } = config;

  switch (platform) {
    case "mailchimp":
      return exportMailchimpFormat(filteredGuests, {
        includeNames,
        includePhones,
      });

    case "constant-contact":
      return exportConstantContactFormat(filteredGuests, {
        includeNames,
        includePhones,
      });

    case "sendgrid":
      return exportSendGridFormat(filteredGuests, {
        includeNames,
        includeDietary,
      });

    case "generic":
    default:
      return exportGenericEmailFormat(filteredGuests, {
        includeNames,
        includePhones,
        includeDietary,
        format,
      });
  }
}

interface MailchimpOptions {
  includeNames?: boolean;
  includePhones?: boolean;
}

function exportMailchimpFormat(
  guests: GuestRecord[],
  options: MailchimpOptions
): string {
  const headers = ["Email Address"];
  if (options.includeNames) {
    headers.push("First Name", "Last Name");
  }
  if (options.includePhones) {
    headers.push("Phone");
  }

  const data = guests.map((guest) => {
    const row: string[] = [guest.email];

    if (options.includeNames) {
      const [firstName = "", ...lastNameParts] = guest.guestName.split(" ");
      const lastName = lastNameParts.join(" ");
      row.push(firstName, lastName);
    }

    if (options.includePhones) {
      row.push(guest.phone || "");
    }

    return row;
  });

  return [headers, ...data].map((row) => row.join(",")).join("\n");
}

interface ConstantContactOptions {
  includeNames?: boolean;
  includePhones?: boolean;
}

function exportConstantContactFormat(
  guests: GuestRecord[],
  options: ConstantContactOptions
): string {
  const headers = ["Email"];
  if (options.includeNames) {
    headers.push("First Name", "Last Name");
  }
  if (options.includePhones) {
    headers.push("Work Phone");
  }

  const data = guests.map((guest) => {
    const row: string[] = [guest.email];

    if (options.includeNames) {
      const [firstName = "", ...lastNameParts] = guest.guestName.split(" ");
      const lastName = lastNameParts.join(" ");
      row.push(firstName, lastName);
    }

    if (options.includePhones) {
      row.push(guest.phone || "");
    }

    return row;
  });

  return [headers, ...data].map((row) => row.join(",")).join("\n");
}

interface SendGridOptions {
  includeNames?: boolean;
  includeDietary?: boolean;
}

function exportSendGridFormat(
  guests: GuestRecord[],
  options: SendGridOptions
): string {
  const headers = ["email"];
  if (options.includeNames) {
    headers.push("first_name", "last_name");
  }
  if (options.includeDietary) {
    headers.push("dietary_preference");
  }

  const data = guests.map((guest) => {
    const row: string[] = [guest.email];

    if (options.includeNames) {
      const [firstName = "", ...lastNameParts] = guest.guestName.split(" ");
      const lastName = lastNameParts.join(" ");
      row.push(firstName, lastName);
    }

    if (options.includeDietary) {
      row.push(guest.dietaryPreference || "");
    }

    return row;
  });

  return [headers, ...data].map((row) => row.join(",")).join("\n");
}

interface GenericEmailOptions {
  includeNames?: boolean;
  includePhones?: boolean;
  includeDietary?: boolean;
  format?: "csv" | "txt";
}

function exportGenericEmailFormat(
  guests: GuestRecord[],
  options: GenericEmailOptions
): string {
  if (options.format === "txt") {
    return guests.map((guest) => guest.email).join("\n");
  }

  // CSV format
  const headers = ["Email"];
  if (options.includeNames) {
    headers.push("Name");
  }
  if (options.includePhones) {
    headers.push("Phone");
  }
  if (options.includeDietary) {
    headers.push("Dietary Preference");
  }

  const data = guests.map((guest) => {
    const row: string[] = [guest.email];

    if (options.includeNames) {
      row.push(guest.guestName);
    }

    if (options.includePhones) {
      row.push(guest.phone || "");
    }

    if (options.includeDietary) {
      row.push(guest.dietaryPreference || "");
    }

    return row;
  });

  return [headers, ...data].map((row) => row.join(",")).join("\n");
}

/**
 * Downloads email export for communication platforms
 */
export function downloadEmailExport(
  emailData: string,
  platform: string,
  attendingOnly: boolean = false,
  format: string = "csv"
): void {
  try {
    const timestamp = new Date().toISOString().split("T")[0];
    const attendingSuffix = attendingOnly ? "-attending" : "-all";
    const filename = `wedding-emails-${platform}${attendingSuffix}-${timestamp}.${format}`;

    const mimeType = format === "csv" ? "text/csv" : "text/plain";
    const blob = new Blob([emailData], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      throw new Error("Browser does not support file downloads");
    }
  } catch (error) {
    console.error("Error downloading email export:", error);
    throw new Error("Failed to download email export file");
  }
}
