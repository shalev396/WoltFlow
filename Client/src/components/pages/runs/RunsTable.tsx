import { useState } from "react";
import { format } from "date-fns";
import {
  Eye,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

import { useRunsQuery } from "@/queries/runs";
import type { RunFilters } from "@/types";
import { RunDetailsDialog } from "@/components/shared/RunDetailsDialog";
import RunsFilters from "./RunsFilters";

const getStatusBadge = (status: string) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";

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

type SortField = "createdAt";
type SortDirection = "asc" | "desc";

export default function RunsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField] = useState<SortField>("createdAt");
  const [sortDirection] = useState<SortDirection>("desc");
  const [filters, setFilters] = useState<RunFilters>({});

  // Use the existing optimized query with filters and pagination
  const {
    data: runsData,
    isLoading,
    error,
    isPlaceholderData,
    isFetching,
  } = useRunsQuery(
    currentPage, // API uses 1-based pagination
    pageSize,
    filters
  );

  const runs = runsData?.runs || [];
  const totalCount = runsData?.pagination.totalCount || 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <RunsFilters onFiltersChange={setFilters} />

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Runs</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${totalCount} total runs found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500">
                {error instanceof Error ? error.message : "Failed to load runs"}
              </p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center text-foreground font-medium">
                        ID
                      </TableHead>
                      <TableHead className="text-center text-foreground font-medium">
                        Date
                        {sortField === "createdAt" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="ml-1 h-3 w-3 inline" />
                          ) : (
                            <ChevronDown className="ml-1 h-3 w-3 inline" />
                          ))}
                      </TableHead>
                      <TableHead className="text-center text-foreground font-medium">
                        Status
                      </TableHead>
                      <TableHead className="text-center text-foreground font-medium">
                        Stage
                      </TableHead>
                      <TableHead className="text-center text-foreground font-medium">
                        Amount
                      </TableHead>
                      <TableHead className="text-center text-foreground font-medium">
                        Screenshots
                      </TableHead>
                      <TableHead className="text-center text-foreground font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && !isPlaceholderData ? (
                      [...Array(pageSize)].map((_, i) => (
                        <TableRow key={i}>
                          {[...Array(7)].map((_, j) => (
                            <TableCell key={j} className="text-center">
                              <div className="h-4 bg-muted animate-pulse rounded" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : runs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No runs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      runs.map((run) => (
                        <TableRow
                          key={run.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="text-center">
                            <div className="font-medium">#{run.id}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <p className="font-medium text-foreground text-sm">
                                {format(new Date(run.createdAt), "MMM d, yyyy")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(run.createdAt), "h:mm a")}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={getStatusBadge(run.status)}>
                              {getStatusIcon(run.status)}
                              {run.status.charAt(0).toUpperCase() +
                                run.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm text-muted-foreground capitalize">
                              {run.stage.replace(/_/g, " ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium text-foreground">
                              {run.automationMode === "full-run" ? "₪40" : "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {run.screenshots && run.screenshots.length > 0 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                              >
                                <ImageIcon className="h-3 w-3 mr-1" />
                                {run.screenshots.length}
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                None
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <RunDetailsDialog
                              run={run}
                              trigger={
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalCount)} of{" "}
                    {totalCount} results
                  </p>
                  {isFetching && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
                      <span className="text-xs">Updating...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) =>
                      handlePageSizeChange(Number(value))
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <span className="text-sm">
                    Page {currentPage} of {pageCount || 1}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pageCount || isPlaceholderData}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
