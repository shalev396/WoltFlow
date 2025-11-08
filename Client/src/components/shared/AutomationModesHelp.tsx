import { HelpCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AutomationModeCard } from "@/components/shared/AutomationModeCard";

export function AutomationModesHelp() {
  const { t } = useTranslation("settings");

  const modes = [
    {
      id: "full-run",
      name: t("automationModesHelp.modes.fullRun.name"),
      description: t("automationModesHelp.modes.fullRun.description"),
      flow: [
        t("automationModesHelp.modes.fullRun.flow.step1"),
        t("automationModesHelp.modes.fullRun.flow.step2"),
        t("automationModesHelp.modes.fullRun.flow.step3"),
        t("automationModesHelp.modes.fullRun.flow.step4"),
      ],
      pros: [
        t("automationModesHelp.modes.fullRun.pros.pro1"),
        t("automationModesHelp.modes.fullRun.pros.pro2"),
        t("automationModesHelp.modes.fullRun.pros.pro3"),
      ],
      cons: [t("automationModesHelp.modes.fullRun.cons.con1")],
      requirements: [
        t("automationModesHelp.modes.fullRun.requirements.req1"),
        t("automationModesHelp.modes.fullRun.requirements.req2"),
        t("automationModesHelp.modes.fullRun.requirements.req3"),
      ],
      bestFor: t("automationModesHelp.modes.fullRun.bestFor"),
    },
    {
      id: "buy-only",
      name: t("automationModesHelp.modes.buyOnly.name"),
      description: t("automationModesHelp.modes.buyOnly.description"),
      flow: [
        t("automationModesHelp.modes.buyOnly.flow.step1"),
        t("automationModesHelp.modes.buyOnly.flow.step2"),
        t("automationModesHelp.modes.buyOnly.flow.step3"),
        t("automationModesHelp.modes.buyOnly.flow.step4"),
      ],
      pros: [
        t("automationModesHelp.modes.buyOnly.pros.pro1"),
        t("automationModesHelp.modes.buyOnly.pros.pro2"),
        t("automationModesHelp.modes.buyOnly.pros.pro3"),
      ],
      cons: [t("automationModesHelp.modes.buyOnly.cons.con1")],
      requirements: [
        t("automationModesHelp.modes.buyOnly.requirements.req1"),
        t("automationModesHelp.modes.buyOnly.requirements.req2"),
      ],
      bestFor: t("automationModesHelp.modes.buyOnly.bestFor"),
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">
            {t("automationModesHelp.accessibilityLabel")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl w-full max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            {t("automationModesHelp.title")}
          </DialogTitle>
          <DialogDescription>
            {t("automationModesHelp.description")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Overview */}
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>{t("automationModesHelp.quickGuide.title")}</strong>{" "}
                {t("automationModesHelp.quickGuide.message")}
              </AlertDescription>
            </Alert>

            {/* Improved Layout for 2 Modes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {modes.map((mode) => (
                <div key={mode.id} className="flex flex-col h-full">
                  <AutomationModeCard mode={mode} />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
