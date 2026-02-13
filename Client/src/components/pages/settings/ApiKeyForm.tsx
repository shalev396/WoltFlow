import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import AsyncButton from "@/components/shared/AsyncButton";

import { settingsService } from "@/services/settings";

export default function ApiKeyForm() {
  const { t } = useTranslation("settings");
  const { language } = useLanguage();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateApiKey = async () => {
    setIsLoading(true);
    try {
      const result = await settingsService.generateApiKey();
      setApiKey(result.apiKey);
      setShowApiKey(true);
      toast.success("API key generated successfully", {
        description: "Your new API key is ready to use",
      });
    } catch (error) {
      console.error("Failed to generate API key:", error);
      toast.error("Failed to generate API key", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyApiKey = async () => {
    if (apiKey) {
      try {
        await navigator.clipboard.writeText(apiKey);
        toast.success("API key copied to clipboard");
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = apiKey;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          toast.success("API key copied to clipboard");
        } catch {
          toast.error("Failed to copy API key");
        }
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          {t("apiKeyForm.title")}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed break-words">
          {t("apiKeyForm.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          {/* Info Alert */}
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-3">
              <span className="text-sm leading-relaxed break-words">
                {t("apiKeyForm.infoAlert")}
              </span>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full sm:w-fit"
              >
                <Link
                  to={`/${language}/docs/email-forwarding`}
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">
                    {t("apiKeyForm.viewDocs")}
                  </span>
                  <span className="sm:hidden">
                    {t("apiKeyForm.viewDocsShort")}
                  </span>
                </Link>
              </Button>
            </AlertDescription>
          </Alert>

          {/* API Key Generation Section */}
          <div className="space-y-4">
            {!apiKey ? (
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label>{t("apiKeyForm.generate.title")}</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed break-words">
                    {t("apiKeyForm.generate.description")}
                  </p>
                </div>
                <AsyncButton
                  onClick={handleGenerateApiKey}
                  loading={isLoading}
                  loadingText={t("apiKeyForm.generate.generating")}
                  className="w-full sm:w-fit"
                  variant="default"
                >
                  <Key className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">
                    {t("apiKeyForm.generate.button")}
                  </span>
                  <span className="sm:hidden">
                    {t("apiKeyForm.generate.buttonShort")}
                  </span>
                </AsyncButton>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Success message */}
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200 text-sm leading-relaxed break-words">
                    <strong>{t("apiKeyForm.success.title")}</strong>{" "}
                    {t("apiKeyForm.success.message")}
                  </AlertDescription>
                </Alert>

                {/* API Key Display */}
                <div className="space-y-2">
                  <Label>{t("apiKeyForm.yourKey.label")}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 min-w-0">
                      <Input
                        value={apiKey}
                        type={showApiKey ? "text" : "password"}
                        readOnly
                        className="pr-16 sm:pr-20 font-mono text-xs sm:text-sm"
                      />
                      <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex gap-0.5 sm:gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 touch-manipulation"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                          <span className="sr-only">
                            {showApiKey
                              ? t("apiKeyForm.yourKey.hide")
                              : t("apiKeyForm.yourKey.show")}
                          </span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 touch-manipulation"
                          onClick={handleCopyApiKey}
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">
                            {t("apiKeyForm.yourKey.copy")}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed break-words">
                    {t("apiKeyForm.yourKey.description")}
                  </p>
                </div>

                {/* Warning */}
                <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed break-words">
                    <strong>{t("apiKeyForm.warning.title")}</strong>{" "}
                    {t("apiKeyForm.warning.message")}
                  </AlertDescription>
                </Alert>

                {/* Generate New Key */}
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">
                        {t("apiKeyForm.regenerate.title")}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed break-words">
                        {t("apiKeyForm.regenerate.description")}
                      </p>
                    </div>
                    <AsyncButton
                      onClick={() => {
                        setApiKey(null);
                        setShowApiKey(false);
                        handleGenerateApiKey();
                      }}
                      loading={isLoading}
                      loadingText={t("apiKeyForm.generate.generating")}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-fit touch-manipulation"
                    >
                      <Key className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="hidden sm:inline">
                        {t("apiKeyForm.regenerate.button")}
                      </span>
                      <span className="sm:hidden">
                        {t("apiKeyForm.regenerate.buttonShort")}
                      </span>
                    </AsyncButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
