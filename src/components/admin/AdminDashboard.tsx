"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import useSWR from "swr";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import {
  Users,
  UserCheck,
  UserX,
  Baby,
  ChefHat,
  Search,
  Filter,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Wifi,
  WifiOff,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { GuestRecord, AdminData, FilterConfig } from "@/types/admin";
import { ExportDropdown } from "./ExportDropdown";
import { EditGuestModal } from "./EditGuestModal";
import { BulkActionsDropdown } from "./BulkActionsDropdown";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Fetcher function for SWR
const fetcher = async (url: string): Promise<AdminData> => {
  const response = await fetch(url, {
    credentials: "include", // Include cookies for authentication
  });

  if (!response.ok) {
    throw new Error("Възникна грешка при извличането на данните");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(
      result.error || "Възникна грешка при извличането на данните"
    );
  }

  return result.data;
};

export function AdminDashboard() {
  // Data fetching with SWR
  const { data, error, isLoading, mutate } = useSWR<AdminData>(
    "/api/admin/guests",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  // Table state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "submissionDate", desc: true }, // Most recent first
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter state
  const [filters, setFilters] = useState<FilterConfig>({
    search: "",
    attending: null,
    hasChildren: null,
    hasPlusOne: null,
  });

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search || "");
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await mutate();
    } finally {
      setIsRefreshing(false);
    }
  }, [mutate]);

  // Connection status
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Guest editing state
  const [editingGuest, setEditingGuest] = useState<GuestRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<GuestRecord[]>([]);

  // Guest editing functions
  const handleEditGuest = useCallback((guest: GuestRecord) => {
    setEditingGuest(guest);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveGuest = async (
    guestId: string,
    updatedData: Partial<GuestRecord>
  ) => {
    try {
      const response = await fetch(`/api/admin/guests/${guestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update guest");
      }

      // Refresh data
      await mutate();
      toast.success("Гостът беше успешно обновен");
    } catch (error) {
      console.error("Error updating guest:", error);
      toast.error("Грешка при обновяване на гостта");
      throw error;
    }
  };

  const handleBulkDelete = useCallback(
    async (guestIds: string[]) => {
      try {
        const response = await fetch("/api/admin/guests/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            action: "delete",
            guestIds,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete guests");
        }

        // Refresh data
        await mutate();
      } catch (error) {
        console.error("Error deleting guests:", error);
        throw error;
      }
    },
    [mutate]
  );

  const handleBulkMarkAttending = async (
    guestIds: string[],
    attending: boolean
  ) => {
    try {
      const response = await fetch("/api/admin/guests/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "markAttending",
          guestIds,
          attending,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update guest attendance");
      }

      // Refresh data
      await mutate();
    } catch (error) {
      console.error("Error updating guest attendance:", error);
      throw error;
    }
  };

  const handleSelectGuest = (guest: GuestRecord, selected: boolean) => {
    setSelectedGuests((prev) => {
      if (selected) {
        return [...prev, guest];
      } else {
        return prev.filter((g) => g.id !== guest.id);
      }
    });
  };

  const handleSelectAllGuests = useCallback(
    (selected: boolean) => {
      if (selected && data?.guests) {
        setSelectedGuests([...data.guests]);
      } else {
        setSelectedGuests([]);
      }
    },
    [data?.guests]
  );

  const clearSelection = () => {
    setSelectedGuests([]);
  };

  // Define table columns
  const columns = useMemo<ColumnDef<GuestRecord>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              handleSelectAllGuests(!!value);
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedGuests.some((g) => g.id === row.original.id)}
            onCheckedChange={(value) =>
              handleSelectGuest(row.original, !!value)
            }
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "guestName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Име на гост
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium break-words max-w-[180px] md:max-w-none">{row.getValue("guestName")}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="text-sm break-words max-w-[200px] md:max-w-none">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Телефон",
        cell: ({ row }) => {
          const phone = row.getValue("phone") as string | undefined;
          return (
            <div className="text-sm">{
              phone || <span className="text-muted-foreground">—</span>
            }</div>
          );
        },
      },
      {
        accessorKey: "attending",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Присъствие
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const attending = row.getValue("attending") as boolean;
          return (
            <Badge variant={attending ? "default" : "secondary"}>
              {attending ? "Ще присъства" : "Няма да присъства"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "plusOneAttending",
        header: "Партньор",
        cell: ({ row }) => {
          const attending = row.getValue("attending") as boolean;
          const plusOneAttending = row.getValue("plusOneAttending") as boolean;
          const plusOneName = row.original.plusOneName;

          if (!attending) {
            return <span className="text-muted-foreground">—</span>;
          }

          return (
            <div className="text-sm">
              {plusOneAttending ? (
                <div>
                  <Badge variant="outline">Да</Badge>
                  {plusOneName && (
                    <div className="mt-1 text-xs text-muted-foreground break-words max-w-[180px] md:max-w-none">
                      {plusOneName}
                    </div>
                  )}
                </div>
              ) : (
                <Badge variant="secondary">Не</Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "childrenCount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            <Baby className="mr-1 h-4 w-4" />
            Деца
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const count = row.getValue("childrenCount") as number;
          return (
            <div className="text-center">
              {count > 0 ? (
                <Badge variant="outline">{count}</Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "menuChoice",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            <ChefHat className="mr-1 h-4 w-4" />
            Меню
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const menuChoice = row.getValue("menuChoice") as string | undefined;
          const plusOneMenuChoice = row.original.plusOneMenuChoice;
          const allergies = row.original.allergies;
          const attending = row.original.attending;
          const plusOneAttending = row.original.plusOneAttending;

          if (!attending) {
            return <span className="text-muted-foreground">—</span>;
          }

          const getMenuLabel = (choice: string | undefined) => {
            switch (choice) {
              case "meat":
                return "🥩 Месно";
              case "vegetarian":
                return "🥗 Вегетарианско";
              default:
                return "Не е избрано";
            }
          };

          return (
            <div className="text-sm space-y-1">
              {menuChoice && (
                <Badge variant="outline" className="whitespace-nowrap">
                  {getMenuLabel(menuChoice)}
                </Badge>
              )}
              {plusOneAttending && plusOneMenuChoice && (
                <div>
                  <Badge variant="secondary" className="whitespace-nowrap">
                    +1: {getMenuLabel(plusOneMenuChoice)}
                  </Badge>
                </div>
              )}
              {allergies && (
                <div className="text-xs text-muted-foreground break-words max-w-[220px] md:max-w-none">
                  Алергии: {allergies}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "submissionDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Дата на изпращане
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("submissionDate") as string);
          return (
            <div className="text-sm">
              {format(date, "dd MMMM yyyy", { locale: bg })}
              <div className="text-xs text-muted-foreground">
                {format(date, "HH:mm")}
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Действия",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditGuest(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (
                  confirm("Сигурни ли сте, че искате да изтриете този гост?")
                ) {
                  handleBulkDelete([row.original.id]);
                }
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [handleEditGuest, handleBulkDelete, handleSelectAllGuests, selectedGuests]
  );

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!data?.guests) return [];

    return data.guests.filter((guest) => {
      // Search filter - use debounced search instead of direct search
      if (debouncedSearch) {
        const searchTerm = debouncedSearch.toLowerCase();
        const matchesName = guest.guestName.toLowerCase().includes(searchTerm);
        const matchesEmail = guest.email.toLowerCase().includes(searchTerm);
        const matchesPlusOne = guest.plusOneName
          ?.toLowerCase()
          .includes(searchTerm);

        if (!matchesName && !matchesEmail && !matchesPlusOne) {
          return false;
        }
      }

      // Attendance filter
      if (filters.attending !== null && guest.attending !== filters.attending) {
        return false;
      }

      // Children filter
      if (filters.hasChildren !== null) {
        const hasChildren = guest.childrenCount > 0;
        if (hasChildren !== filters.hasChildren) {
          return false;
        }
      }

      // Plus one filter
      if (filters.hasPlusOne !== null) {
        if (guest.plusOneAttending !== filters.hasPlusOne) {
          return false;
        }
      }

      return true;
    });
  }, [
    data?.guests,
    debouncedSearch,
    filters.attending,
    filters.hasChildren,
    filters.hasPlusOne,
  ]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      debouncedSearch ||
      filters.attending !== null ||
      filters.hasChildren !== null ||
      filters.hasPlusOne !== null
    );
  }, [
    debouncedSearch,
    filters.attending,
    filters.hasChildren,
    filters.hasPlusOne,
  ]);

  // Calculate dynamic statistics based on filtered data
  const dynamicStats = useMemo(() => {
    const totalRSVPs = filteredData.length;
    const attendingRSVPs = filteredData.filter(
      (guest) => guest.attending
    ).length;
    const notAttendingRSVPs = totalRSVPs - attendingRSVPs;

    // Calculate total children count (only for attending guests)
    const totalChildrenCount = filteredData
      .filter((guest) => guest.attending)
      .reduce((sum, guest) => sum + guest.childrenCount, 0);

    // Calculate kids menu count (<12) based on provided children details
    const kidsMenuCount = filteredData
      .filter((guest) => guest.attending)
      .reduce(
        (sum, guest) =>
          sum + (guest.childrenDetails?.filter((c) => c.age < 12).length || 0),
        0
      );

    // Calculate total plus ones (only for attending guests)
    const totalPlusOnes = filteredData.filter(
      (guest) => guest.attending && guest.plusOneAttending
    ).length;

    // Calculate total people attending (primary guests + plus ones + children)
    const totalPeopleAttending =
      attendingRSVPs + totalPlusOnes + totalChildrenCount;

    // Calculate dietary preferences based on menu choices
    const attendingGuestsWithMenus = filteredData.filter(
      (guest) => guest.attending
    );

    let vegetarianCount = 0;
    let standardCount = 0;

    attendingGuestsWithMenus.forEach((guest) => {
      // Count primary guest menu choice
      if (guest.menuChoice) {
        if (guest.menuChoice === "vegetarian") {
          vegetarianCount++;
        } else if (guest.menuChoice === "meat") {
          standardCount++;
        }
      }

      // Count plus one menu choice
      if (guest.plusOneAttending && guest.plusOneMenuChoice) {
        if (guest.plusOneMenuChoice === "vegetarian") {
          vegetarianCount++;
        } else if (guest.plusOneMenuChoice === "meat") {
          standardCount++;
        }
      }
    });

    const totalDietaryResponses = vegetarianCount + standardCount;

    // Count guests with allergies
    const allergiesCount = filteredData.filter(
      (guest) => guest.attending && guest.allergies
    ).length;

    return {
      totalRSVPs,
      totalPeopleAttending,
      attendingCount: attendingRSVPs,
      notAttendingCount: notAttendingRSVPs,
      totalChildrenCount,
      kidsMenuCount,
      totalPlusOnes,
      vegetarianCount,
      standardCount,
      totalDietaryResponses,
      allergiesCount,
    };
  }, [filteredData]);

  // Initialize table
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Guest Modal */}
        <EditGuestModal
          guest={editingGuest}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingGuest(null);
          }}
          onSave={handleSaveGuest}
        />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-red-500">
              <p className="text-lg font-semibold">Възникна грешка</p>
              <p className="text-sm">{error.message}</p>
            </div>
            <Button onClick={() => mutate()}>Опитай отново</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общо хора</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dynamicStats.totalPeopleAttending}
            </div>
            <div className="text-xs text-muted-foreground">
              {dynamicStats.totalRSVPs} RSVP форми
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Детски менюта (&lt;12)</CardTitle>
            <Baby className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dynamicStats.kidsMenuCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ще присъстват</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dynamicStats.attendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Няма да присъстват
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dynamicStats.notAttendingCount}
            </div>
          </CardContent>
        </Card>

        {/* Removed "Общо деца" card per request */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Партньори</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dynamicStats.totalPlusOnes}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Вегетарианци</CardTitle>
            <ChefHat className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dynamicStats.vegetarianCount}
            </div>
            {dynamicStats.totalDietaryResponses > 0 && (
              <div className="text-xs text-muted-foreground">
                {Math.round(
                  (dynamicStats.vegetarianCount /
                    dynamicStats.totalDietaryResponses) *
                    100
                )}
                %
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Dietary Statistics Row */}
      {dynamicStats.totalDietaryResponses > 0 && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Стандартна диета
              </CardTitle>
              <ChefHat className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {dynamicStats.standardCount}
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round(
                  (dynamicStats.standardCount /
                    dynamicStats.totalDietaryResponses) *
                    100
                )}
                %
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">С алергии</CardTitle>
              <ChefHat className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {dynamicStats.allergiesCount}
              </div>
              {dynamicStats.attendingCount > 0 && (
                <div className="text-xs text-muted-foreground">
                  {Math.round(
                    (dynamicStats.allergiesCount /
                      dynamicStats.attendingCount) *
                      100
                  )}
                  %
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Диетични отговори
              </CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dynamicStats.totalDietaryResponses}
              </div>
              <div className="text-xs text-muted-foreground">
                от {dynamicStats.attendingCount} присъстващи
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Guest Modal */}
      <EditGuestModal
        guest={editingGuest}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGuest(null);
        }}
        onSave={handleSaveGuest}
      />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Филтри и търсене
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Connection Status */}
              <div className="flex items-center gap-1 text-sm">
                {isOnline ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Онлайн</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">Офлайн</span>
                  </>
                )}
              </div>
              {/* Export Dropdown */}
              <ExportDropdown
                guests={data?.guests || []}
                filteredGuests={filteredData}
                isFiltered={hasActiveFilters}
              />
              {/* Manual Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Обновява..." : "Обнови"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Търсене</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Име, email или партньор..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* Attendance Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Присъствие</label>
              <Select
                value={filters.attending?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    attending: value === "all" ? null : value === "true",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всички</SelectItem>
                  <SelectItem value="true">Ще присъстват</SelectItem>
                  <SelectItem value="false">Няма да присъстват</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Children Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Деца</label>
              <Select
                value={filters.hasChildren?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    hasChildren: value === "all" ? null : value === "true",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всички</SelectItem>
                  <SelectItem value="true">С деца</SelectItem>
                  <SelectItem value="false">Без деца</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Plus One Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Партньор</label>
              <Select
                value={filters.hasPlusOne?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    hasPlusOne: value === "all" ? null : value === "true",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всички</SelectItem>
                  <SelectItem value="true">С партньор</SelectItem>
                  <SelectItem value="false">Без партньор</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {(() => {
                const activeFilters = [
                  debouncedSearch && "търсене",
                  filters.attending !== null && "присъствие",
                  filters.hasChildren !== null && "деца",
                  filters.hasPlusOne !== null && "партньор",
                ].filter(Boolean);

                return activeFilters.length > 0
                  ? `Активни филтри: ${activeFilters.join(", ")} (${activeFilters.length})`
                  : "Няма активни филтри";
              })()}
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  search: "",
                  attending: null,
                  hasChildren: null,
                  hasPlusOne: null,
                })
              }
              disabled={
                !debouncedSearch &&
                filters.attending === null &&
                filters.hasChildren === null &&
                filters.hasPlusOne === null
              }
            >
              Изчисти филтрите
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtered Statistics */}
      {filteredData.length !== (data?.guests.length || 0) && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Статистики за филтрираните данни
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredData.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Филтрирани гости
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredData.filter((g) => g.attending).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ще присъстват
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredData.filter((g) => g.plusOneAttending).length}
                </div>
                <div className="text-sm text-muted-foreground">С партньор</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredData
                    .filter((g) => g.attending)
                    .reduce(
                      (sum, g) =>
                        sum + (g.childrenDetails?.filter((c) => c.age < 12).length || 0),
                      0
                    )}
                </div>
                <div className="text-sm text-muted-foreground">Детски менюта (&lt;12)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      <BulkActionsDropdown
        selectedGuests={selectedGuests}
        onClearSelection={clearSelection}
        onBulkDelete={handleBulkDelete}
        onBulkMarkAttending={handleBulkMarkAttending}
      />

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Списък с гости ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="w-full overflow-auto">
              <div className="rounded-md border min-w-[800px]">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="whitespace-nowrap"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="hover:bg-muted/50"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="whitespace-nowrap align-top"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          Няма намерени гости.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const guest = row.original;
                return (
                  <Card
                    key={row.id}
                    className="border-l-4 border-l-primary/30"
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {/* Guest Name and Status */}
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold text-lg break-words">
                            {guest.guestName}
                          </h3>
                          <Badge
                            variant={guest.attending ? "default" : "secondary"}
                          >
                            {guest.attending
                              ? "Ще присъства"
                              : "Няма да присъства"}
                          </Badge>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 break-words">
                            <span className="font-medium">Email:</span>
                            <span className="text-muted-foreground">
                              {guest.email}
                            </span>
                          </div>
                          {guest.phone && (
                            <div className="flex items-center gap-2 break-words">
                              <span className="font-medium">Телефон:</span>
                              <span className="text-muted-foreground">
                                {guest.phone}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Additional Info */}
                        {guest.attending && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {/* Plus One */}
                            <div>
                              <span className="font-medium">Партньор:</span>
                              <div className="mt-1">
                                {guest.plusOneAttending ? (
                                  <div>
                                    <Badge variant="outline" className="mb-1">
                                      Да
                                    </Badge>
                                    {guest.plusOneName && (
                                      <div className="text-xs text-muted-foreground break-words">
                                        {guest.plusOneName}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <Badge variant="secondary">Не</Badge>
                                )}
                              </div>
                            </div>

                            {/* Children */}
                            <div>
                              <span className="font-medium">Деца:</span>
                              <div className="mt-1">
                                {guest.childrenCount > 0 ? (
                                  <Badge variant="outline">
                                    {guest.childrenCount}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground text-xs">
                                    Няма
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Menu Choices */}
                            {(guest.menuChoice || guest.plusOneMenuChoice) && (
                              <div className="col-span-2">
                                <span className="font-medium">Меню:</span>
                                <div className="mt-1 space-y-1">
                                  {guest.menuChoice && (
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">
                                        {guest.menuChoice === "meat" &&
                                          "🥩 Месно"}
                                        {guest.menuChoice === "vegetarian" &&
                                          "🥗 Вегетарианско"}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        ({guest.guestName})
                                      </span>
                                    </div>
                                  )}
                                  {guest.plusOneMenuChoice &&
                                    guest.plusOneAttending && (
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                          {guest.plusOneMenuChoice === "meat" &&
                                            "🥩 Месно"}
                                          {guest.plusOneMenuChoice ===
                                            "vegetarian" && "🥗 Вегетарианско"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          ({guest.plusOneName || "Партньор"})
                                        </span>
                                      </div>
                                    )}
                                  {guest.allergies && (
                                    <div className="text-xs text-muted-foreground mt-1 break-words">
                                      Алергии: {guest.allergies}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Submission Date */}
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          Изпратено на:{" "}
                          {format(
                            new Date(guest.submissionDate),
                            "dd MMMM yyyy 'в' HH:mm",
                            { locale: bg }
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Няма намерени гости.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <div className="text-xs text-muted-foreground block sm:hidden">
                Стр {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
              </div>
              <div className="hidden sm:block text-sm text-muted-foreground">
                Показване на{" "}
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{" "}
                до{" "}
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)}{" "}
                от {filteredData.length} резултата
              </div>
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-sm text-muted-foreground">Редове на страница:</span>
                <Select
                  value={table.getState().pagination.pageSize.toString()}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile icon-only controls */}
            <div className="flex items-center gap-2 sm:hidden">
              <Button variant="outline" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} aria-label="Първа страница">
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Предишна страница">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Следваща страница">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} aria-label="Последна страница">
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Desktop text buttons with icons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <ChevronsLeft className="h-4 w-4 mr-1" /> Първа
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Предишна
              </Button>
              <div className="text-sm text-muted-foreground">
                Страница {table.getState().pagination.pageIndex + 1} от {table.getPageCount()}
              </div>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Следваща <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                Последна <ChevronsRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
