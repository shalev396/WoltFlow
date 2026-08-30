import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RunFilters } from "@/types";

interface RunsFilterBarProps {
  filters: RunFilters;
  onFiltersChange: (filters: RunFilters) => void;
}

const STATUS_OPTIONS = [
  "completed",
  "failed",
  "in_progress",
  "started",
] as const;

function statusLabel(
  t: (key: string) => string,
  status: string | undefined,
): string {
  switch (status) {
    case "completed":
      return t("table.status.completed");
    case "failed":
      return t("table.status.failed");
    case "in_progress":
      return t("table.status.inProgress");
    case "started":
      return t("table.status.started");
    default:
      return t("table.status.allStatuses");
  }
}

export function RunsFilterBar({
  filters,
  onFiltersChange,
}: RunsFilterBarProps) {
  const { t } = useTranslation("runs");
  const hasStatusFilter = Boolean(filters.status);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 py-4">
      <Select
        value={filters.status || "all"}
        onValueChange={(value) =>
          onFiltersChange({
            status: value === "all" ? undefined : value,
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]" size="sm">
          <SelectValue placeholder={t("table.filters.filterByStatus")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("table.status.allStatuses")}</SelectItem>
          {STATUS_OPTIONS.map((value) => (
            <SelectItem key={value} value={value}>
              {statusLabel(t, value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasStatusFilter && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-foreground/25 bg-background font-medium text-foreground hover:bg-accent self-start"
          onClick={() => onFiltersChange({})}
        >
          <X className="h-3.5 w-3.5 mr-1" />
          {t("table.filters.clear")}
        </Button>
      )}
    </div>
  );
}
