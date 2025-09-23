import { useState } from "react";
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
            Filters
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
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-500" />
                    Completed
                  </div>
                </SelectItem>
                <SelectItem value="failed">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-red-500" />
                    Failed
                  </div>
                </SelectItem>
                <SelectItem value="in_progress">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-yellow-500" />
                    In Progress
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stage Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Stage</label>
            <Select
              value={filters.stage || "all"}
              onValueChange={(value) => handleFilterChange("stage", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                <SelectItem value="triggered">Triggered</SelectItem>
                <SelectItem value="refreshing_tokens">
                  Refreshing Tokens
                </SelectItem>
                <SelectItem value="buying_gift">Buying Gift</SelectItem>
                <SelectItem value="getting_code_from_email">
                  Getting Code from Email
                </SelectItem>
                <SelectItem value="applying_gift">Applying Gift</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Automation Mode Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Mode</label>
            <Select
              value={filters.automationMode || "all"}
              onValueChange={(value) =>
                handleFilterChange("automationMode", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modes</SelectItem>
                <SelectItem value="full-run">
                  <div className="flex items-center gap-2">
                    <span>🚀</span>
                    Complete Automation
                  </div>
                </SelectItem>
                <SelectItem value="buy-only">
                  <div className="flex items-center gap-2">
                    <span>🛒</span>
                    Buy Only
                  </div>
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
                Active filters:
              </span>
              {filters.status && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Status: {filters.status}
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
                  Stage: {filters.stage.replace("_", " ")}
                  <button
                    onClick={() => handleFilterChange("stage", undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.automationMode && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Mode: {filters.automationMode}
                  <button
                    onClick={() =>
                      handleFilterChange("automationMode", undefined)
                    }
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
