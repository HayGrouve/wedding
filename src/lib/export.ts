import Papa from "papaparse";
import * as XLSX from "xlsx";
import { GuestRecord } from "@/types/admin";

export interface ExportOptions {
  delimiter?: string;
  includeHeaders?: boolean;
  filename?: string;
  dateFormat?: "iso" | "readable";
}

export interface CSVExportConfig extends ExportOptions {
  fields?: string[];
  customHeaders?: Record<string, string>;
}

// Default field mapping for CSV export
const DEFAULT_CSV_FIELDS = [
  "guestName",
  "email",
  "phone",
  "attending",
  "plusOneAttending",
  "plusOneName",
  "childrenCount",
  "dietaryPreference",
  "allergies",
  "submissionDate",
  "ipAddress",
];

// Human-readable headers for CSV
const DEFAULT_CSV_HEADERS: Record<string, string> = {
  guestName: "Guest Name",
  email: "Email",
  phone: "Phone",
  attending: "Attending",
  plusOneAttending: "Plus One Attending",
  plusOneName: "Plus One Name",
  childrenCount: "Number of Children",
  dietaryPreference: "Dietary Preference",
  allergies: "Allergies",
  submissionDate: "Submission Date",
  ipAddress: "IP Address",
};

/**
 * Formats a guest record for CSV export
 */
function formatGuestForCSV(
  guest: GuestRecord,
  options: CSVExportConfig = {}
): Record<string, string | number> {
  const { dateFormat = "readable" } = options;

  const formatted: Record<string, string | number> = {
    guestName: guest.guestName,
    email: guest.email,
    phone: guest.phone || "",
    attending: guest.attending ? "Yes" : "No",
    plusOneAttending: guest.plusOneAttending ? "Yes" : "No",
    plusOneName: guest.plusOneName || "",
    childrenCount: guest.childrenCount,
    dietaryPreference: guest.dietaryPreference || "",
    allergies: guest.allergies || "",
    submissionDate:
      dateFormat === "iso"
        ? guest.submissionDate
        : new Date(guest.submissionDate).toLocaleString("bg-BG"),
    ipAddress: guest.ipAddress || "",
  };

  return formatted;
}

/**
 * Exports guest data to CSV format
 */
export function exportGuestsToCSV(
  guests: GuestRecord[],
  config: CSVExportConfig = {}
): string {
  const {
    delimiter = ",",
    includeHeaders = true,
    fields = DEFAULT_CSV_FIELDS,
    customHeaders = DEFAULT_CSV_HEADERS,
    dateFormat = "readable",
  } = config;

  if (guests.length === 0) {
    throw new Error("No guest data to export");
  }

  // Format guest data
  const formattedGuests = guests.map((guest) =>
    formatGuestForCSV(guest, { dateFormat })
  );

  // Filter fields if specified
  const filteredData = formattedGuests.map((guest) => {
    const filtered: Record<string, string | number> = {};
    fields.forEach((field) => {
      if (guest.hasOwnProperty(field)) {
        const headerKey = customHeaders[field] || field;
        filtered[headerKey] = guest[field];
      }
    });
    return filtered;
  });

  // Generate CSV
  const csv = Papa.unparse(filteredData, {
    delimiter,
    header: includeHeaders,
    skipEmptyLines: true,
  });

  return csv;
}

/**
 * Downloads CSV data as a file
 */
export function downloadCSV(
  csvData: string,
  filename: string = "guests.csv"
): void {
  try {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
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
    console.error("Error downloading CSV:", error);
    throw new Error("Failed to download CSV file");
  }
}

/**
 * Validates guest data before export
 */
