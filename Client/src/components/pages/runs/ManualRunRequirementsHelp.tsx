import { HelpCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import type { ManualRunStatusResponseData } from "@/types";

type IssueCode = ManualRunStatusResponseData["issues"][number]["code"];

interface ManualRunRequirementsHelpProps {
  issues: ManualRunStatusResponseData["issues"];
}

export function ManualRunRequirementsHelp({
  issues,
}: ManualRunRequirementsHelpProps) {
  const { t } = useTranslation("runs");
  const { language } = useLanguage();

  const displayIssues = issues.filter((i) => i.code !== "cooldown_active");

  if (displayIssues.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">{t("manualRun.requirementsHelp.title")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-lg w-full max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            {t("manualRun.requirementsHelp.title")}
          </DialogTitle>
          <DialogDescription>
            {t("manualRun.requirementsHelp.description")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                {t("manualRun.requirementsHelp.notice")}
              </AlertDescription>
            </Alert>

            <ul className="space-y-3">
              {displayIssues.map((issue, index) => {
                const code = issue.code as IssueCode;
                return (
                  <li
                    key={code}
                    className="flex gap-3 rounded-lg border p-3 bg-muted/30"
                  >
                    <Badge
                      variant="outline"
                      className="min-w-[24px] h-6 flex items-center justify-center shrink-0"
                    >
                      {index + 1}
                    </Badge>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">
                        {t(`manualRun.issues.${code}.title`)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(`manualRun.issues.${code}.fix`)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Button asChild className="w-full sm:w-auto">
              <Link to={`/${language}/settings`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                {t("manualRun.requirementsHelp.openSettings")}
              </Link>
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
