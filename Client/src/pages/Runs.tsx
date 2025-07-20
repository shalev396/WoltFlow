import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Clock,
  Image as ImageIcon,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { type RunWithScreenshots, type RunFilters } from "@/services/runs";
import { useRunsQuery } from "@/queries/runs";
import { RunDetailsDialog } from "@/components/RunDetailsDialog";

export default function Runs() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filters, setFilters] = useState<RunFilters>({});

  // Countdown state
  const [timeUntilNextRun, setTimeUntilNextRun] = useState<string>("");

  // TanStack Query for runs data with optimized pagination
  const {
    data: runsData,
    isLoading,
    error,
    isPlaceholderData,
    isFetching,
  } = useRunsQuery(currentPage, pageSize, filters);

  // Extract data from query response
  const runs = runsData?.runs || [];
  const totalPages = runsData?.pagination.totalPages || 1;
  const totalCount = runsData?.pagination.totalCount || 0;

  // Countdown to next run (12:00 daily except Friday and Saturday)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const today = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Skip Friday (5) and Saturday (6) - these are weekends
      if (today === 5 || today === 6) {
        // If it's Friday or Saturday, next run is Sunday at 12:00
        const nextSunday = new Date(now);
        const daysUntilSunday = today === 5 ? 2 : 1; // Friday: 2 days, Saturday: 1 day
        nextSunday.setDate(now.getDate() + daysUntilSunday);
        nextSunday.setHours(12, 0, 0, 0);

        const timeDiff = nextSunday.getTime() - now.getTime();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setTimeUntilNextRun(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        // Regular weekday - next run is today at 12:00 or tomorrow at 12:00
        const nextRun = new Date(now);

        if (now.getHours() >= 12) {
          // After 12:00, next run is tomorrow (unless tomorrow is Friday/Saturday)
          nextRun.setDate(now.getDate() + 1);

          // If tomorrow is Friday or Saturday, skip to Sunday
          if (nextRun.getDay() === 5 || nextRun.getDay() === 6) {
            const daysToAdd = nextRun.getDay() === 5 ? 2 : 1; // Friday: skip to Sunday (2 days), Saturday: skip to Sunday (1 day)
            nextRun.setDate(nextRun.getDate() + daysToAdd);
          }
        }

        nextRun.setHours(12, 0, 0, 0);

        const timeDiff = nextRun.getTime() - now.getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        if (hours > 0) {
          setTimeUntilNextRun(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeUntilNextRun(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // No need for fetchRuns function - TanStack Query handles this automatically

  const handleFilterChange = (
    key: keyof RunFilters,
    value: string | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "success":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
      case "in progress":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✓ ";
      case "failed":
        return "✕ ";
      case "in progress":
        return "⋯ ";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-18 pb-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Runs
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your automation runs
          </p>
        </div>

        {/* Countdown Card and Filters */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Next Run Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Next Automation Run
              </CardTitle>
              <CardDescription className="text-sm">
                Scheduled daily at 12:00 PM (except Friday & Saturday)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Countdown Display */}
                <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20 border border-blue-200/50 dark:border-blue-700/50">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Time Until Next Run
                  </p>
                  <p className="text-xl sm:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {timeUntilNextRun || "Calculating..."}
                  </p>
                </div>

                {/* Status Indicators */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-white/30 dark:bg-black/10">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Status
                    </p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                      Active
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/30 dark:bg-black/10">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Frequency
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      Daily
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "status",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Stage
                  </label>
                  <Select
                    value={filters.stage || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "stage",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All stages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All stages</SelectItem>
                      <SelectItem value="triggered">Triggered</SelectItem>
                      <SelectItem value="refreshing tokens">
                        Refreshing Tokens
                      </SelectItem>
                      <SelectItem value="buying gift">Buying Gift</SelectItem>
                      <SelectItem value="getting code from mail">
                        Getting Code from Email
                      </SelectItem>
                      <SelectItem value="applying gift">
                        Applying Gift
                      </SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Runs</CardTitle>
            <CardDescription>{totalCount} total runs found</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-500">
                  {error instanceof Error
                    ? error.message
                    : "Failed to load runs"}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center text-foreground font-medium w-16">
                          ID
                        </TableHead>
                        <TableHead className="text-center text-foreground font-medium">
                          Date
                        </TableHead>
                        <TableHead className="text-center text-foreground font-medium hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="text-center text-foreground font-medium hidden lg:table-cell">
                          Stage
                        </TableHead>
                        <TableHead className="text-center text-foreground font-medium">
                          Amount
                        </TableHead>
                        <TableHead className="text-center text-foreground font-medium hidden md:table-cell">
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
                              <TableCell key={j}>
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
                        runs.map((run: RunWithScreenshots) => (
                          <TableRow
                            key={run.id}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="text-center font-medium">
                              #{run.id}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="space-y-1">
                                <p className="font-medium text-foreground text-sm">
                                  {format(
                                    new Date(run.created_at),
                                    "MMM d, yyyy"
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(run.created_at), "h:mm a")}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              <span className={getStatusBadge(run.status)}>
                                {getStatusIcon(run.status)}
                                {run.status.charAt(0).toUpperCase() +
                                  run.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-center hidden lg:table-cell">
                              <span className="text-sm text-muted-foreground capitalize">
                                {run.stage}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="font-medium text-foreground">
                                ₪{run.amount.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell className="text-center hidden md:table-cell">
                              {run.Screenshots && run.Screenshots.length > 0 ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => {
                                    // Handle screenshot viewing
                                  }}
                                >
                                  <ImageIcon className="h-3 w-3 mr-1" />
                                  {run.Screenshots.length}
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  No screenshots
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <RunDetailsDialog
                                run={run}
                                trigger={
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">
                                      View
                                    </span>
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
                      onValueChange={(value) => {
                        setPageSize(parseInt(value));
                        setCurrentPage(1);
                      }}
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!isPlaceholderData && currentPage < totalPages) {
                          setCurrentPage((prev) => prev + 1);
                        }
                      }}
                      disabled={isPlaceholderData || currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Run Details Dialog is now handled by RunDetailsDialog component */}
    </div>
  );
}
