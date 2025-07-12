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

import { AutomationModeCard } from "@/components/AutomationModeCard";

export function AutomationModesHelp() {
  const modes = [
    {
      id: "full-run",
      name: "Complete Automation",
      description: "Buy gift card and automatically apply it to your account",
      flow: [
        "🔐 Log into your Wolt account",
        "💳 Buy gift card using your Cibus card",
        "📧 Get the gift code from your Gmail",
        "🎁 Apply the gift code to your Wolt account",
      ],
      pros: ["Completely hands-off experience"],
      cons: ["Requires Gmail access permissions"],
      requirements: ["Wolt credentials", "Cibus credentials", "Gmail access"],
      bestFor: "Users who want complete automation",
    },
    {
      id: "buy-only",
      name: "Buy Only",
      description:
        "For people who don't want to share email access or redeem the gift card themselves",
      flow: [
        "🔐 Log into your Wolt account",
        "💳 Buy gift card using your Cibus card",
        "✋ Stop here - you manually apply the code later",
      ],
      pros: ["No email access required"],
      cons: ["Manual step required to apply gift card"],
      requirements: ["Wolt credentials", "Cibus credentials"],
      bestFor:
        "People who don't want to share email access or redeem the gift card themselves",
    },
    {
      id: "cross-account",
      name: "Smart Account Strategy",
      description:
        "Buy from a secondary WoltFlow account and apply to your main account",
      flow: [
        "🔐 Log into WoltFlow Wolt account",
        "💳 Buy gift card using your Cibus card",
        "📧 Get the gift code from WoltFlow Gmail",
        "🔄 Switch to your main Wolt account",
        "🎁 Apply the gift code to your main account",
      ],
      pros: ["Completely hands-off experience", "No Gmail access needed"],
      cons: ["Reliability (may fail)"],
      requirements: ["Wolt credentials", "Cibus credentials"],
      bestFor:
        "Users who want to complete automation and avoid sharing email access",
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
      <DialogContent className="max-w-[95vw] xl:max-w-[85vw] 2xl:max-w-[80vw] w-full max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Automation Modes Explained
          </DialogTitle>
          <DialogDescription>
            Choose the automation mode that best fits your needs and comfort
            level
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Overview */}
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Quick Guide:</strong> Each mode offers different levels
                of automation and control. Choose based on your comfort with
                automation and privacy preferences.
              </AlertDescription>
            </Alert>

            {/* Unified Flex Layout for All Breakpoints */}
            <div className="flex flex-col xl:flex-row gap-4 items-stretch">
              {modes.map((mode) => (
                <div key={mode.id} className="flex-1 flex flex-col h-full">
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
