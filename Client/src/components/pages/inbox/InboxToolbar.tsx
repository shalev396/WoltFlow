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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Label filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={selectedLabel || "all"}
              onValueChange={(value) =>
                onLabelChange(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by label..." />
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

          {/* Clear filters */}
          {hasActiveFilters && (
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

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">
              Active filters:
            </span>

            {searchQuery && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: "{searchQuery}"
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
              <Badge variant="outline" className="flex items-center gap-1">
                Label: {labels.find((l) => l.value === selectedLabel)?.label}
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
