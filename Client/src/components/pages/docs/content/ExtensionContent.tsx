import { Globe, Download, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ExtensionContent() {
  return (
    <section id="extension" className="space-y-8 scroll-mt-32">
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8" />
        <div>
          <h2 className="text-3xl font-bold">WoltFlow Token Reviewer</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default">Required</Badge>
          </div>
        </div>
      </div>

      <div id="extension-installation" className="space-y-6">
        <h3 className="text-2xl font-semibold">Installation</h3>

        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Browser Extension Required
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              The WoltFlow browser extension is required to automatically
              extract your Wolt credentials for seamless automation.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">
            Step 1: Download the Extension
          </h4>
          <div className="flex gap-3">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download for Chrome
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download for Firefox
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">
            Step 2: Install the Extension
          </h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Download the extension file (.crx for Chrome, .xpi for Firefox)
            </li>
            <li>Open your browser's extension management page</li>
            <li>Enable "Developer mode" (for Chrome)</li>
            <li>Drag and drop the extension file or click "Load unpacked"</li>
            <li>
              The WoltFlow extension icon should appear in your browser toolbar
            </li>
          </ol>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Step 3: Verify Installation</h4>
          <p className="text-muted-foreground">
            Once installed, you should see the WoltFlow icon in your browser
            toolbar. Click it to verify it's working properly.
          </p>
        </div>
      </div>

      <div id="extension-usage" className="space-y-6">
        <h3 className="text-2xl font-semibold">How to Use</h3>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Extracting Wolt Credentials</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Navigate to{" "}
              <code className="px-2 py-1 bg-muted rounded text-sm">
                wolt.com
              </code>{" "}
              in your browser
            </li>
            <li>Log into your Wolt account normally</li>
            <li>Click the WoltFlow extension icon in your toolbar</li>
            <li>Click "Extract Credentials" button</li>
            <li>
              The extension will automatically capture your authentication
              tokens
            </li>
            <li>Copy the credentials and paste them into WoltFlow settings</li>
          </ol>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Important Security Note
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your credentials are processed locally and securely transmitted
                to WoltFlow. The extension never stores or shares your data with
                third parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="extension-troubleshooting" className="space-y-6">
        <h3 className="text-2xl font-semibold">Troubleshooting</h3>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Common Issues</h4>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-2">Extension not appearing</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  Check if the extension is enabled in your browser settings
                </li>
                <li>Try refreshing the page after installation</li>
                <li>Ensure you're using a supported browser version</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-2">Can't extract credentials</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Make sure you're logged into Wolt first</li>
                <li>Try refreshing the Wolt page</li>
                <li>Check if you have any ad blockers interfering</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
