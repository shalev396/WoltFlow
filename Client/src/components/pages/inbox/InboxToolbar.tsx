import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface InboxToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLabel: string | null;
  onLabelChange: (label: string | null) => void;
}

const labels = [
  { value: "automation", label: "Automation", color: "blue" },
  { value: "gift-card", label: "Gift Card", color: "green" },
  { value: "error", label: "Error", color: "red" },
  { value: "alert", label: "Alert", color: "yellow" },
  { value: "summary", label: "Summary", color: "purple" },
  { value: "balance", label: "Balance", color: "orange" },
];

export default function InboxToolbar({
  searchQuery,
  onSearchChange,
  selectedLabel,
  onLabelChange,
}: InboxToolbarProps) {
  const clearFilters = () => {
    onSearchChange("");
    onLabelChange(null);
  };

  const hasActiveFilters = searchQuery || selectedLabel;

  return (
    <div className="border-b bg-background">
      <div className="px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          {/* Search - full width on mobile */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          {/* Filters and actions row */}
          <div className="flex items-center gap-2 sm:gap-4 justify-between sm:justify-end">
            {/* Label filter - compact on mobile */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select
                value={selectedLabel || "all"}
                onValueChange={(value) =>
                  onLabelChange(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-32 sm:w-48 text-sm">
                  <SelectValue placeholder="Filter..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All labels</SelectItem>
                  {labels.map((label) => (
                    <SelectItem key={label.value} value={label.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full bg-${label.color}-500`}
                          aria-hidden="true"
                        />
                        {label.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear filters - compact on mobile */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Clear filters</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display - responsive */}
        {hasActiveFilters && (
          <div className="mt-2 sm:mt-3 flex items-start sm:items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">
              Active:
            </span>

            {searchQuery && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Search:</span>
                <span className="sm:hidden">🔍</span>
                <span className="truncate max-w-24 sm:max-w-none">
                  "{searchQuery}"
                </span>
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-1 hover:text-destructive"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {selectedLabel && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Label:</span>
                <span className="sm:hidden">🏷️</span>
                <span className="truncate max-w-20 sm:max-w-none">
                  {labels.find((l) => l.value === selectedLabel)?.label}
                </span>
                <button
                  onClick={() => onLabelChange(null)}
                  className="ml-1 hover:text-destructive"
                  aria-label="Clear label filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
