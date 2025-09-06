import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Eye, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RunDetailsDialog } from "@/components/shared/RunDetailsDialog";
import { Link } from "react-router-dom";
import type { DashboardAnalytics } from "@/types/api";

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
    case "started":
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
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
    case "started":
      return "▶ ";
    default:
      return "";
  }
};

type SortField = "createdAt" | "status";
type SortDirection = "asc" | "desc";

interface LastRunsTableProps {
  analytics?: DashboardAnalytics;
  isLoading: boolean;
}

export default function LastRunsTable({
  analytics,
  isLoading,
}: LastRunsTableProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedRuns = useMemo(() => {
    const runs = analytics?.recentRuns || [];
    if (!runs || runs.length === 0) return [];

    return [...runs].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [analytics?.recentRuns, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      {sortField === field &&
        (sortDirection === "asc" ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        ))}
    </button>
  );

  const getTimeRangeDescription = (timeRange?: string) => {
    switch (timeRange) {
      case "7d":
        return "Last 7 days";
      case "90d":
        return "Last 90 days";
      default:
        return "Last 30 days";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Runs</CardTitle>
          {analytics && (
            <p className="text-sm text-muted-foreground mt-1">
              {getTimeRangeDescription(analytics.timeRange)}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/runs" className="flex items-center gap-1">
            View All
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                <div className="h-4 w-8 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : !sortedRuns || sortedRuns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">No runs yet</p>
            <p className="text-sm">Your automation runs will appear here</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-3">
                    <SortButton field="createdAt">Date</SortButton>
                  </TableHead>
                  <TableHead className="py-3">
                    <SortButton field="status">Status</SortButton>
                  </TableHead>
                  <TableHead className="py-3">Amount</TableHead>
                  <TableHead className="py-3"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRuns.map((run) => (
                  <TableRow key={run.id} className="hover:bg-muted/50">
                    <TableCell className="py-3">
                      <div className="text-sm">
                        <div className="font-medium">
                          {format(new Date(run.createdAt), "MMM d")}
                        </div>
                        <div className="text-muted-foreground">
                          {format(new Date(run.createdAt), "h:mm a")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className={getStatusBadge(run.status)}>
                        {getStatusIcon(run.status)}
                        {run.status === "in_progress"
                          ? "In Progress"
                          : run.status.charAt(0).toUpperCase() +
                            run.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-medium">
                        {run.status === "completed" && run.amount
                          ? `₪${Number(run.amount).toLocaleString()}`
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <RunDetailsDialog
                        run={run}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
