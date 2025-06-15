import { format } from "date-fns";
import {
  Loader2,
  Image,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const getStageOrder = (stage: string) => {
    const stages = [
      "triggered",
      "refreshing tokens",
      "buying gift",
      "getting code from mail",
      "applying gift",
      "done",
    ];
    return stages.indexOf(stage);
  };

  const getCurrentStageIndex = (stage: string) => {
    const stages = [
      "triggered",
      "refreshing tokens",
      "buying gift",
      "getting code from mail",
      "applying gift",
      "done",
    ];
    return stages.indexOf(stage);
  };

  const getStageIcon = (
    stage: string,
    currentStage: string,
    status: string
  ) => {
    const stageIndex = getStageOrder(stage);
    const currentIndex = getCurrentStageIndex(currentStage);

    if (status === "failed" && stageIndex === currentIndex) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }

    if (
      stageIndex < currentIndex ||
      (stageIndex === currentIndex && status === "success")
    ) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    if (stageIndex === currentIndex && status === "in progress") {
      return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
    }

    return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
  };

  const RunDetailsDialog = ({ run }: { run: RunWithScreenshots }) => {
    const stages = [
      {
        id: "triggered",
        name: "Run Triggered",
        description: "Automation process started",
      },
      {
        id: "refreshing tokens",
        name: "Refreshing Tokens",
        description: "Updating authentication tokens",
      },
      {
        id: "buying gift",
        name: "Buying Gift Card",
        description: "Purchasing gift card from Wolt",
      },
      {
        id: "getting code from mail",
        name: "Getting Code",
        description: "Retrieving gift code from email",
      },
      {
        id: "applying gift",
        name: "Applying Gift",
        description: "Adding gift code to account",
      },
      {
        id: "done",
        name: "Process Complete",
        description: "All steps completed successfully",
      },
    ];

    const currentStageIndex = getCurrentStageIndex(run.stage);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-medium"
          >
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Run #{run.id} Details
            </DialogTitle>
            <DialogDescription>
              Created on{" "}
              {format(new Date(run.created_at), "MMMM d, yyyy 'at' h:mm a")}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <div className="mt-1">
                    <span className={getStatusBadge(run.status)}>
                      {getStatusIcon(run.status)}
                      {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Stage
                  </p>
                  <p className="mt-1 text-sm font-medium capitalize">
                    {run.stage}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Amount
                  </p>
                  <p className="mt-1 text-lg font-bold text-green-600">
                    ₪{run.amount.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Notifications
                  </p>
                  <div className="mt-1">
                    <span className={getNotificationBadge(run.is_notify)}>
                      {run.is_notify ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Process Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Process Timeline</h3>
                <div className="space-y-4">
                  {stages.map((stage, index) => {
                    const isActive = index === currentStageIndex;
                    const isCompleted =
                      index < currentStageIndex ||
                      (index === currentStageIndex && run.status === "success");
                    const isFailed =
                      index === currentStageIndex && run.status === "failed";

                    return (
                      <div
                        key={stage.id}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex flex-col items-center">
                          {getStageIcon(stage.id, run.stage, run.status)}
                          {index < stages.length - 1 && (
                            <div
                              className={`w-0.5 h-8 mt-2 ${
                                isCompleted ? "bg-green-500" : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center space-x-2">
                            <h4
                              className={`font-medium ${
                                isActive
                                  ? "text-foreground"
                                  : isCompleted
                                  ? "text-green-600"
                                  : isFailed
                                  ? "text-red-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {stage.name}
                            </h4>
                            {isActive && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>In Progress</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Screenshots */}
              {run.Screenshots && run.Screenshots.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Screenshots</h3>
                  <div className="grid gap-4">
                    {run.Screenshots.map((screenshot, index) => (
                      <div key={screenshot.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Screenshot {index + 1}
                          </span>
                          {screenshot.is_error && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error Screenshot
                            </span>
                          )}
                        </div>
                        <img
                          src={screenshot.url}
                          alt={`Screenshot ${index + 1} for run ${run.id}`}
                          className="max-w-full h-auto rounded-lg border shadow-sm"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

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
