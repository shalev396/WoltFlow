"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { getApiErrorMessage } from "@/utils/errorUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRunsQuery } from "@/queries/runs";
import type { RunItem, RunFilters } from "@/types";
import { RunDetailsDialog } from "@/components/shared/RunDetailsDialog";
import { ScreenshotsDialog } from "./ScreenshotsDialog";

const getStatusBadge = (status: string) => {
  const baseClasses =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case "completed":
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
    case "failed":
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
    case "in_progress":
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300`;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return "✓ ";
    case "failed":
      return "✕ ";
    case "in_progress":
      return "⋯ ";
    default:
      return "";
  }
};

const createColumns = (
  t: (key: string) => string
): ColumnDef<RunItem>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t("table.accessibility.selectAll")}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t("table.accessibility.selectRow")}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: t("table.columns.id"),
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          {t("table.columns.date")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="space-y-1">
          <p className="font-medium text-foreground text-sm">
            {format(date, "MMM d, yyyy")}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(date, "h:mm a")}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          {t("table.columns.status")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span className={getStatusBadge(status)}>
          {getStatusIcon(status)}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "stage",
    header: t("table.columns.stage"),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground capitalize">
        {(row.getValue("stage") as string).replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: t("table.columns.amount"),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as string | null;
      return (
        <span className="font-medium text-foreground">
          {amount ? `₪${Number(amount).toLocaleString()}` : "—"}
        </span>
      );
    },
  },
  {
    id: "screenshots",
    header: t("table.columns.screenshots"),
    cell: ({ row }) => {
      const screenshots = row.original.screenshots;
      return screenshots && screenshots.length > 0 ? (
        <ScreenshotsDialog screenshots={screenshots} runId={row.original.id}>
          <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
            <ImageIcon className="h-3 w-3 mr-1" />
            {screenshots.length}
          </Button>
        </ScreenshotsDialog>
      ) : (
        <span className="text-xs text-muted-foreground">{t("table.none")}</span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const run = row.original;

      return (
        <RunDetailsDialog
          run={run}
          trigger={
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Eye className="h-4 w-4" />
            </Button>
          }
        />
      );
    },
  },
];

interface RunsDataTableProps {
  filters: RunFilters;
  onFiltersChange: (filters: RunFilters) => void;
}

export function RunsDataTable({
  filters,
  onFiltersChange,
}: RunsDataTableProps) {
  const { t } = useTranslation("runs");
  const columns = React.useMemo(() => createColumns(t), [t]);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: runsData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useRunsQuery(
    pagination.pageIndex + 1, // API uses 1-based pagination
    pagination.pageSize,
    filters
  );

  const runs = runsData?.runs || [];
  const totalCount = runsData?.pagination.totalCount || 0;

  const table = useReactTable({
    data: runs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    const newFilters =
      status === "all"
        ? { ...filters, status: undefined }
        : { ...filters, status: status as RunFilters["status"] };
    onFiltersChange(newFilters);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {getApiErrorMessage(error, t("table.failedToLoad"))}
            </p>
            <Button onClick={() => refetch()}>{t("table.tryAgain")}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>
            {isLoading
              ? t("table.loading")
              : t("table.totalRunsFound", { count: totalCount })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
            <div className="flex flex-col sm:flex-row flex-1 gap-3 w-full">
              {/* Status Filter */}
              <Select
                value={filters.status || "all"}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue
                    placeholder={t("table.filters.filterByStatus")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("table.status.allStatuses")}
                  </SelectItem>
                  <SelectItem value="completed">
                    {t("table.status.completed")}
                  </SelectItem>
                  <SelectItem value="failed">
                    {t("table.status.failed")}
                  </SelectItem>
                  <SelectItem value="in_progress">
                    {t("table.status.inProgress")}
                  </SelectItem>
                  <SelectItem value="started">
                    {t("table.status.started")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Column visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {t("table.filters.columns")}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table with responsive column visibility */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      // Responsive visibility classes for headers
                      let headerClass = "text-center";

                      // Always visible: actions, date, status
                      // sm (640px+): + stage
                      // md (768px+): + screenshots
                      // lg (1024px+): + id, amount
                      // xl (1280px+): + select checkbox

                      if (header.column.id === "select") {
                        headerClass += " hidden xl:table-cell";
                      } else if (header.column.id === "id") {
                        headerClass += " hidden lg:table-cell";
                      } else if (header.column.id === "stage") {
                        headerClass += " hidden sm:table-cell";
                      } else if (header.column.id === "amount") {
                        headerClass += " hidden lg:table-cell";
                      } else if (header.column.id === "screenshots") {
                        headerClass += " hidden md:table-cell";
                      }
                      // actions, createdAt, status are always visible

                      return (
                        <TableHead key={header.id} className={headerClass}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading && !runs.length ? (
                  [...Array(pagination.pageSize)].map((_, i) => (
                    <TableRow key={i}>
                      {columns.map((_: unknown, j: number) => (
                        <TableCell key={j} className="text-center">
                          <div className="h-4 bg-muted animate-pulse rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => {
                        // Apply same responsive visibility to cells
                        let cellClass = "text-center";

                        if (cell.column.id === "select") {
                          cellClass += " hidden xl:table-cell";
                        } else if (cell.column.id === "id") {
                          cellClass += " hidden lg:table-cell";
                        } else if (cell.column.id === "stage") {
                          cellClass += " hidden sm:table-cell";
                        } else if (cell.column.id === "amount") {
                          cellClass += " hidden lg:table-cell";
                        } else if (cell.column.id === "screenshots") {
                          cellClass += " hidden md:table-cell";
                        }

                        return (
                          <TableCell key={cell.id} className={cellClass}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t("table.noRuns")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                {t("table.pagination.rowsSelected", {
                  selected: table.getFilteredSelectedRowModel().rows.length,
                  total: totalCount,
                })}
              </p>
              {isFetching && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
                  <span className="text-xs">
                    {t("table.pagination.updating")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {t("table.pagination.previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {t("table.pagination.next")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
