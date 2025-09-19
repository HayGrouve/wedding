import * as XLSX from "xlsx";
import { GuestRecord } from "@/types/admin";

export interface ExportOptions {
  dateFormat?: "iso" | "readable";
}

// Typed helper for setting worksheet column widths without using 'any'
type SheetWithCols = XLSX.WorkSheet & { [K in "!cols"]?: XLSX.ColInfo[] };
function setColumnWidths(sheet: XLSX.WorkSheet, cols: XLSX.ColInfo[]): void {
  (sheet as unknown as SheetWithCols)["!cols"] = cols;
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

  // Map internal menu codes to human labels
  const getMenuLabel = (choice?: string): string => {
    switch (choice) {
      case "meat":
        return "🥩 Месно";
      case "vegetarian":
        return "🥗 Вегетарианско";
      default:
        return "";
    }
  };

  // Format long allergy text into multiple lines
  const formatAllergies = (text?: string): string => {
    if (!text) return "";
    const parts = text
      .split(/[;,]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (parts.length > 1) return parts.join("\n");
    // Fallback: chunk by ~40 chars to encourage wrapping
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += 40) {
      chunks.push(text.slice(i, i + 40));
    }
    return chunks.join("\n");
  };

  const formatted: Record<string, string | number | Date> = {
    Име: guest.guestName,
    Имейл: guest.email,
    Телефон: guest.phone || "",
    Присъства: guest.attending ? "Да" : "Не",
    "+1": guest.plusOneAttending ? "Да" : "Не",
    "Име на +1": guest.plusOneName || "",
    "Брой деца": guest.childrenCount,
    "Деца (име/възраст)":
      guest.childrenDetails && guest.childrenDetails.length > 0
        ? guest.childrenDetails
            .map((c) =>
              c && typeof c === "object"
                ? `${c.name}${typeof c.age === "number" ? ` (${c.age})` : ""}`
                : String(c)
            )
            .join("\n")
        : "",
    Меню: getMenuLabel(
      (guest as unknown as { menuChoice?: string }).menuChoice
    ),
    "+1 Меню": guest.plusOneAttending
      ? getMenuLabel(
          (guest as unknown as { plusOneMenuChoice?: string }).plusOneMenuChoice
        )
      : "",
    Алергии: formatAllergies(guest.allergies),
    "Дата на изпращане":
      dateFormat === "iso"
        ? new Date(guest.submissionDate)
        : new Date(guest.submissionDate),
    "IP адрес": guest.ipAddress || "",
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
    sheetName = "Списък с гости",
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
  const columnWidths: XLSX.ColInfo[] = [
    { wch: 20 }, // Име
    { wch: 25 }, // Имейл
    { wch: 15 }, // Телефон
    { wch: 12 }, // Присъства
    { wch: 8 }, // +1
    { wch: 20 }, // Име на +1
    { wch: 12 }, // Брой деца
    { wch: 28 }, // Деца (име/възраст)
    { wch: 16 }, // Меню
    { wch: 16 }, // +1 Меню
    { wch: 22 }, // Алергии
    { wch: 22 }, // Дата на изпращане
    { wch: 15 }, // IP адрес
  ];
  setColumnWidths(worksheet, columnWidths);

  // Enable wrap text for multiline columns: children (H) and allergies (K)
  if (worksheet["!ref"]) {
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const wrapCols = [7, 10]; // H: children details, K: allergies
    for (let r = range.s.r + 1; r <= range.e.r; r++) {
      wrapCols.forEach((c) => {
        const addr = XLSX.utils.encode_cell({ r, c });
        type CellWithStyle = XLSX.CellObject & {
          s?: { alignment?: { wrapText?: boolean; vertical?: string } };
        };
        const cell = (
          worksheet as unknown as Record<string, CellWithStyle | undefined>
        )[addr];
        if (cell) {
          cell.s = {
            ...(cell.s || {}),
            alignment: {
              ...(cell.s?.alignment || {}),
              wrapText: true,
              vertical: "top",
            },
          };
        }
      });
    }
  }

  // Add main data sheet FIRST so Excel opens to the list by default
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Add metadata sheet if requested
  if (includeMetadata) {
    const totalChildrenAll = guests.reduce(
      (sum, g) => sum + g.childrenCount,
      0
    );
    const kidsMenuCount = guests.reduce(
      (sum, g) =>
        sum + (g.childrenDetails?.filter((c) => c.age < 12).length || 0),
      0
    );
    const totalGuestsInclKids = guests.length + totalChildrenAll;
    const attendingGuests = guests.filter((g) => g.attending);
    const notAttendingGuests = guests.filter((g) => !g.attending);
    const totalPlusOnes = attendingGuests.filter(
      (g) => g.plusOneAttending
    ).length;

    const metadataData = [
      { Показател: "Общ брой гости", Брой: totalGuestsInclKids },
      { Показател: "Присъстващи", Брой: attendingGuests.length },
      { Показател: "Неприсъстващи", Брой: notAttendingGuests.length },
      { Показател: "+1", Брой: totalPlusOnes },
      { Показател: "Общо деца", Брой: totalChildrenAll },
      { Показател: "Меню за деца (<12)", Брой: kidsMenuCount },
      {
        Показател: "Дата на експорт",
        Брой: new Date().toLocaleString("bg-BG"),
      },
    ];

    const metadataSheet = XLSX.utils.json_to_sheet(metadataData);
    setColumnWidths(metadataSheet, [{ wch: 25 }, { wch: 15 }]);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Обобщение");
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
    Име: guest.guestName,
    Имейл: guest.email,
    Статус: guest.attending ? "Присъства" : "Не присъства",
    "+1": guest.plusOneAttending ? guest.plusOneName || "Да" : "Не",
    Телефон: guest.phone || "",
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(emailData);

  // Set column widths
  setColumnWidths(worksheet, [
    { wch: 25 }, // Име
    { wch: 30 }, // Имейл
    { wch: 15 }, // Статус
    { wch: 10 }, // +1
    { wch: 15 }, // Телефон
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Имейл списък");

  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellDates: true,
    cellStyles: true,
  });

  return excelBuffer;
}
