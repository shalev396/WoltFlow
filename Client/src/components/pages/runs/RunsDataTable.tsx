"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Eye, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
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
import { RunsFilterBar } from "./RunsFilterBar";

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

function columnVisibilityClass(columnId: string): string {
  // Always: createdAt, status, actions
  // sm+: stage | md+: screenshots | lg+: id, amount
  if (columnId === "id" || columnId === "amount") {
    return "hidden lg:table-cell";
  }
  if (columnId === "stage") {
    return "hidden sm:table-cell";
  }
  if (columnId === "screenshots") {
    return "hidden md:table-cell";
  }
  return "";
}

const createColumns = (t: (key: string) => string): ColumnDef<RunItem>[] => [
  {
    accessorKey: "id",
    header: t("table.columns.id"),
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-medium"
      >
        {t("table.columns.date")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-medium"
      >
        {t("table.columns.status")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Reset to first page when filters change
  const filtersKey = JSON.stringify(filters);
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filtersKey]);

  const {
    data: runsData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useRunsQuery(
    pagination.pageIndex + 1,
    pagination.pageSize,
    filters,
  );

  const runs = runsData?.runs || [];
  const totalCount = runsData?.pagination.totalCount || 0;

  const table = useReactTable({
    data: runs,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize) || 1,
    state: {
      sorting,
      pagination,
    },
  });

  const from =
    totalCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const to = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    totalCount,
  );

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
          <RunsFilterBar
            filters={filters}
            onFiltersChange={onFiltersChange}
          />

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={`text-center ${columnVisibilityClass(header.column.id)}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
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
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`text-center ${columnVisibilityClass(cell.column.id)}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
                      {t("table.noRuns")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                {t("table.pagination.showing", {
                  from,
                  to,
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
