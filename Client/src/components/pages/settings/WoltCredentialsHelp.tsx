import { HelpCircle, AlertTriangle, ExternalLink } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

export function WoltCredentialsHelp() {
  const { t } = useTranslation("settings");

  const handleOpenExtension = () => {
    window.open(
      "https://chromewebstore.google.com/detail/woltflow-token-reviewer/ghlbloemllihpoephjhmimdodfodnmcf?authuser=0&hl=iw",
      "_blank"
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">{t("woltCredentialsHelp.title")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw] w-full max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            {t("woltCredentialsHelp.title")}
          </DialogTitle>
          <DialogDescription>
            {t("woltCredentialsHelp.description")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Important Notice */}
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>
                  {t("woltCredentialsHelp.importantNotice.title")}
                </strong>{" "}
                {t("woltCredentialsHelp.importantNotice.message")}
              </AlertDescription>
            </Alert>

            {/* Step-by-step instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("woltCredentialsHelp.steps.title")}
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    1
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">
                      {t("woltCredentialsHelp.steps.step1.title")}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t("woltCredentialsHelp.steps.step1.description")}
                    </p>
                    <Button
                      onClick={handleOpenExtension}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("woltCredentialsHelp.steps.step1.button")}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    2
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">
                      {t("woltCredentialsHelp.steps.step2.title")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("woltCredentialsHelp.steps.step2.description")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    3
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">
                      {t("woltCredentialsHelp.steps.step3.title")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("woltCredentialsHelp.steps.step3.description")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    4
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">
                      {t("woltCredentialsHelp.steps.step4.title")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("woltCredentialsHelp.steps.step4.description")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    5
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">
                      {t("woltCredentialsHelp.steps.step5.title")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("woltCredentialsHelp.steps.step5.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional tips */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                {t("woltCredentialsHelp.tips.title")}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{t("woltCredentialsHelp.tips.tip1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{t("woltCredentialsHelp.tips.tip2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{t("woltCredentialsHelp.tips.tip3")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{t("woltCredentialsHelp.tips.tip4")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{t("woltCredentialsHelp.tips.tip5")}</span>
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
