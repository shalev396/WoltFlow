import { Mail, MailX, HelpCircle, ExternalLink } from "lucide-react";
import { FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
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

interface GmailAccessIndicatorProps {
  hasGmailAccess: boolean;
}

export function GmailAccessIndicator({
  hasGmailAccess,
}: GmailAccessIndicatorProps) {
  const handleManageAccess = () => {
    window.open(
      "https://myaccount.google.com/connections?filters=3,4",
      "_blank"
    );
  };

  return (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card">
      <div className="space-y-0.5">
        <FormLabel className="text-base flex items-center gap-2">
          {hasGmailAccess ? (
            <Mail className="h-4 w-4 text-green-600 animate-pulse" />
          ) : (
            <MailX className="h-4 w-4 text-muted-foreground" />
          )}
          Gmail Access
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Gmail Access Status
                </DialogTitle>
                <DialogDescription>
                  This indicates whether you've granted Gmail access to WoltFlow
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">What is Gmail Access?</h4>
                  <p className="text-sm text-muted-foreground">
                    Gmail access allows WoltFlow to automatically read your Wolt
                    gift card confirmation emails and extract the gift codes for
                    automatic application.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Current Status</h4>
                  <Alert>
                    <AlertDescription className="flex items-center gap-2">
                      {hasGmailAccess ? (
                        <>
                          <Mail className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">
                            Access Granted
                          </span>
                          - WoltFlow can read your Gmail for gift codes
                        </>
                      ) : (
                        <>
                          <MailX className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground font-medium">
                            No Access
                          </span>
                          - Re-login to grant Gmail permissions
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>

                {hasGmailAccess && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Remove Access</h4>
                    <p className="text-sm text-muted-foreground">
                      To remove Gmail access, you need to revoke permissions in
                      your Google Account settings.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManageAccess}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Manage Google Permissions
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </FormLabel>
        <FormDescription>
          {hasGmailAccess
            ? "Gmail access is enabled"
            : "Gmail access is disabled"}
        </FormDescription>
      </div>
      <Switch
        checked={hasGmailAccess}
        disabled={true}
        className="data-[state=checked]:bg-green-600 opacity-75"
      />
    </FormItem>
  );
}
