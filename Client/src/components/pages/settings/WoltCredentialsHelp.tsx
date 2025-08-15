import { HelpCircle, AlertTriangle, ExternalLink } from "lucide-react";
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
  const handleOpenExtension = () => {
    window.open(
      "https://chromewebstore.google.com/detail/ghlbloemllihpoephjhmimdodfodnmcf?utm_source=item-share-cb",
      "_blank"
    );
  };

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
            Use our extension to easily extract your Wolt tokens for automated
            gift card purchases
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Important Notice */}
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Important:</strong> These tokens are device-specific and
                will log you out of Wolt on the device you're using. It's
                recommended to do this on a device you don't mind being logged
                out of Wolt from.
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
                    <p className="font-medium">
                      Install WoltFlow Token Reviewer Extension
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      First, you need to install our browser extension that will
                      help you extract the tokens automatically.
                    </p>
                    <Button
                      onClick={handleOpenExtension}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Install Extension
                    </Button>
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
                    <p className="font-medium">Go to Wolt.com and Log In</p>
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
                    3
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">Use the Extension</p>
                    <p className="text-sm text-muted-foreground">
                      Once you're logged in, click on the WoltFlow Token
                      Reviewer extension icon in your browser toolbar. The
                      extension will automatically extract your tokens.
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
                    <p className="font-medium">Copy the Tokens</p>
                    <p className="text-sm text-muted-foreground">
                      The extension will display your refresh token and access
                      token. Copy both tokens from the extension popup.
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
                    <p className="font-medium">Paste and Save</p>
                    <p className="text-sm text-muted-foreground">
                      Return to this settings page and paste the refresh token
                      in the "Wolt Refresh Token" field and the access token in
                      the "Wolt Access Token" field. Then click "Save Changes".
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
                    Make sure you're logged in to Wolt before using the
                    extension
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    If the extension doesn't show tokens, try refreshing the
                    Wolt page and try again
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    These tokens are device-specific, so you might want to do
                    this on a device you don't use frequently for Wolt
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
