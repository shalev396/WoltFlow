import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import type { RunItem } from "@/types";

interface RunDetailsDialogProps {
  run: RunItem;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RunDetailsDialog({
  run,
  trigger,
  open,
  onOpenChange,
}: RunDetailsDialogProps) {
  const getStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
      case "failed":
        return `${base} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
      case "in_progress":
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "";
      case "failed":
        return "";
      case "in_progress":
        return "";
      default:
        return "";
    }
  };

  const stages = [
    {
      id: "triggered",
      name: "Run Triggered",
      description: "Automation process started",
    },
    {
      id: "refreshing_tokens",
      name: "Refreshing Tokens",
      description: "Updating authentication tokens",
    },
    {
      id: "buying_gift",
      name: "Buying Gift Card",
      description: "Purchasing gift card from Wolt",
    },
    {
      id: "getting_code_from_email",
      name: "Getting Code",
      description: "Retrieving gift code from email",
    },
    {
      id: "applying_gift",
      name: "Applying Gift",
      description: "Adding gift code to account",
    },
    {
      id: "completed",
      name: "Process Complete",
      description: "All steps completed successfully",
    },
  ];

  const getStageOrder = (stage: string) =>
    [
      "triggered",
      "refreshing_tokens",
      "buying_gift",
      "getting_code_from_email",
      "applying_gift",
      "completed",
    ].indexOf(stage);

  const getStageIcon = (stage: string, current: string, status: string) => {
    const idx = getStageOrder(stage);
    const cur = getStageOrder(current);
    if (status === "failed" && idx === cur)
      return <XCircle className="w-4 h-4 text-red-500" />;
    if (idx < cur || (idx === cur && status === "success"))
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (idx === cur && status === "in progress")
      return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
    return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-medium"
          >
            View Details
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Run #{run.id} Details
          </DialogTitle>
          <DialogDescription>
            Created on{" "}
            {format(new Date(run.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
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
                  {run.stage.replace(/_/g, " ")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Mode
                </p>
                <p className="mt-1 text-lg font-bold text-blue-600">
                  {run.automationMode}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Process Timeline</h3>
              <div className="space-y-4">
                {stages.map((stage, i) => {
                  const currentStageIndex = getStageOrder(run.stage);
                  const isActive = i === currentStageIndex;
                  const isDone =
                    i < currentStageIndex ||
                    (i === currentStageIndex && run.status === "completed");
                  const isError =
                    i === currentStageIndex && run.status === "failed";

                  return (
                    <div key={stage.id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        {getStageIcon(stage.id, run.stage, run.status)}
                        {i < stages.length - 1 && (
                          <div
                            className={`w-0.5 h-8 mt-2 ${
                              isDone
                                ? "bg-green-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center space-x-2">
                          <h4
                            className={`font-medium ${
                              isDone
                                ? "text-green-600 dark:text-green-400"
                                : isActive && run.status === "in_progress"
                                ? "text-blue-600 dark:text-blue-400 font-semibold"
                                : isError
                                ? "text-red-600 dark:text-red-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {stage.name}
                          </h4>
                          {isActive && run.status === "in_progress" && (
                            <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                              <Clock className="w-3 h-3 animate-pulse" />
                              <span className="font-medium">In Progress</span>
                            </div>
                          )}
                          {isDone && (
                            <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              <span className="font-medium">Completed</span>
                            </div>
                          )}
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            isDone
                              ? "text-green-700 dark:text-green-300"
                              : isActive
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-muted-foreground"
                          }`}
                        >
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {run.screenshots && run.screenshots.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Screenshots</h3>
                  <div className="grid gap-4">
                    {run.screenshots.map((sc, idx: number) => (
                      <div key={sc.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Screenshot {idx + 1}
                          </span>
                          {sc.isError && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error Screenshot
                            </span>
                          )}
                        </div>
                        <img
                          src={sc.screenshotUrl}
                          alt={`Screenshot ${idx + 1} for run ${run.id}`}
                          loading="lazy"
                          className="max-w-full h-auto rounded-lg border shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
