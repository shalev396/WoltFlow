import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NextRunBanner() {
  const { t } = useTranslation("runs");
  const [timeUntilNextRun, setTimeUntilNextRun] = useState<string>("");

  useEffect(() => {
    // Automation runs at 08:30 UTC (10:30 Israel winter / 11:30 Israel summer)
    // Valid days: Sun(0), Mon(1), Tue(2), Wed(3), Thu(4). Skip Fri(5), Sat(6).
    const RUN_HOUR_UTC = 8;
    const RUN_MINUTE_UTC = 30;
    const VALID_DAYS = [0, 1, 2, 3, 4];

    const getNextRunUtc = (): Date => {
      const now = new Date();
      const currentDay = now.getUTCDay();
      const currentMinutes =
        now.getUTCHours() * 60 + now.getUTCMinutes() + now.getUTCSeconds() / 60;
      const runMinutes = RUN_HOUR_UTC * 60 + RUN_MINUTE_UTC;

      const buildRunDate = (d: Date) =>
        new Date(
          Date.UTC(
            d.getUTCFullYear(),
            d.getUTCMonth(),
            d.getUTCDate(),
            RUN_HOUR_UTC,
            RUN_MINUTE_UTC,
            0,
            0
          )
        );

      if (VALID_DAYS.includes(currentDay) && currentMinutes < runMinutes) {
        return buildRunDate(now);
      }

      for (let i = 1; i <= 7; i++) {
        const next = new Date(now);
        next.setUTCDate(now.getUTCDate() + i);
        if (VALID_DAYS.includes(next.getUTCDay())) {
          return buildRunDate(next);
        }
      }
      return buildRunDate(now);
    };

    const updateCountdown = () => {
      const now = new Date();
      const nextRun = getNextRunUtc();
      const timeDiff = nextRun.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeUntilNextRun("0s");
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);
      setTimeUntilNextRun(parts.join(" "));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          {t("nextRunBanner.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Countdown Display */}
          <div className="md:col-span-2">
            <div
              className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20 border border-blue-200/50 dark:border-blue-700/50"
              aria-live="polite"
              aria-label={t("table.accessibility.timeUntilNextRun")}
            >
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("nextRunBanner.timeUntilRun")}
              </p>
              <p className="text-xl sm:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {timeUntilNextRun || t("nextRunBanner.calculating")}
              </p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/30 dark:bg-black/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("nextRunBanner.status")}
                </p>
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800"
                >
                  <div className="size-2 rounded-full bg-green-500 mr-1" />
                  {t("nextRunBanner.active")}
                </Badge>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/30 dark:bg-black/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("nextRunBanner.schedule")}
                </p>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">
                    {t("nextRunBanner.dailyTime")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("nextRunBanner.dailyTimeDetail")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("nextRunBanner.runDays")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Play className="h-4 w-4" />
            <span>{t("nextRunBanner.automaticExecution")}</span>
          </div>
          <div className="text-muted-foreground">
            <span>{t("nextRunBanner.nextRun")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
