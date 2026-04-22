import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RunFilters } from "@/types";

interface RunsFiltersProps {
  onFiltersChange?: (filters: RunFilters) => void;
}

export default function RunsFilters({ onFiltersChange }: RunsFiltersProps) {
  const { t } = useTranslation("runs");
  const [filters, setFilters] = useState<RunFilters>({});

  const handleFilterChange = (
    key: keyof RunFilters,
    value: string | undefined
  ) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? undefined : value,
    };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onFiltersChange?.(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-4 w-4" />
            {t("filters.title")}
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              {t("filters.clear")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("filters.status")}
            </label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-500" />
                    {t("table.status.completed")}
                  </div>
                </SelectItem>
                <SelectItem value="failed">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-red-500" />
                    {t("table.status.failed")}
                  </div>
                </SelectItem>
                <SelectItem value="in_progress">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-yellow-500" />
                    {t("table.status.inProgress")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stage Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("filters.stage")}
            </label>
            <Select
              value={filters.stage || "all"}
              onValueChange={(value) => handleFilterChange("stage", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.allStages")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allStages")}</SelectItem>
                <SelectItem value="triggered">
                  {t("table.stages.triggered")}
                </SelectItem>
                <SelectItem value="refreshing_tokens">
                  {t("table.stages.refreshingTokens")}
                </SelectItem>
                <SelectItem value="buying_gift">
                  {t("table.stages.buyingGift")}
                </SelectItem>
                <SelectItem value="getting_code_from_email">
                  {t("table.stages.gettingCode")}
                </SelectItem>
                <SelectItem value="applying_gift">
                  {t("table.stages.applyingGift")}
                </SelectItem>
                <SelectItem value="completed">
                  {t("table.stages.completed")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">
                {t("filters.activeFilters")}
              </span>
              {filters.status && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {t("filters.statusLabel", { status: filters.status })}
                  <button
                    onClick={() => handleFilterChange("status", undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.stage && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {t("filters.stageLabel", {
                    stage: filters.stage.replace("_", " "),
                  })}
                  <button
                    onClick={() => handleFilterChange("stage", undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
