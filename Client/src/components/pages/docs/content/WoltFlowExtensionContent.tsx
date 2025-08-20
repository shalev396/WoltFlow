import {
  Chrome,
  Copy,
  CheckCircle,
  AlertCircle,
  LogIn,
  Settings,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function WoltFlowExtensionContent() {
  return (
    <section id="woltflow-extension" className="space-y-8">
      <div className="flex items-center gap-3">
        <Chrome className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-4xl font-bold">WoltFlow Token Reviewer</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-green-100 text-green-800">Recommended</Badge>
            <Badge variant="outline">Free</Badge>
          </div>
        </div>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>
          The WoltFlow Token Reviewer extension is the easiest way to extract
          your Wolt credentials. With just one click, you can securely copy your
          authentication tokens without dealing with developer tools or complex
          manual processes.
        </p>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              Privacy & Security First
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              The WoltFlow Token Reviewer operates entirely locally in your
              browser. It does not send your credentials anywhere or store them
              permanently. You maintain full control over your data at all
              times.{" "}
              <Link
                to="/extension-privacy-policy.html"
                target="_blank"
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium underline"
              >
                Read our privacy policy
              </Link>{" "}
              for complete details.
            </p>
          </div>
        </div>
      </div>

      <div id="extension-installation" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Installation</h2>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Download the Extension</h3>
              <p className="text-muted-foreground">
                Get the WoltFlow Token Reviewer extension from the Chrome Web
                Store or download it directly.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex items-center gap-2" asChild>
                  <a
                    href="https://chromewebstore.google.com/detail/woltflow-token-reviewer/ghlbloemllihpoephjhmimdodfodnmcf?authuser=0&hl=iw"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chrome className="h-4 w-4" />
                    Chrome Web Store
                  </a>
                </Button>
                {/* <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Direct Download
                </Button> */}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Install in Your Browser</h3>
              <p className="text-muted-foreground">
                Follow your browser's standard extension installation process.
                The extension will appear as "WoltFlow Token Reviewer" in your
                extensions list.
              </p>

              <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Chrome className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Browser Support
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Currently supports Chrome, Edge, and other Chromium-based
                      browsers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Verify Installation</h3>
              <p className="text-muted-foreground">
                After installation, you should see the WoltFlow icon in your
                browser toolbar. Click it to open the extension popup and
                confirm it's working.
              </p>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Extension Icon Location:</strong> Usually appears in
                  the top-right corner of your browser, next to the address bar.
                  You may need to click the puzzle piece icon to see all
                  extensions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="extracting-credentials" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Extracting Your Credentials</h2>

        <div className="p-3 sm:p-6 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <LogIn className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                Login Required
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                You must be logged into Wolt in your browser before using the
                extension. If you're not logged in, the extension will display a
                message asking you to log in first.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Navigate to Wolt</h3>
              <p className="text-muted-foreground">
                Go to{" "}
                <a
                  href="https://wolt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-mono bg-muted px-2 py-1 rounded"
                >
                  wolt.com
                </a>{" "}
                and make sure you're logged into your account. You should see
                your profile and be able to browse restaurants.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Open the Extension</h3>
              <p className="text-muted-foreground">
                Click the WoltFlow extension icon in your browser toolbar. A
                small popup window will appear with your credential information.
              </p>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Can't find the icon?</strong> Look for the puzzle
                  piece icon in your toolbar and click it to see all extensions,
                  then click the WoltFlow icon.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Copy Your Credentials</h3>
              <p className="text-muted-foreground">
                The extension will display your Wolt authentication tokens.
                Click the copy buttons to copy each credential to your
                clipboard.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Copy className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Access Token (wtoken)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Short-lived token for API access. Copy this first.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Copy className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Refresh Token (wrtoken)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Long-lived token for automatic renewal. Copy this second.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
              4
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                Save to WoltFlow Settings
              </h3>
              <p className="text-muted-foreground">
                Navigate to your WoltFlow Settings page and paste the copied
                tokens into the appropriate fields in the Wolt Credentials
                section.
              </p>

              <Button asChild className="inline-flex">
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings Page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div id="extension-troubleshooting" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Troubleshooting</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Extension Shows "No Credentials Found"
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  This message appears when you're not properly logged into Wolt
                  or when the extension can't access your session data.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Solutions to try:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>
                      Make sure you're logged into Wolt in the same browser
                    </li>
                    <li>Refresh the Wolt page and try again</li>
                    <li>Clear your browser cache and log back into Wolt</li>
                    <li>Try using an incognito/private window</li>
                    <li>
                      Disable other extensions temporarily to check for
                      conflicts
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Extension Icon Not Visible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sometimes browser extensions are hidden or disabled after
                  installation.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Check these locations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Look in the extensions menu (puzzle piece icon)</li>
                    <li>
                      Check if the extension is enabled in browser settings
                    </li>
                    <li>Pin the extension to your toolbar for easy access</li>
                    <li>
                      Verify the extension installed correctly in your
                      extensions page
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Credentials Keep Changing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Wolt tokens are unique per device and can change when you log
                  in/out or clear cookies.
                </p>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Best Practice
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Extract credentials from a device/browser you don't
                        frequently log in/out of Wolt. Consider using a
                        dedicated browser or device for WoltFlow setup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                Security & Privacy Concerns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  The extension is designed with privacy and security as top
                  priorities.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Security features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>No data is sent to external servers</li>
                    <li>Credentials are only displayed locally in the popup</li>
                    <li>No persistent storage of your credentials</li>
                    {/* <li>Open-source code available for review</li> */}
                    <li>Minimal permissions requested</li>
                  </ul>
                </div>

                <Button asChild variant="outline" size="sm">
                  <Link to="/extension-privacy-policy.html" target="_blank">
                    <Shield className="h-4 w-4 mr-2" />
                    View Privacy Policy
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              Need More Help?
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              If you're still having trouble with the extension, you can always
              use the{" "}
              <Link
                to="/docs/manual-setup"
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium underline"
              >
                manual setup method
              </Link>{" "}
              instead. Both methods give you the same credentials needed for
              WoltFlow automation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
