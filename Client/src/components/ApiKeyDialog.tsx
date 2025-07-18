import { useState } from "react";
import { Copy, Check, AlertTriangle, Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
}

export function ApiKeyDialog({
  open,
  onOpenChange,
  apiKey,
}: ApiKeyDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Key className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Your API Key
          </DialogTitle>
          <DialogDescription className="text-sm">
            Save this API key securely - it will only be shown once and cannot
            be recovered.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Important Warning */}
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
            <AlertDescription className="text-orange-800 dark:text-orange-200 text-sm">
              <strong>Important:</strong> This API key will only be displayed
              once. Make sure to copy it and store it in a secure location
              before closing this dialog.
            </AlertDescription>
          </Alert>

          {/* API Key Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
              <code className="flex-1 text-xs sm:text-sm font-mono break-all select-all leading-relaxed">
                {apiKey}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(apiKey)}
                className="h-8 w-8 p-0 flex-shrink-0"
                title="Copy API key"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">How to use this API key:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Include this API key in the{" "}
                <code className="bg-muted px-1 rounded text-xs">X-API-Key</code>{" "}
                header when making requests to the SMS forwarding endpoint
              </p>
              <p>
                • Use this key to authenticate external services that need to
                send SMS messages to your account
              </p>
              <p>
                • Keep this key secure and never share it with unauthorized
                users
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
