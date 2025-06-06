"use client";

import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Users,
  Mail,
  BarChart3,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { GuestRecord } from "@/types/admin";
import {
  exportGuestsToCSV,
  downloadCSV,
  exportGuestsToExcel,
  downloadExcel,
  exportAttendanceSummaryToCSV,
  exportAttendanceSummaryToExcel,
  exportEmailListToCSV,
  exportEmailListToExcel,
  validateGuestDataForExport,
} from "@/lib/export";

interface ExportDropdownProps {
  guests: GuestRecord[];
  filteredGuests: GuestRecord[];
  isFiltered: boolean;
}

export function ExportDropdown({
  guests,
  filteredGuests,
  isFiltered,
}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (
    exportType: "csv" | "excel",
    dataType: "all" | "filtered" | "summary" | "email",
    emailAttendingOnly: boolean = false
  ) => {
    setIsExporting(true);

    try {
      // Determine which data to export
      const dataToExport = dataType === "all" ? guests : filteredGuests;

      // Validate data before export
      const validation = validateGuestDataForExport(dataToExport);

      if (!validation.isValid) {
        toast.error(`Export failed: ${validation.errors.join(", ")}`);
        return;
      }

      if (validation.warnings.length > 0) {
        toast.warning(`Export warnings: ${validation.warnings.join(", ")}`);
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const baseFilename = `wedding-guests-${timestamp}`;

      if (exportType === "csv") {
        let csvData: string;
        let filename: string;

        switch (dataType) {
          case "summary":
            csvData = exportAttendanceSummaryToCSV(dataToExport);
            filename = `${baseFilename}-summary.csv`;
            break;
          case "email":
            csvData = exportEmailListToCSV(dataToExport, emailAttendingOnly);
            filename = `${baseFilename}-email-list.csv`;
            break;
          default:
            csvData = exportGuestsToCSV(dataToExport);
            filename = `${baseFilename}${isFiltered && dataType === "filtered" ? "-filtered" : ""}.csv`;
        }

        downloadCSV(csvData, filename);
      } else {
        let excelBuffer: ArrayBuffer;
        let filename: string;

        switch (dataType) {
          case "summary":
            excelBuffer = exportAttendanceSummaryToExcel(dataToExport);
            filename = `${baseFilename}-summary.xlsx`;
            break;
          case "email":
            excelBuffer = exportEmailListToExcel(
              dataToExport,
              emailAttendingOnly
            );
            filename = `${baseFilename}-email-list.xlsx`;
            break;
          default:
            excelBuffer = exportGuestsToExcel(dataToExport, {
              sheetName:
                isFiltered && dataType === "filtered"
                  ? "Filtered Guests"
                  : "Guest List",
              includeMetadata: true,
            });
            filename = `${baseFilename}${isFiltered && dataType === "filtered" ? "-filtered" : ""}.xlsx`;
        }

        downloadExcel(excelBuffer, filename);
      }

      // Success message
      const exportedCount = dataToExport.length;
      const dataTypeLabel =
        dataType === "all"
          ? "all guests"
          : dataType === "filtered"
            ? "filtered guests"
            : dataType === "summary"
              ? "attendance summary"
              : "email list";

      toast.success(
        `Successfully exported ${exportedCount} ${dataTypeLabel} as ${exportType.toUpperCase()}`
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error(
        `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      label: "All Guests",
      description: `Export all ${guests.length} guests`,
      icon: Users,
      actions: [
        { label: "CSV", action: () => handleExport("csv", "all") },
        { label: "Excel", action: () => handleExport("excel", "all") },
      ],
    },
    ...(isFiltered
      ? [
          {
            label: "Filtered Results",
            description: `Export ${filteredGuests.length} filtered guests`,
            icon: Users,
            actions: [
              { label: "CSV", action: () => handleExport("csv", "filtered") },
              {
                label: "Excel",
                action: () => handleExport("excel", "filtered"),
              },
            ],
          },
        ]
      : []),
    {
      label: "Attendance Summary",
      description: "Export statistics and breakdown",
      icon: BarChart3,
      actions: [
        { label: "CSV", action: () => handleExport("csv", "summary") },
        { label: "Excel", action: () => handleExport("excel", "summary") },
      ],
    },
    {
      label: "Email List (All)",
      description: "Export contact information",
      icon: Mail,
      actions: [
        { label: "CSV", action: () => handleExport("csv", "email", false) },
        { label: "Excel", action: () => handleExport("excel", "email", false) },
      ],
    },
    {
      label: "Email List (Attending)",
      description: "Export attending guests only",
      icon: Mail,
      actions: [
        { label: "CSV", action: () => handleExport("csv", "email", true) },
        { label: "Excel", action: () => handleExport("excel", "email", true) },
      ],
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isExporting || guests.length === 0}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {exportOptions.map((option, index) => (
          <div key={index}>
            <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium">
              <option.icon className="h-4 w-4" />
              {option.label}
            </DropdownMenuLabel>
            <div className="px-2 pb-2">
              <p className="text-xs text-muted-foreground mb-2">
                {option.description}
              </p>
              <div className="flex gap-1">
                {option.actions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    variant="ghost"
                    size="sm"
                    onClick={action.action}
                    disabled={isExporting}
                    className="h-7 px-2 text-xs flex items-center gap-1"
                  >
                    {action.label === "CSV" ? (
                      <FileText className="h-3 w-3" />
                    ) : (
                      <FileSpreadsheet className="h-3 w-3" />
                    )}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
            {index < exportOptions.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}

        {guests.length === 0 && (
          <DropdownMenuItem disabled>No guest data to export</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
