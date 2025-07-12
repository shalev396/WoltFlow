import { useState } from "react";
import { HelpCircle, AlertTriangle, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function WoltCredentialsHelp() {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(type);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const refreshTokenExample = "xQMk61M0X5xmxB5cFxrR5CzKxy-QDmxO3Jx8Ck2ExK0i-Mx";

  const accessTokenExample = `{
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
  "expireTime": 1720704000
}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help with Wolt credentials</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw] w-full max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            How to Get Your Wolt Credentials
          </DialogTitle>
          <DialogDescription>
            Follow these simple steps to get your Wolt tokens for automated gift
            card purchases
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Important Notice */}
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Important:</strong> These credentials are
                device-specific and will log you out of Wolt on the device
                you're using. It's recommended to do this on a device you don't
                mind being logged out of Wolt from.
              </AlertDescription>
            </Alert>

            {/* Step-by-step instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Step-by-Step Instructions:
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    1
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">Go to Wolt Website</p>
                    <p className="text-sm text-muted-foreground">
                      Open your web browser and go to{" "}
                      <a
                        href="https://wolt.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        wolt.com
                      </a>
                      . Make sure you're logged in to your Wolt account.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    2
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">Open Developer Tools</p>
                    <p className="text-sm text-muted-foreground">
                      Press{" "}
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">
                        F12
                      </kbd>{" "}
                      on your keyboard, or right-click anywhere on the page and
                      select "Inspect" or "Inspect Element".
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    3
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">Go to Application Tab</p>
                    <p className="text-sm text-muted-foreground">
                      In the developer tools, look for the "Application" tab at
                      the top and click on it. (If you don't see it, look for
                      "Storage" or click the » arrow to find more tabs)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    4
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">Navigate to Cookies</p>
                    <p className="text-sm text-muted-foreground">
                      In the left sidebar, look for "Storage" section and expand
                      "Cookies". You'll see a list of websites.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    5
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">Select Wolt.com Cookies</p>
                    <p className="text-sm text-muted-foreground">
                      Click on the entry that starts with "https://wolt.com" or
                      similar. This will show you all the cookies for Wolt.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    6
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">Find the Refresh Token</p>
                    <p className="text-sm text-muted-foreground">
                      Look for a cookie named{" "}
                      <code className="bg-muted px-1 rounded">__wrtoken</code>.
                      Double-click on its value to select it and copy it (Ctrl+C
                      or Cmd+C).
                    </p>
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground mb-1">
                          Example refresh token:
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(refreshTokenExample, "refresh")
                          }
                          className="h-6 px-2"
                        >
                          {copiedExample === "refresh" ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <code className="text-xs break-all">
                        {refreshTokenExample}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Note:</strong> Remove any quotation marks (") or
                      %22 from the beginning and end of the token.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    7
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">Find the Access Token</p>
                    <p className="text-sm text-muted-foreground">
                      Look for a cookie named{" "}
                      <code className="bg-muted px-1 rounded">__wtoken</code>.
                      This one contains a JSON object with the access token and
                      expiration time.
                    </p>
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground mb-1">
                          Example access token:
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(accessTokenExample, "access")
                          }
                          className="h-6 px-2"
                        >
                          {copiedExample === "access" ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <pre className="text-xs break-all whitespace-pre-wrap">
                        {accessTokenExample}
                      </pre>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Note:</strong> Copy the entire JSON object
                      including the curly braces.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge
                    variant="outline"
                    className="min-w-[24px] h-6 flex items-center justify-center"
                  >
                    8
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">Paste the Tokens</p>
                    <p className="text-sm text-muted-foreground">
                      Go back to the settings page and paste the refresh token
                      in the "Wolt Refresh Token" field and the access token
                      JSON in the "Wolt Access Token" field.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional tips */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">💡 Tips:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    Make sure you're logged in to Wolt before starting this
                    process
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    If you can't find the cookies, try refreshing the Wolt page
                    first
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    These tokens will expire eventually, so you may need to
                    repeat this process periodically
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    Keep your tokens secure and don't share them with anyone
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
