import { useState } from "react";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import AsyncButton from "@/components/shared/AsyncButton";

import { settingsService } from "@/services/settings";

export default function ApiKeyForm() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateApiKey = async () => {
    setIsLoading(true);
    try {
      const result = await settingsService.generateApiKey();
      setApiKey(result.apiKey);
      setShowApiKey(true);
      toast.success("API key generated successfully", {
        description: "Your new API key is ready to use",
      });
    } catch (error) {
      console.error("Failed to generate API key:", error);
      toast.error("Failed to generate API key", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyApiKey = async () => {
    if (apiKey) {
      try {
        await navigator.clipboard.writeText(apiKey);
        toast.success("API key copied to clipboard");
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = apiKey;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          toast.success("API key copied to clipboard");
        } catch (fallbackError) {
          toast.error("Failed to copy API key");
        }
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          API Key Management
        </CardTitle>
        <CardDescription>
          Generate and manage your API key for SMS forwarding and external
          integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          {/* Info Alert */}
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-3">
              <span>
                Your API key allows external services to forward SMS messages to
                your WoltFlow inbox. Keep it secure and don't share it publicly.
              </span>
              <Button asChild variant="outline" size="sm" className="w-fit">
                <Link to="/docs/sms-forwarding">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View SMS Forwarding Documentation
                </Link>
              </Button>
            </AlertDescription>
          </Alert>

          {/* API Key Generation Section */}
          <div className="space-y-4">
            {!apiKey ? (
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label>Generate API Key</Label>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to generate a new API key. This will
                    replace any existing key.
                  </p>
                </div>
                <AsyncButton
                  onClick={handleGenerateApiKey}
                  loading={isLoading}
                  loadingText="Generating Key..."
                  className="w-fit"
                  variant="default"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Generate New API Key
                </AsyncButton>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Success message */}
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>API Key Generated Successfully!</strong> Copy it now
                    as you won't be able to see it again.
                  </AlertDescription>
                </Alert>

                {/* API Key Display */}
                <div className="space-y-2">
                  <Label>Your New API Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={apiKey}
                        type={showApiKey ? "text" : "password"}
                        readOnly
                        className="pr-20 font-mono text-sm"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                          <span className="sr-only">
                            {showApiKey ? "Hide" : "Show"} API key
                          </span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={handleCopyApiKey}
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy API key</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Store this key securely. You'll need it to configure SMS
                    forwarding services.
                  </p>
                </div>

                {/* Warning */}
                <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <strong>Important:</strong> This key won't be displayed
                    again. Make sure to copy and store it securely before
                    leaving this page.
                  </AlertDescription>
                </Alert>

                {/* Generate New Key */}
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">Need a new key?</h4>
                      <p className="text-xs text-muted-foreground">
                        Generating a new key will immediately invalidate the
                        current one.
                      </p>
                    </div>
                    <AsyncButton
                      onClick={() => {
                        setApiKey(null);
                        setShowApiKey(false);
                        handleGenerateApiKey();
                      }}
                      loading={isLoading}
                      loadingText="Generating Key..."
                      variant="outline"
                      size="sm"
                      className="w-fit"
                    >
                      <Key className="h-3 w-3 mr-2" />
                      Generate New Key
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
