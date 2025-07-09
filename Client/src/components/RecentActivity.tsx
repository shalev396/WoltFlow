import { format } from "date-fns";
import { Loader2, Image, AlertCircle } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { RunDetailsDialog } from "@/components/RunDetailsDialog";

import { type RunWithScreenshots } from "@/services/runs";
import { useRecentRunsQuery } from "@/queries/runs";

export default function RecentActivity() {
  const { data: runs = [], isLoading, error } = useRecentRunsQuery(5);

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

  const getNotificationBadge = (isNotify: boolean) => {
    return isNotify
      ? "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
      : "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
  };

  // Removed local RunDetailsDialog component; use shared version instead

  const ScreenshotsDialog = ({
    screenshots,
  }: {
    screenshots: any[];
    runId: number;
  }) => {
    if (!screenshots || screenshots.length === 0) {
      return (
        <span className="text-xs text-muted-foreground">No screenshots</span>
      );
    }

    return (
      <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
        <Image className="h-3 w-3 mr-1" />
        {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""}
      </Button>
    );
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest purchase attempts</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="size-12 text-red-500 mb-4" />
            <p className="text-lg font-medium text-foreground">
              {error instanceof Error
                ? error.message
                : "Failed to load recent activity"}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-[60%] bg-muted animate-pulse rounded" />
                  <div className="h-4 w-[80%] bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Loader2 className="size-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">
              No purchase history yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Your recent gift card purchases will appear here
            </p>
          </div>
        ) : (
          <div className="relative overflow-x-auto -mx-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground font-medium pl-6">
                    Date
                  </TableHead>
                  <TableHead className="text-foreground font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-foreground font-medium">
                    Stage
                  </TableHead>
                  <TableHead className="text-foreground font-medium">
                    Notification
                  </TableHead>
                  <TableHead className="text-foreground font-medium">
                    Screenshots
                  </TableHead>
                  <TableHead className="text-right text-foreground font-medium pr-6">
                    Amount
                  </TableHead>
                  <TableHead className="text-right text-foreground font-medium pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run: RunWithScreenshots) => (
                  <TableRow
                    key={run.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {format(new Date(run.created_at), "MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(run.created_at), "h:mm a")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={getStatusBadge(run.status)}>
                        {getStatusIcon(run.status)}
                        {run.status.charAt(0).toUpperCase() +
                          run.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground capitalize">
                        {run.stage}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={getNotificationBadge(run.is_notify)}>
                        {run.is_notify ? "Enabled" : "Disabled"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ScreenshotsDialog
                        screenshots={run.Screenshots || []}
                        runId={run.id}
                      />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <span className="font-medium text-foreground">
                        ₪{run.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <RunDetailsDialog run={run} />
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
