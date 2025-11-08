import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NextRunBanner() {
  const { t } = useTranslation("runs");
  const [timeUntilNextRun, setTimeUntilNextRun] = useState<string>("");

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
