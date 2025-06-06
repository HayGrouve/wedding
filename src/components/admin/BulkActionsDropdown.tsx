"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Trash2,
  UserCheck,
  UserX,
  Users,
  Loader2,
} from "lucide-react";
import { GuestRecord } from "@/types/admin";

interface BulkActionsDropdownProps {
  selectedGuests: GuestRecord[];
  onClearSelection: () => void;
  onBulkDelete: (guestIds: string[]) => Promise<void>;
  onBulkMarkAttending: (
    guestIds: string[],
    attending: boolean
  ) => Promise<void>;
}

export function BulkActionsDropdown({
  selectedGuests,
  onClearSelection,
  onBulkDelete,
  onBulkMarkAttending,
}: BulkActionsDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMarkAttendingDialog, setShowMarkAttendingDialog] = useState(false);
  const [markAttendingAction, setMarkAttendingAction] = useState<boolean>(true);

  const selectedCount = selectedGuests.length;

  if (selectedCount === 0) {
    return null;
  }

  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      const guestIds = selectedGuests.map((guest) => guest.id);
      await onBulkDelete(guestIds);

      toast.success(
        `Успешно изтрити ${selectedCount} гост${selectedCount === 1 ? "" : "и"}`
      );
      onClearSelection();
    } catch (error) {
      console.error("Error in bulk delete:", error);
      toast.error("Грешка при изтриване на гостите");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBulkMarkAttending = async (attending: boolean) => {
    setIsLoading(true);
    try {
      const guestIds = selectedGuests.map((guest) => guest.id);
      await onBulkMarkAttending(guestIds, attending);

      const action = attending ? "потвърдени" : "отхвърлени";
      toast.success(
        `Успешно ${action} ${selectedCount} гост${selectedCount === 1 ? "" : "и"}`
      );
      onClearSelection();
    } catch (error) {
      console.error("Error in bulk mark attending:", error);
      toast.error("Грешка при обновяване на статуса");
    } finally {
      setIsLoading(false);
      setShowMarkAttendingDialog(false);
    }
  };

  const showMarkAttendingDialogHandler = (attending: boolean) => {
    setMarkAttendingAction(attending);
    setShowMarkAttendingDialog(true);
  };

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Users className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-700">
          {selectedCount} избрани гост{selectedCount === 1 ? "" : "и"}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            disabled={isLoading}
          >
            Изчисти
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
                Действия
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => showMarkAttendingDialogHandler(true)}
                disabled={isLoading}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Маркирай като присъстващи
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => showMarkAttendingDialogHandler(false)}
                disabled={isLoading}
              >
                <UserX className="mr-2 h-4 w-4" />
                Маркирай като отсъстващи
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Изтрий избраните
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Изтриване на гостите</AlertDialogTitle>
            <AlertDialogDescription>
              Сигурни ли сте, че искате да изтриете {selectedCount} избран
              {selectedCount === 1 ? "" : "и"} гост
              {selectedCount === 1 ? "" : "и"}? Това действие е необратимо.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Отказ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Изтрива...
                </>
              ) : (
                "Изтрий"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mark Attending Confirmation Dialog */}
      <AlertDialog
        open={showMarkAttendingDialog}
        onOpenChange={setShowMarkAttendingDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Обновяване на статуса на присъствие
            </AlertDialogTitle>
            <AlertDialogDescription>
              Сигурни ли сте, че искате да маркирате {selectedCount} избран
              {selectedCount === 1 ? "" : "и"} гост
              {selectedCount === 1 ? "" : "и"} като{" "}
              {markAttendingAction ? "присъстващи" : "отсъстващи"}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Отказ</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleBulkMarkAttending(markAttendingAction)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обновява...
                </>
              ) : (
                "Потвърди"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
