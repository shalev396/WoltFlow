// Map mode IDs to emojis
const modeIcons: Record<string, string> = {
  "full-run": "🚀",
  "buy-only": "🛒",
  "cross-account": "⚡",
};
import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Mode {
  id: string;
  name: string;
  description: string;
  flow: string[];
  pros: string[];
  cons: string[];
  requirements: string[];
  bestFor: string;
}
interface AutomationModeCardProps {
  mode: Mode;
}

export function AutomationModeCard({ mode }: AutomationModeCardProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex flex-col h-full rounded-lg overflow-hidden">
        <CardHeader className="px-4 pt-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="h-6 w-6 flex items-center justify-center text-base"
              >
                {modeIcons[mode.id]}
              </Badge>
              <div>
                <CardTitle className="text-base font-semibold">
                  {mode.name}
                </CardTitle>
                <CardDescription
                  className="overflow-hidden h-8 text-xs"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {mode.description}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-rows-[auto_1fr_auto] px-4 pb-4 gap-4">
          {/* Row 1: Name + Description handled by CardHeader */}
          <div />
          {/* Row 2: Main content sections */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide mb-1">
                How it works
              </h4>
              <ul className="space-y-1 text-xs h-[106px] max-h-[106px] overflow-y-auto">
                {mode.flow.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 text-muted-foreground">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide mb-1 flex items-center gap-1 text-green-700">
                <CheckCircle className="h-3 w-3" /> Advantages
              </h4>
              <ul className="space-y-1 text-xs min-h-[3rem]">
                {mode.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide mb-1 flex items-center gap-1 text-orange-700">
                <XCircle className="h-3 w-3" /> Considerations
              </h4>
              <ul className="space-y-1 text-xs min-h-[3rem]">
                {mode.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide mb-1">
                Requirements
              </h4>
              <div className="flex flex-wrap gap-1 h-[48px] max-h-[48px] overflow-y-auto">
                {mode.requirements.map((req, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-sm px-3 py-1 rounded-md"
                  >
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {/* Row 3: Best for */}
          <div className="h-[56px] flex items-center bg-muted/50 rounded-md px-3 py-2 mt-2">
            <span className="text-base mr-2">💡</span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mr-1">
                Best for:
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {mode.bestFor}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
