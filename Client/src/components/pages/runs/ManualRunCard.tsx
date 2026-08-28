import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, Ban, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useManualRunStatusQuery,
  useTriggerManualRunMutation,
} from "@/queries/runs";
import { ManualRunRequirementsHelp } from "./ManualRunRequirementsHelp";

function formatRemaining(endsAt: string, now: number): string {
  const ms = Math.max(0, new Date(endsAt).getTime() - now);
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ManualRunCard() {
  const { t } = useTranslation("runs");
  const { data, isLoading, isError, refetch } = useManualRunStatusQuery();
  const triggerMutation = useTriggerManualRunMutation();
  const [now, setNow] = useState(() => Date.now());

  const cooldownEndsAt = data?.cooldown?.endsAt;
  const cooldownActive =
    !!cooldownEndsAt && new Date(cooldownEndsAt).getTime() > now;

  useEffect(() => {
    if (!cooldownEndsAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [cooldownEndsAt]);

  useEffect(() => {
    if (!cooldownEndsAt) return;
    const remaining = new Date(cooldownEndsAt).getTime() - Date.now();
    if (remaining <= 0) {
      void refetch();
      return;
    }
    const timeout = setTimeout(() => {
      void refetch();
    }, remaining + 250);
    return () => clearTimeout(timeout);
  }, [cooldownEndsAt, refetch]);

  const settingsIssues = useMemo(
    () => data?.issues.filter((i) => i.code !== "cooldown_active") ?? [],
    [data?.issues],
  );
  const hasSettingsIssues = settingsIssues.length > 0;
  const canRun =
    !!data?.featureEnabled &&
    !hasSettingsIssues &&
    !cooldownActive &&
    !triggerMutation.isPending;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2 pt-4 px-4">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-9 w-28" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full flex-col justify-center gap-3 px-4 py-4">
          <p className="text-sm text-muted-foreground">
            {t("manualRun.loadError")}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t("table.tryAgain")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data.featureEnabled) {
    return (
      <Card className="h-full border-muted bg-muted/30">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Ban className="h-4 w-4 text-muted-foreground shrink-0" />
            {t("manualRun.disabled.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-sm text-muted-foreground">
            {t("manualRun.disabled.description")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Play className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            {t("manualRun.enabled.title")}
          </CardTitle>
          {hasSettingsIssues && (
            <Badge
              variant="outline"
              className="shrink-0 text-xs bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200"
            >
              {t("manualRun.requirementsNotMet")}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {t("manualRun.enabled.description")}
        </p>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => triggerMutation.mutate()}
            disabled={!canRun}
            className="w-full sm:w-auto"
            size="sm"
          >
            {triggerMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("manualRun.starting")}
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {t("manualRun.runNow")}
              </>
            )}
          </Button>

          {hasSettingsIssues && (
            <div className="flex items-center gap-1 text-sm text-orange-800 dark:text-orange-200">
              <span>{t("manualRun.requirementsNotMet")}</span>
              <ManualRunRequirementsHelp issues={data.issues} />
            </div>
          )}

          {!hasSettingsIssues && cooldownActive && cooldownEndsAt && (
            <p className="text-sm text-muted-foreground">
              {t("manualRun.cooldown", {
                time: formatRemaining(cooldownEndsAt, now),
              })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
