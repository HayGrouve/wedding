"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Users, Mail, Loader2 } from "lucide-react";
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
  exportGuestsToExcel,
  exportEmailListToExcel,
  validateGuestDataForExport,
} from "@/lib/export";

function downloadExcel(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
    dataType: "all" | "filtered" | "email",
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
      const baseFilename = `гости-${timestamp}`;

      // Excel only
      let excelBuffer: ArrayBuffer;
      let filename: string;

      switch (dataType) {
        case "email":
          excelBuffer = exportEmailListToExcel(dataToExport, emailAttendingOnly);
          filename = `${baseFilename}-имейли.xlsx`;
          break;
        default:
          excelBuffer = exportGuestsToExcel(dataToExport, {
            sheetName:
              isFiltered && dataType === "filtered"
                ? "Филтрирани гости"
                : "Списък с гости",
            includeMetadata: true,
          });
          filename = `${baseFilename}${isFiltered && dataType === "filtered" ? "-филтрирани" : ""}.xlsx`;
      }

      downloadExcel(excelBuffer, filename);

      // Success message
      const exportedCount = dataToExport.length;
      const dataTypeLabel =
        dataType === "all"
          ? "всички гости"
          : dataType === "filtered"
            ? "филтрирани гости"
            : "списък с имейли";

      toast.success(`Успешно експортирани ${exportedCount} записа (${dataTypeLabel}) като Excel`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error(`Неуспешен експорт: ${error instanceof Error ? error.message : "Неизвестна грешка"}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      label: "Всички гости",
      description: `Експортване на всички ${guests.length} гости`,
      icon: Users,
      actions: [
        { label: "Excel", action: () => handleExport("all") },
      ],
    },
    ...(isFiltered
      ? [
          {
            label: "Филтрирани резултати",
            description: `Експортване на ${filteredGuests.length} филтрирани гости`,
            icon: Users,
            actions: [
              { label: "Excel", action: () => handleExport("filtered") },
            ],
          },
        ]
      : []),
    {
      label: "Списък с имейли (Всички)",
      description: "Експорт на контакти",
      icon: Mail,
      actions: [
        { label: "Excel", action: () => handleExport("email", false) },
      ],
    },
    {
      label: "Списък с имейли (Присъстващи)",
      description: "Експорт само на присъстващи",
      icon: Mail,
      actions: [
        { label: "Excel", action: () => handleExport("email", true) },
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
          {isExporting ? "Експортване..." : "Експорт"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Опции за експорт</DropdownMenuLabel>
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
                    <FileSpreadsheet className="h-3 w-3" />
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
