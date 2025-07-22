import { useState } from "react";
import { Bell, BellOff, Settings } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Control, FieldPath } from "react-hook-form";

import { NotificationSettingsDialog } from "@/components/NotificationSettingsDialog";
import { useSettingsQuery } from "@/queries/settings";

interface NotificationToggleProps<
  T extends Record<string, unknown> & { isNotification: boolean }
> {
  control: Control<T>;
  name: FieldPath<T>;
}

export function NotificationToggle<
  T extends Record<string, unknown> & { isNotification: boolean }
>({ control, name }: NotificationToggleProps<T>) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: settings } = useSettingsQuery();

  // Check if user has the primary notification method verified
  const hasVerifiedPrimaryMethod = Boolean(
    settings?.notificationMethod === "sms"
      ? settings?.phoneVerified && settings?.phoneNumber
      : settings?.notificationMethod === "email"
      ? settings?.emailVerified && settings?.email
      : false
  );

  // Get the primary method display name
  const primaryMethodName =
    settings?.notificationMethod?.toUpperCase() || "notification method";

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card">
            <div className="space-y-0.5 flex-1">
              <FormLabel className="text-base flex items-center gap-2">
                {field.value ? (
                  <Bell className="h-4 w-4 text-blue-600 animate-pulse" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
                Notifications
              </FormLabel>
              <FormDescription>
                {field.value
                  ? hasVerifiedPrimaryMethod
                    ? `You'll receive updates via ${primaryMethodName}`
                    : settings?.notificationMethod
                    ? `${primaryMethodName} method needs verification`
                    : "Please configure notification method in settings"
                  : "No notifications will be sent"}
              </FormDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="h-8 w-8 p-0"
                title="Notification settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <FormControl>
                <Switch
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-blue-600"
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <NotificationSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}
