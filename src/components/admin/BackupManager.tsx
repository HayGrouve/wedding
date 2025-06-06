"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { GuestRecord } from "@/types/admin";
import {
  exportBackup,
  processBackupFile,
  simulateRestoreFromBackup,
  BackupValidationResult,
  RestoreResult,
  exportEmailsForPlatform,
  downloadEmailExport,
  EmailPlatformConfig,
} from "@/lib/backup";
import {
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  Mail,
  Archive,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface BackupManagerProps {
  guests: GuestRecord[];
}

export function BackupManager({ guests }: BackupManagerProps) {
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [restoreValidation, setRestoreValidation] =
    useState<BackupValidationResult | null>(null);
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateBackup = () => {
    try {
      setIsProcessing(true);
      exportBackup(guests);
      toast({
        title: "Backup Created",
        description: `Successfully created backup of ${guests.length} guests`,
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const validation = await processBackupFile(file);
      setRestoreValidation(validation);

      if (validation.isValid) {
        toast({
          title: "Backup File Valid",
          description: `Found ${validation.metadata?.totalGuests} guests in backup`,
        });
      } else {
        toast({
          title: "Invalid Backup File",
          description: validation.errors.join(", "),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "File Processing Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreSimulation = () => {
    if (!restoreValidation?.isValid || !restoreValidation.metadata) return;

    try {
      const backupData = {
        metadata: restoreValidation.metadata,
        guests: [], // In a real implementation, this would come from the parsed file
      };

      const result = simulateRestoreFromBackup(backupData, guests);
      setRestoreResult(result);

      if (result.success) {
        toast({
          title: "Restore Simulation Complete",
          description: `Would restore ${result.restored} guests, skip ${result.skipped} duplicates`,
        });
      } else {
        toast({
          title: "Restore Simulation Failed",
          description: result.errors.join(", "),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Restore Simulation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleEmailExport = (
    platform: EmailPlatformConfig["platform"],
    attendingOnly: boolean = false
  ) => {
    try {
      setIsProcessing(true);

      const config: EmailPlatformConfig = {
        platform,
        includeNames: true,
        includePhones: platform !== "sendgrid",
        includeDietary: platform === "sendgrid",
        format: "csv",
      };

      const emailData = exportEmailsForPlatform(guests, config, attendingOnly);
      downloadEmailExport(emailData, platform, attendingOnly);

      const attendingSuffix = attendingOnly ? " (attending only)" : "";
      toast({
        title: "Email Export Complete",
        description: `Exported emails for ${platform}${attendingSuffix}`,
      });
    } catch (error) {
      toast({
        title: "Email Export Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetRestoreDialog = () => {
    setRestoreValidation(null);
    setRestoreResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          Backup & Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Backup Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Backup Guest Data</Label>
          <Button
            onClick={handleCreateBackup}
            disabled={isProcessing || guests.length === 0}
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Create Backup ({guests.length} guests)
          </Button>
        </div>

        <Separator />

        {/* Restore Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Restore Guest Data</Label>
          <Button
            onClick={() => setIsRestoreDialogOpen(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            Restore from Backup
          </Button>
        </div>

        <Separator />

        {/* Email Export Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Email List Export</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Mail className="mr-2 h-4 w-4" />
                Export Email Lists
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Communication Platforms</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleEmailExport("mailchimp", false)}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Mailchimp (All Guests)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEmailExport("mailchimp", true)}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Mailchimp (Attending Only)
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleEmailExport("constant-contact", false)}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Constant Contact (All)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEmailExport("constant-contact", true)}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Constant Contact (Attending)
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleEmailExport("sendgrid", false)}
              >
                <FileText className="mr-2 h-4 w-4" />
                SendGrid (All Guests)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEmailExport("sendgrid", true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                SendGrid (Attending Only)
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleEmailExport("generic", false)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generic CSV (All)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEmailExport("generic", true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generic CSV (Attending)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      {/* Restore Dialog */}
      <Dialog
        open={isRestoreDialogOpen}
        onOpenChange={(open) => {
          setIsRestoreDialogOpen(open);
          if (!open) {
            resetRestoreDialog();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Restore Guest Data</DialogTitle>
            <DialogDescription>
              Upload a backup file to restore guest data. This will simulate the
              restore process.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="backup-file">Select Backup File</Label>
              <Input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                ref={fileInputRef}
                disabled={isProcessing}
              />
            </div>

            {/* Validation Results */}
            {restoreValidation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {restoreValidation.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {restoreValidation.isValid
                      ? "Valid Backup"
                      : "Invalid Backup"}
                  </span>
                </div>

                {restoreValidation.metadata && (
                  <div className="text-sm space-y-1">
                    <p>
                      Total Guests: {restoreValidation.metadata.totalGuests}
                    </p>
                    <p>
                      Created:{" "}
                      {new Date(
                        restoreValidation.metadata.timestamp
                      ).toLocaleString("bg-BG")}
                    </p>
                    <p>Version: {restoreValidation.metadata.version}</p>
                  </div>
                )}

                {restoreValidation.errors.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-red-600">Errors:</Label>
                    {restoreValidation.errors.map((error, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="text-xs"
                      >
                        {error}
                      </Badge>
                    ))}
                  </div>
                )}

                {restoreValidation.warnings.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-yellow-600">Warnings:</Label>
                    {restoreValidation.warnings.map((warning, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {warning}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Restore Results */}
            {restoreResult && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    Restore Simulation Results
                  </span>
                </div>

                <div className="text-sm space-y-1">
                  <p>Would restore: {restoreResult.restored} guests</p>
                  <p>Would skip: {restoreResult.skipped} duplicates</p>
                </div>

                {restoreResult.warnings.length > 0 && (
                  <div className="space-y-1">
                    {restoreResult.warnings.map((warning, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {warning}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRestoreDialogOpen(false)}
            >
              Cancel
            </Button>
            {restoreValidation?.isValid && (
              <Button onClick={handleRestoreSimulation}>
                Simulate Restore
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
