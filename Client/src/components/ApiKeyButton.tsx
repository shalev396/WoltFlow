import { useState } from "react";
import { Key, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { settingsService } from "@/services/settings";
import { toast } from "sonner";

export function ApiKeyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleGenerateApiKey = async () => {
    setIsLoading(true);
    try {
      const response = await settingsService.generateApiKey();
      setApiKey(response.apiKey);
      setDialogOpen(true);
      toast.success("API key generated successfully!");
    } catch (error) {
      console.error("Failed to generate API key:", error);
      toast.error("Failed to generate API key. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleGenerateApiKey}
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Key className="mr-2 h-4 w-4" />
            Generate API Key
          </>
        )}
      </Button>

      <ApiKeyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        apiKey={apiKey}
      />
    </>
  );
}
