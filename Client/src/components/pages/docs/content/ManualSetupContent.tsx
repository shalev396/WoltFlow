import {
  Settings,
  Key,
  Shield,
  AlertTriangle,
  Code,
  Copy,
  Eye,
  RefreshCw,
  Monitor,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function ManualSetupContent() {
  return (
    <section id="manual-setup" className="space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-orange-600" />
        <div>
          <h1 className="text-4xl font-bold">Manual Token Setup</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">Advanced</Badge>
            <Badge variant="outline">Alternative Method</Badge>
          </div>
        </div>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>
          This guide shows you how to manually extract your Wolt authentication
          tokens using browser developer tools. This method is perfect if you
          prefer not to install extensions or need more control over the
          process.
        </p>
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Prefer the Extension?
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              If you're looking for an easier method, check out our{" "}
              <Link
                to="/docs/woltflow-extension"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline"
              >
                WoltFlow Token Reviewer guide
              </Link>{" "}
              which automates this entire process with a single click.
            </p>
          </div>
        </div>
      </div>

      <div id="understanding-tokens" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Understanding Wolt Tokens</h2>

        <p className="text-muted-foreground leading-relaxed">
          Wolt uses two types of authentication tokens to manage user sessions.
          Both are required for WoltFlow to function properly:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <Key className="h-5 w-5" />
                Access Token (wtoken)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  A short-lived token that provides immediate access to Wolt's
                  API endpoints for making purchases and applying gift cards.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Short-lived
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Auto-refreshed
                  </Badge>
                </div>
                <div className="p-2 bg-white dark:bg-background rounded border">
                  <code className="text-xs text-muted-foreground font-mono">
                    Typically starts with: {"{"}"accessToken": "eyJhb...
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <Shield className="h-5 w-5" />
                Refresh Token (wrtoken)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  A long-lived token used to automatically generate new access
                  tokens when they expire, ensuring continuous automation.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Long-lived
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Essential
                  </Badge>
                </div>
                <div className="p-2 bg-white dark:bg-background rounded border">
                  <code className="text-xs text-muted-foreground font-mono">
                    Typically starts with: pNNSVDL3O...
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Monitor className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                Device-Specific Tokens
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Each device and browser generates unique tokens when you log
                into Wolt. For best results, extract tokens from a device where
                you won't frequently log in and out of Wolt, as this can
                invalidate existing tokens.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="manual-extraction" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          Step-by-Step Token Extraction
        </h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Open Wolt in Your Browser
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Navigate to{" "}
                <a
                  href="https://wolt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-mono bg-muted px-2 py-1 rounded"
                >
                  wolt.com
                </a>{" "}
                and log into your account. Make sure you're fully logged in and
                can see your profile and browse restaurants normally.
              </p>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Important:</strong> You must be logged into Wolt for
                  the tokens to be available. The extraction process only works
                  when you have an active session.
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Open Developer Tools
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Open your browser's developer tools using one of these methods:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Keyboard Shortcut
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Press F12 or Ctrl+Shift+I (Windows/Linux)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cmd+Option+I (Mac)
                  </p>
                </div>

                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Right-Click Menu
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Right-click anywhere on the page and select "Inspect
                    Element" or "Inspect"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Navigate to Application Tab
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                In the developer tools, look for the "Application" tab
                (Chrome/Edge) or "Storage" tab (Firefox). Click on it to open
                the storage inspection panel.
              </p>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  🔍 Can't find the tab?
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>
                    Look for a {">"}
                    {">"} arrow if tabs are collapsed
                  </li>
                  <li>Try "Storage" instead of "Application"</li>
                  <li>Check if developer tools are in a separate window</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Access Cookies
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                In the Application tab, expand the "Cookies" section in the left
                sidebar. You should see "https://wolt.com" listed under the
                Cookies section.
              </p>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Path:</strong> Application → Cookies →
                  https://wolt.com
                </p>
              </div>

              <p className="text-muted-foreground text-sm">
                Click on the https://wolt.com entry to view all cookies stored
                by the Wolt website.
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                5
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Locate Your Tokens
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                In the Cookies view, look for the specific cookie names that
                contain your authentication tokens:
              </p>

              <div className="grid gap-4">
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Access Token</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Look for the cookie named "__wtoken". This is your access
                    token and the value will be a long string.
                  </p>
                  <div className="p-2 bg-white dark:bg-background rounded border text-xs font-mono text-muted-foreground">
                    Cookie name: __wtoken
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/10">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Refresh Token</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Look for the cookie named "__wrtoken". This is your refresh
                    token and the value will be a long string.
                  </p>
                  <div className="p-2 bg-white dark:bg-background rounded border text-xs font-mono text-muted-foreground">
                    Cookie name: __wrtoken
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                6
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Copy Token Values
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                For each token, click on the value field to select it, then copy
                the entire token string. Make sure to copy the complete value
                without any spaces or line breaks.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Copy the access token (__wtoken) cookie value
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Copy the refresh token (__wrtoken) cookie value
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      Copy Complete Values
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Make sure you copy the entire token value. These are
                      usually very long strings (200+ characters). If you copy
                      only part of the token, authentication will fail.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                7
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Add to WoltFlow Settings
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Navigate to your WoltFlow Settings page and paste the copied
                cookie values into the Wolt Credentials section.
              </p>

              <Button asChild className="inline-flex">
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings Page
                </Link>
              </Button>

              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Field Mapping:</strong> Paste the __wtoken cookie
                  value in the "Wolt Access Token" field and the __wrtoken
                  cookie value in the "Wolt Refresh Token" field.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="token-security" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          Token Security Best Practices
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-red-100 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-red-700 dark:text-red-300">
                <Shield className="h-5 w-5" />
                Keep Tokens Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  Never share your tokens with anyone
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  Don't post them in forums or support channels
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  Store them only in WoltFlow settings
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  Clear browser history after extraction if on shared devices
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <Monitor className="h-5 w-5" />
                Device Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Use a stable device for token extraction
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Avoid frequent Wolt login/logout on that device
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Monitor your Wolt account for unauthorized activity
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Change your Wolt password if you suspect compromise
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                Critical Security Warning
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                Your authentication tokens provide full access to your Wolt
                account. Treat them with the same care as your password. If you
                suspect your tokens have been compromised, immediately change
                your Wolt password and extract new tokens.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <Settings className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              Extraction Complete!
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              Once you've successfully copied your tokens to WoltFlow settings,
              you can continue with setting up your Cibus credentials and
              configuring email/SMS forwarding to complete your automation
              setup.
            </p>
            <div className="flex gap-2 mt-3">
              <Button asChild size="sm">
                <Link to="/docs/getting-started#activation-guide">
                  Continue Setup Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
