import { useState } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";

export function ApiKeyButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
      >
        <Key className="mr-2 h-4 w-4" />
        Generate API Key
      </Button>

      <ApiKeyDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
