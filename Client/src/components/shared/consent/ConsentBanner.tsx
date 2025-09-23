import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { useConsent } from "../../../hooks/useConsent";
import { Cookie } from "lucide-react";

export function ConsentBanner() {
  const { consentState, acceptAll, acceptEssentialOnly } = useConsent();

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
                  We use cookies to improve your experience
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use essential cookies to make our website work and optional
                  analytics cookies to understand how you interact with it.
                  Essential cookies cannot be disabled as they are necessary for
                  the website to function properly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <Button
                  onClick={acceptAll}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Accept All Cookies
                </Button>
                <Button
                  onClick={acceptEssentialOnly}
                  variant="outline"
                  className="border-border hover:bg-muted"
                >
                  Essential Only
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
