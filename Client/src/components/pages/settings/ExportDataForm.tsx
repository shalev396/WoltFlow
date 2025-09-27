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

export default function ExportDataForm() {
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
          Export Your Data
        </CardTitle>
        <CardDescription>
          Download a complete copy of all your WoltFlow data including files in
          a ZIP archive
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
              downloaded as a ZIP file containing a CSV with database records
              plus all your files organized in folders.
            </AlertDescription>
          </Alert>

          {/* Export Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">What's included:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Account information and settings (CSV format)</li>
                <li>• All automation run history (CSV format)</li>
                <li>• Email inbox and message files (original formats)</li>
                <li>• Email attachments (original formats)</li>
                <li>• Screenshots from automation runs (PNG/JPG)</li>
                <li>• Generated gift codes (CSV format)</li>
                <li>• Two-factor authentication records (CSV format)</li>
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
                    complete data export as a ZIP file. This may take a few
                    moments to process as we collect all your files.
                  </p>
                </div>
                <AsyncButton
                  onClick={handleExportData}
                  loading={exportMutation.isPending}
                  loadingText="Creating ZIP Archive..."
                  className="w-fit"
                  variant="default"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download ZIP Archive
                </AsyncButton>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Success message */}
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>Export Completed!</strong> Your data ZIP archive has
                    been successfully downloaded to your computer.
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
                        You can export your data again at any time. Each export
                        creates a fresh ZIP archive with current data.
                      </p>
                    </div>
                    <AsyncButton
                      onClick={() => {
                        setHasExported(false);
                        handleExportData();
                      }}
                      loading={exportMutation.isPending}
                      loadingText="Creating ZIP Archive..."
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
