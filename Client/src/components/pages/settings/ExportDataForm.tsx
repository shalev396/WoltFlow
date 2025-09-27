import { useState } from "react";
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
import { exportUserDataAsCSV } from "@/utils/csvExport";

export default function ExportDataForm() {
  const [hasExported, setHasExported] = useState(false);
  const exportMutation = useExportUserDataMutation();

  const handleExportData = async () => {
    try {
      const result = await exportMutation.mutateAsync();

      // Generate and download CSV
      exportUserDataAsCSV(result.data);

      setHasExported(true);
      toast.success("Data export completed", {
        description: "Your data has been downloaded as a CSV file",
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
          Export Your Data
        </CardTitle>
        <CardDescription>
          Download a complete copy of all your WoltFlow data in CSV format
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          {/* Info Alert */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              This export includes all your account data: settings, automation
              runs, emails, codes, screenshots, and more. The data will be
              downloaded as a CSV file that you can open in Excel or any
              spreadsheet application.
            </AlertDescription>
          </Alert>

          {/* Export Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">What's included:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Account information and settings</li>
                <li>• All automation run history</li>
                <li>• Email inbox and messages</li>
                <li>• Generated gift codes</li>
                <li>• Screenshots from automation runs</li>
                <li>• Two-factor authentication records</li>
                <li>• All connected platform credentials</li>
              </ul>
            </div>
          </div>

          {/* Export Section */}
          <div className="space-y-4">
            {!hasExported ? (
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Export Your Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to generate and download your
                    complete data export. This may take a few moments to
                    process.
                  </p>
                </div>
                <AsyncButton
                  onClick={handleExportData}
                  loading={exportMutation.isPending}
                  loadingText="Exporting Data..."
                  className="w-fit"
                  variant="default"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </AsyncButton>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Success message */}
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>Export Completed!</strong> Your data has been
                    successfully downloaded to your computer.
                  </AlertDescription>
                </Alert>

                {/* Export Another Copy */}
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">
                        Need another copy?
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        You can export your data again at any time. Recent
                        exports are cached for 5 minutes for faster processing.
                      </p>
                    </div>
                    <AsyncButton
                      onClick={() => {
                        setHasExported(false);
                        handleExportData();
                      }}
                      loading={exportMutation.isPending}
                      loadingText="Exporting Data..."
                      variant="outline"
                      size="sm"
                      className="w-fit"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Export Again
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
