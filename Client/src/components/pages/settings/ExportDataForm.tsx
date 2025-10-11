import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Download,
  Database,
  FileText,
  //   AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AsyncButton from "@/components/shared/AsyncButton";

import { useExportUserDataMutation } from "@/queries/user";

export default function ExportDataForm() {
  const { t } = useTranslation("settings");
  const [hasExported, setHasExported] = useState(false);
  const exportMutation = useExportUserDataMutation();

  const handleExportData = async () => {
    try {
      const result = await exportMutation.mutateAsync();

      setHasExported(true);
      toast.success("Data export completed", {
        description: `Your data has been downloaded as ${result.filename}`,
      });
    } catch (error) {
      console.error("Failed to export user data:", error);
      toast.error("Failed to export data", {
        description: "Please try again later",
      });
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          {t("exportForm.title")}
        </CardTitle>
        <CardDescription>{t("exportForm.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          {/* Info Alert */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>{t("exportForm.infoAlert")}</AlertDescription>
          </Alert>

          {/* Export Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {t("exportForm.whatsIncluded.title")}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("exportForm.whatsIncluded.accountInfo")}</li>
                <li>• {t("exportForm.whatsIncluded.runHistory")}</li>
                <li>• {t("exportForm.whatsIncluded.emails")}</li>
                <li>• {t("exportForm.whatsIncluded.attachments")}</li>
                <li>• {t("exportForm.whatsIncluded.screenshots")}</li>
                <li>• {t("exportForm.whatsIncluded.codes")}</li>
                <li>• {t("exportForm.whatsIncluded.twoFactor")}</li>
              </ul>
            </div>
          </div>

          {/* Export Section */}
          <div className="space-y-4">
            {!hasExported ? (
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    {t("exportForm.export.title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("exportForm.export.description")}
                  </p>
                </div>
                <AsyncButton
                  onClick={handleExportData}
                  loading={exportMutation.isPending}
                  loadingText={t("exportForm.export.creating")}
                  className="w-fit"
                  variant="default"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("exportForm.export.button")}
                </AsyncButton>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Success message */}
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>{t("exportForm.success.title")}</strong>{" "}
                    {t("exportForm.success.message")}
                  </AlertDescription>
                </Alert>

                {/* Export Another Copy */}
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">
                        {t("exportForm.exportAgain.title")}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {t("exportForm.exportAgain.description")}
                      </p>
                    </div>
                    <AsyncButton
                      onClick={() => {
                        setHasExported(false);
                        handleExportData();
                      }}
                      loading={exportMutation.isPending}
                      loadingText={t("exportForm.export.creating")}
                      variant="outline"
                      size="sm"
                      className="w-fit"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      {t("exportForm.exportAgain.button")}
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
