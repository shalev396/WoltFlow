import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  isLoading?: boolean;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

const variantStyles = {
  default: "border-border",
  success:
    "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20",
  warning:
    "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20",
  destructive:
    "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20",
};

const iconStyles = {
  default: "text-primary",
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  destructive: "text-red-600 dark:text-red-400",
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isLoading,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon
          className={cn("h-4 w-4", iconStyles[variant])}
          aria-hidden="true"
        />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              value
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{description}</p>
            {trend && !isLoading && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs",
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3 w-3" aria-hidden="true" />
                )}
                <span>
                  {trend.isPositive ? "+" : ""}
                  {trend.value}% {trend.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
