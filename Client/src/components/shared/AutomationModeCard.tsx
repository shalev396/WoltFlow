import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("settings");

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">
            {mode.id === "full-run"
              ? "🚀"
              : mode.id === "buy-only"
              ? "🛒"
              : "⚡"}
          </span>
          {mode.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{mode.description}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Flow */}
        <div>
          <h4 className="font-medium text-sm mb-2">
            {t("automationModesHelp.card.howItWorks")}
          </h4>
          <div className="space-y-1">
            {mode.flow.map((step, index) => (
              <div key={index} className="text-xs flex items-center gap-2">
                <span className="w-4 h-4 bg-muted rounded-full flex items-center justify-center text-[10px] font-medium">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Pros/Cons */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h5 className="font-medium text-xs text-green-700 dark:text-green-400 mb-1">
              {t("automationModesHelp.card.pros")}
            </h5>
            <ul className="space-y-1">
              {mode.pros.map((pro, index) => (
                <li
                  key={index}
                  className="text-xs text-muted-foreground flex items-start gap-1"
                >
                  <span className="text-green-600 mt-0.5">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-xs text-red-700 dark:text-red-400 mb-1">
              {t("automationModesHelp.card.cons")}
            </h5>
            <ul className="space-y-1">
              {mode.cons.map((con, index) => (
                <li
                  key={index}
                  className="text-xs text-muted-foreground flex items-start gap-1"
                >
                  <span className="text-red-600 mt-0.5">×</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Requirements */}
        <div>
          <h5 className="font-medium text-xs mb-2">
            {t("automationModesHelp.card.requirements")}
          </h5>
          <div className="flex flex-wrap gap-1">
            {mode.requirements.map((req, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {req}
              </Badge>
            ))}
          </div>
        </div>

        {/* Best for */}
        <div className="mt-auto pt-2">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">
              {t("automationModesHelp.card.bestFor")}
            </span>{" "}
            {mode.bestFor}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
