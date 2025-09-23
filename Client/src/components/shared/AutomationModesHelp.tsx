import { HelpCircle, AlertCircle } from "lucide-react";
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

import { AutomationModeCard } from "@/components/shared/AutomationModeCard";

export function AutomationModesHelp() {
  const modes = [
    {
      id: "full-run",
      name: "Complete Automation",
      description:
        "Fully automated process from purchase to redemption - no manual steps required",
      flow: [
        "🔐 Securely log into your Wolt account",
        "💳 Purchase gift card using your Cibus balance",
        "📧 Extract gift code from your WoltFlow inbox",
        "🎁 Automatically apply the code to your Wolt account",
      ],
      pros: [
        "Completely hands-off daily automation",
        "Maximum time savings",
        "No manual intervention needed",
      ],
      cons: ["Requires email forwarding setup"],
      requirements: [
        "Wolt account credentials",
        "Cibus account credentials",
        "Email forwarding to WoltFlow inbox",
      ],
      bestFor:
        "Users who want complete automation and don't mind setting up email forwarding",
    },
    {
      id: "buy-only",
      name: "Purchase Only",
      description:
        "Automate the purchase but manually apply gift codes yourself",
      flow: [
        "🔐 Securely log into your Wolt account",
        "💳 Purchase gift card using your Cibus balance",
        "✋ Automation stops - you receive email with gift code",
        "👤 You manually apply the code to your Wolt account",
      ],
      pros: [
        "No email forwarding setup required",
        "Still saves time on daily purchases",
        "You maintain control over gift code application",
      ],
      cons: ["Requires daily manual step to apply codes"],
      requirements: ["Wolt account credentials", "Cibus account credentials"],
      bestFor:
        "Users who prefer not to set up email forwarding or want to manually control gift code redemption",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help with automation modes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl w-full max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Automation Modes Explained
          </DialogTitle>
          <DialogDescription>
            Choose between complete automation or purchase-only mode based on
            your preferences
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Overview */}
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Quick Guide:</strong> Complete Automation handles
                everything automatically including gift code redemption, while
                Purchase Only stops after buying the gift card and lets you
                manually apply codes.
              </AlertDescription>
            </Alert>

            {/* Improved Layout for 2 Modes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {modes.map((mode) => (
                <div key={mode.id} className="flex flex-col h-full">
                  <AutomationModeCard mode={mode} />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
