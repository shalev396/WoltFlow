"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Chart Container
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: Record<string, unknown>;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex aspect-auto justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ChartContainer.displayName = "ChartContainer";

// Chart Tooltip
interface ChartTooltipProps {
  content?: React.ComponentType<unknown> | React.ReactElement;
  cursor?: boolean | object;
  [key: string]: unknown;
}

const ChartTooltip = ({ content, cursor, ...props }: ChartTooltipProps) => {
  return (
    <RechartsPrimitive.Tooltip
      cursor={cursor}
      content={content as never}
      {...props}
    />
  );
};
ChartTooltip.displayName = "ChartTooltip";

// Chart Tooltip Content
interface ChartTooltipContentProps {
  indicator?: "line" | "dot" | "dashed";
  labelFormatter?: (value: string | number) => React.ReactNode;
  [key: string]: unknown;
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(({ ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"
      )}
      {...props}
    />
  );
});
ChartTooltipContent.displayName = "ChartTooltipContent";

// Chart Legend
const ChartLegend = ({ ...props }) => {
  return <RechartsPrimitive.Legend {...props} />;
};
ChartLegend.displayName = "ChartLegend";

// Chart Legend Content
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", className)}
      {...props}
    />
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  )
>;

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
};
