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

function zonedWallClockToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const zoned = getZonedParts(new Date(guess), timeZone);
  const zonedAsUtc = Date.UTC(
    zoned.year,
    zoned.month - 1,
    zoned.day,
    zoned.hour,
    zoned.minute,
    zoned.second,
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
        candidate.getUTCDate(),
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
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
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
    <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          {t("nextRunBanner.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 space-y-3">
        <div
          className="text-center py-2.5 px-3 rounded-lg bg-white/50 dark:bg-black/20 border border-blue-200/50 dark:border-blue-700/50"
          aria-live="polite"
          aria-label={t("table.accessibility.timeUntilNextRun")}
        >
          <p className="text-xs font-medium text-muted-foreground mb-0.5">
            {t("nextRunBanner.timeUntilRun")}
          </p>
          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tabular-nums">
            {timeUntilNextRun || t("nextRunBanner.calculating")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase tracking-wide">
              {t("nextRunBanner.status")}
            </span>
            <Badge
              variant="outline"
              className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-xs"
            >
              <div className="size-1.5 rounded-full bg-green-500 mr-1" />
              {t("nextRunBanner.active")}
            </Badge>
          </div>
          <div className="text-muted-foreground text-end">
            <span className="font-medium text-foreground">
              {t("nextRunBanner.dailyTime")}
            </span>
            <span className="mx-1">·</span>
            <span>{t("nextRunBanner.runDays")}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Play className="h-3 w-3 shrink-0" />
          <span>{t("nextRunBanner.automaticExecution")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
