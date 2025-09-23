import { Button } from "../../ui/button";
import { useConsent } from "../../../hooks/useConsent";
import { Cookie, Settings } from "lucide-react";

interface CookieSettingsProps {
  variant?: "button" | "link";
  className?: string;
}

/**
 * Component for accessing cookie settings after initial consent
 * Can be placed in settings page, footer, or privacy policy
 */
export function CookieSettings({
  variant = "button",
  className = "",
}: CookieSettingsProps) {
  const { showConsentBanner } = useConsent();

  if (variant === "link") {
    return (
      <button
        onClick={showConsentBanner}
        className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline ${className}`}
      >
        <Cookie className="w-4 h-4" />
        Cookie Preferences
      </button>
    );
  }

  return (
    <Button
      onClick={showConsentBanner}
      variant="outline"
      size="sm"
      className={`gap-2 ${className}`}
    >
      <Settings className="w-4 h-4" />
      Cookie Preferences
    </Button>
  );
}
