import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { useConsent } from "../../../hooks/useConsent";
import { Cookie } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ConsentBanner() {
  const { consentState, acceptAll, acceptEssentialOnly } = useConsent();
  const { t } = useTranslation("consent");

  if (!consentState.showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("banner.title")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("banner.description")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <Button
                  onClick={acceptAll}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {t("banner.acceptAll")}
                </Button>
                <Button
                  onClick={acceptEssentialOnly}
                  variant="outline"
                  className="border-border hover:bg-muted"
                >
                  {t("banner.essentialOnly")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
