import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Automation fires at 10:00 Israel time (Asia/Jerusalem). The countdown targets that
// wall-clock time regardless of the viewer's own timezone.
const RUN_TIMEZONE = "Asia/Jerusalem";
const RUN_HOUR = 10;
const RUN_MINUTE = 0;
// Valid days in Israel local time: Sun(0), Mon(1), Tue(2), Wed(3), Thu(4).
const VALID_DAYS = [0, 1, 2, 3, 4];

// Wall-clock components of an instant as seen in the given timezone.
function getZonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const map: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  // Intl emits hour "24" at midnight in some engines; normalize to 0.
  if (map.hour === 24) map.hour = 0;
  return map as {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
}

// Convert a wall-clock time in `timeZone` to the matching UTC instant, accounting
// for that zone's offset (incl. DST) on that specific date.
function zonedWallClockToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const zoned = getZonedParts(new Date(guess), timeZone);
  const zonedAsUtc = Date.UTC(
    zoned.year,
    zoned.month - 1,
    zoned.day,
    zoned.hour,
    zoned.minute,
    zoned.second
  );
  const offset = zonedAsUtc - guess;
  return new Date(guess - offset);
}

function getNextRun(): Date {
  const now = new Date();
  const il = getZonedParts(now, RUN_TIMEZONE);
  const todayDow = new Date(Date.UTC(il.year, il.month - 1, il.day)).getUTCDay();
  const nowMinutes = il.hour * 60 + il.minute + il.second / 60;
  const runMinutes = RUN_HOUR * 60 + RUN_MINUTE;

  const buildRun = (y: number, m: number, d: number) =>
    zonedWallClockToUtc(y, m, d, RUN_HOUR, RUN_MINUTE, RUN_TIMEZONE);

  if (VALID_DAYS.includes(todayDow) && nowMinutes < runMinutes) {
    return buildRun(il.year, il.month, il.day);
  }

  for (let i = 1; i <= 7; i++) {
    const candidate = new Date(Date.UTC(il.year, il.month - 1, il.day));
    candidate.setUTCDate(candidate.getUTCDate() + i);
    if (VALID_DAYS.includes(candidate.getUTCDay())) {
      return buildRun(
        candidate.getUTCFullYear(),
        candidate.getUTCMonth() + 1,
        candidate.getUTCDate()
      );
    }
  }
  return buildRun(il.year, il.month, il.day);
}

export default function NextRunBanner() {
  const { t } = useTranslation("runs");
  const [timeUntilNextRun, setTimeUntilNextRun] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextRun = getNextRun();
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
