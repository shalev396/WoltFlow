import { Wallet, Key, Shield, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function WoltCredentialsContent() {
  return (
    <section id="wolt-credentials" className="space-y-8">
      <div className="flex items-center gap-3">
        <Wallet className="h-8 w-8" />
        <div>
          <h2 className="text-3xl font-bold">Wolt Credentials</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default">Required</Badge>
          </div>
        </div>
      </div>

      <div id="wolt-tokens" className="space-y-6">
        <h3 className="text-2xl font-semibold">Understanding Tokens</h3>

        <p className="text-muted-foreground">
          WoltFlow requires two types of authentication tokens from Wolt to
          function properly:
        </p>

        <div className="grid gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Access Token (wtoken)
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Short-lived token for immediate API access. Expires frequently and
              needs refresh.
            </p>
            <Badge variant="secondary">Short-lived</Badge>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Refresh Token (wrtoken)
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Long-lived token used to generate new access tokens automatically.
            </p>
            <Badge variant="secondary">Long-lived</Badge>
          </div>
        </div>
      </div>

      <div id="wolt-extraction" className="space-y-6">
        <h3 className="text-2xl font-semibold">Manual Token Extraction</h3>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Use Extension Instead
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                We recommend using the WoltFlow browser extension for easier
                credential extraction. Use this manual method only if the
                extension isn't working.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Manual Steps</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open your browser's Developer Tools (F12)</li>
            <li>Go to the "Application" or "Storage" tab</li>
            <li>Navigate to "Local Storage" → "wolt.com"</li>
            <li>Look for keys containing "wtoken" and "wrtoken"</li>
            <li>Copy the token values (without quotes)</li>
            <li>Paste them into the respective fields in WoltFlow settings</li>
          </ol>
        </div>
      </div>

      <div id="wolt-security" className="space-y-6">
        <h3 className="text-2xl font-semibold">Token Security</h3>

        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Keep Your Tokens Safe
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Never share your tokens with anyone. They provide full access to
                your Wolt account.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Security Best Practices</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Only use WoltFlow on trusted devices</li>
            <li>Log out of Wolt on shared computers</li>
            <li>Regularly update your Wolt password</li>
            <li>Monitor your Wolt account for unauthorized activity</li>
            <li>
              If you suspect compromise, change your Wolt password immediately
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
