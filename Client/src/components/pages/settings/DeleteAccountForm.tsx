import { useState } from "react";
import { Trash2, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AsyncButton from "@/components/shared/AsyncButton";

import { useDeleteUserAccountMutation } from "@/queries/user";

export default function DeleteAccountForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const deleteAccountMutation = useDeleteUserAccountMutation();

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE MY ACCOUNT") {
      toast.error("Confirmation text doesn't match", {
        description: "Please type 'DELETE MY ACCOUNT' exactly as shown",
      });
      return;
    }

    try {
      // const result =
      await deleteAccountMutation.mutateAsync();

      // Show success message with deletion details
      toast.success("Account successfully deleted", {
        description:
          "Your account and all data have been permanently removed. You will be redirected shortly.",
        duration: 5000,
      });

      // Close dialog and reset form
      setIsDialogOpen(false);
      setConfirmText("");
    } catch (error) {
      console.error("Failed to delete account:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete account";

      toast.error("Account deletion failed", {
        description: errorMessage,
        duration: 8000,
      });
    }
  };

  return (
    <Card className="w-full h-full flex flex-col border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <Trash2 className="h-5 w-5" />
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your WoltFlow account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          {/* Warning Alert */}
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Danger Zone:</strong> This action cannot be undone. Once
              deleted, your account and all data will be permanently removed
              from our systems.
            </AlertDescription>
          </Alert>

          {/* What gets deleted */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">What will be deleted:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your account and profile information</li>
                <li>• All automation settings and credentials</li>
                <li>• Complete run history and screenshots</li>
                <li>• Email inbox and all received messages</li>
                <li>• Generated gift codes and 2FA records</li>
                <li>• API keys and integration settings</li>
                <li>• All personal data and usage history</li>
              </ul>
            </div>
          </div>

          {/* Deletion timeline */}
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Account deletion is processed immediately and cannot be reversed.
              Per our privacy policy, some data may be retained in encrypted
              backups for up to 90 days for security and legal compliance.
            </AlertDescription>
          </Alert>

          {/* Delete Button */}
          <div className="pt-4 border-t border-red-200 dark:border-red-800">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-fit" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete My Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Confirm Account Deletion
                  </DialogTitle>
                  <DialogDescription className="space-y-3">
                    <p>
                      This action will permanently delete your account and all
                      associated data. This cannot be undone.
                    </p>
                    <p>
                      To confirm, please type{" "}
                      <strong>"DELETE MY ACCOUNT"</strong>
                      in the field below:
                    </p>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirm-delete">
                      Type "DELETE MY ACCOUNT" to confirm
                    </Label>
                    <Input
                      id="confirm-delete"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                      className="font-mono"
                    />
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setConfirmText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <AsyncButton
                    onClick={handleDeleteAccount}
                    loading={deleteAccountMutation.isPending}
                    loadingText="Deleting Account..."
                    variant="destructive"
                    disabled={
                      confirmText !== "DELETE MY ACCOUNT" ||
                      deleteAccountMutation.isPending
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </AsyncButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