export function validateGuestDataForExport(guests: GuestRecord[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(guests)) {
    errors.push("Guest data must be an array");
    return { isValid: false, errors, warnings };
  }

  if (guests.length === 0) {
    warnings.push("No guest data to export");
  }

  guests.forEach((guest, index) => {
    // Check required fields
    if (!guest.guestName || guest.guestName.trim() === "") {
      errors.push(`Guest at index ${index} is missing a name`);
    }

    if (!guest.email || guest.email.trim() === "") {
      errors.push(`Guest at index ${index} is missing an email`);
    }

    // Check email format
    if (guest.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
      warnings.push(`Guest "${guest.guestName}" has an invalid email format`);
    }

    // Check submission date
    if (
      !guest.submissionDate ||
      isNaN(new Date(guest.submissionDate).getTime())
    ) {
      warnings.push(
        `Guest "${guest.guestName}" has an invalid submission date`
      );
    }

    // Check children count
    if (guest.childrenCount < 0) {
      warnings.push(`Guest "${guest.guestName}" has a negative children count`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Creates a summary export with attendance statistics
 */
export function exportAttendanceSummaryToCSV(guests: GuestRecord[]): string {
  const totalGuests = guests.length;
  const attendingGuests = guests.filter((g) => g.attending);
  const notAttendingGuests = guests.filter((g) => !g.attending);
  const totalPlusOnes = attendingGuests.filter(
    (g) => g.plusOneAttending
  ).length;
  const totalChildren = attendingGuests.reduce(
    (sum, g) => sum + g.childrenCount,
    0
  );

  // Dietary preferences breakdown
  const dietaryBreakdown = attendingGuests.reduce(
    (acc, guest) => {
      if (guest.dietaryPreference) {
        acc[guest.dietaryPreference] = (acc[guest.dietaryPreference] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const summaryData = [
    { Metric: "Total Guests", Count: totalGuests },
    { Metric: "Attending", Count: attendingGuests.length },
    { Metric: "Not Attending", Count: notAttendingGuests.length },
    { Metric: "Plus Ones", Count: totalPlusOnes },
    { Metric: "Total Children", Count: totalChildren },
    ...Object.entries(dietaryBreakdown).map(([pref, count]) => ({
      Metric: `Dietary - ${pref}`,
      Count: count,
    })),
  ];

  return Papa.unparse(summaryData, {
    header: true,
    skipEmptyLines: true,
  });
}

/**
 * Creates an email list export for communication
 */
export function exportEmailListToCSV(
  guests: GuestRecord[],
  attendingOnly: boolean = false
): string {
  let filteredGuests = guests;

  if (attendingOnly) {
    filteredGuests = guests.filter((g) => g.attending);
  }

  const emailData = filteredGuests.map((guest) => ({
    Name: guest.guestName,
    Email: guest.email,
    Status: guest.attending ? "Attending" : "Not Attending",
    "Plus One": guest.plusOneAttending ? guest.plusOneName || "Yes" : "No",
  }));

  return Papa.unparse(emailData, {
    header: true,
    skipEmptyLines: true,
  });
}

// Excel Export Interfaces and Configuration
export interface ExcelExportConfig extends ExportOptions {
  sheetName?: string;
  includeMetadata?: boolean;
  styling?: boolean;
}

/**
 * Formats a guest record for Excel export
 */
function formatGuestForExcel(
  guest: GuestRecord,
  options: ExcelExportConfig = {}
): Record<string, string | number | Date> {
  const { dateFormat = "readable" } = options;

  const formatted: Record<string, string | number | Date> = {
    "Guest Name": guest.guestName,
    Email: guest.email,
    Phone: guest.phone || "",
    Attending: guest.attending ? "Yes" : "No",
    "Plus One Attending": guest.plusOneAttending ? "Yes" : "No",
    "Plus One Name": guest.plusOneName || "",
    "Number of Children": guest.childrenCount,
    "Dietary Preference": guest.dietaryPreference || "",
    Allergies: guest.allergies || "",
    "Submission Date":
      dateFormat === "iso"
        ? new Date(guest.submissionDate)
        : new Date(guest.submissionDate),
    "IP Address": guest.ipAddress || "",
  };

  return formatted;
}

/**
 * Exports guest data to Excel format
 */
export function exportGuestsToExcel(
  guests: GuestRecord[],
  config: ExcelExportConfig = {}
): ArrayBuffer {
  const {
    sheetName = "Guest List",
    includeMetadata = true,
    dateFormat = "readable",
  } = config;

  if (guests.length === 0) {
    throw new Error("No guest data to export");
  }

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Format guest data for Excel
  const formattedGuests = guests.map((guest) =>
    formatGuestForExcel(guest, { dateFormat })
  );

  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(formattedGuests);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 20 }, // Guest Name
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 12 }, // Attending
    { wch: 15 }, // Plus One Attending
    { wch: 20 }, // Plus One Name
    { wch: 12 }, // Number of Children
    { wch: 18 }, // Dietary Preference
    { wch: 25 }, // Allergies
    { wch: 20 }, // Submission Date
    { wch: 15 }, // IP Address
  ];
  worksheet["!cols"] = columnWidths;

  // Add metadata sheet if requested
  if (includeMetadata) {
    const totalGuests = guests.length;
    const attendingGuests = guests.filter((g) => g.attending);
    const notAttendingGuests = guests.filter((g) => !g.attending);
    const totalPlusOnes = attendingGuests.filter(
      (g) => g.plusOneAttending
    ).length;
    const totalChildren = attendingGuests.reduce(
      (sum, g) => sum + g.childrenCount,
      0
    );

    const metadataData = [
      { Metric: "Total Guests", Count: totalGuests },
      { Metric: "Attending", Count: attendingGuests.length },
      { Metric: "Not Attending", Count: notAttendingGuests.length },
      { Metric: "Plus Ones", Count: totalPlusOnes },
      { Metric: "Total Children", Count: totalChildren },
      { Metric: "Export Date", Count: new Date().toLocaleString("bg-BG") },
    ];

    const metadataSheet = XLSX.utils.json_to_sheet(metadataData);
    metadataSheet["!cols"] = [{ wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Summary");
  }

  // Add main data sheet
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellDates: true,
    cellStyles: true,
  });

  return excelBuffer;
}

/**
 * Downloads Excel data as a file
 */
export function downloadExcel(
  excelBuffer: ArrayBuffer,
  filename: string = "guests.xlsx"
): void {
  try {
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
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
    console.error("Error downloading Excel:", error);
    throw new Error("Failed to download Excel file");
  }
}

/**
 * Creates an Excel attendance summary with multiple sheets
 */
export function exportAttendanceSummaryToExcel(
  guests: GuestRecord[]
): ArrayBuffer {
  const workbook = XLSX.utils.book_new();

  // Summary statistics
  const totalGuests = guests.length;
  const attendingGuests = guests.filter((g) => g.attending);
  const notAttendingGuests = guests.filter((g) => !g.attending);
  const totalPlusOnes = attendingGuests.filter(
    (g) => g.plusOneAttending
  ).length;
  const totalChildren = attendingGuests.reduce(
    (sum, g) => sum + g.childrenCount,
    0
  );

  // Dietary preferences breakdown
  const dietaryBreakdown = attendingGuests.reduce(
    (acc, guest) => {
      if (guest.dietaryPreference) {
        acc[guest.dietaryPreference] = (acc[guest.dietaryPreference] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // Summary sheet
  const summaryData = [
    { Metric: "Total Guests", Count: totalGuests },
    { Metric: "Attending", Count: attendingGuests.length },
    { Metric: "Not Attending", Count: notAttendingGuests.length },
    { Metric: "Plus Ones", Count: totalPlusOnes },
    { Metric: "Total Children", Count: totalChildren },
    ...Object.entries(dietaryBreakdown).map(([pref, count]) => ({
      Metric: `Dietary - ${pref}`,
      Count: count,
    })),
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Attending guests sheet
  if (attendingGuests.length > 0) {
    const attendingData = attendingGuests.map((guest) =>
      formatGuestForExcel(guest)
    );
    const attendingSheet = XLSX.utils.json_to_sheet(attendingData);
    attendingSheet["!cols"] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 18 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(workbook, attendingSheet, "Attending");
  }

  // Not attending guests sheet
  if (notAttendingGuests.length > 0) {
    const notAttendingData = notAttendingGuests.map((guest) =>
      formatGuestForExcel(guest)
    );
    const notAttendingSheet = XLSX.utils.json_to_sheet(notAttendingData);
    notAttendingSheet["!cols"] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 18 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(workbook, notAttendingSheet, "Not Attending");
  }

  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellDates: true,
    cellStyles: true,
  });

  return excelBuffer;
}

/**
 * Creates an Excel email list export
 */
export function exportEmailListToExcel(
  guests: GuestRecord[],
  attendingOnly: boolean = false
): ArrayBuffer {
  let filteredGuests = guests;

  if (attendingOnly) {
    filteredGuests = guests.filter((g) => g.attending);
  }

  const emailData = filteredGuests.map((guest) => ({
    Name: guest.guestName,
    Email: guest.email,
    Status: guest.attending ? "Attending" : "Not Attending",
    "Plus One": guest.plusOneAttending ? guest.plusOneName || "Yes" : "No",
    Phone: guest.phone || "",
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(emailData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 25 }, // Name
    { wch: 30 }, // Email
    { wch: 15 }, // Status
    { wch: 20 }, // Plus One
    { wch: 15 }, // Phone
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Email List");

  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellDates: true,
    cellStyles: true,
  });

  return excelBuffer;
}
