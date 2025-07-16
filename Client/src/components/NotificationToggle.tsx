import { Bell, BellOff } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control, FieldPath } from "react-hook-form";

interface NotificationToggleProps<
  T extends Record<string, unknown> & { isNotification: boolean }
> {
  control: Control<T>;
  name: FieldPath<T>;
}

export function NotificationToggle<
  T extends Record<string, unknown> & { isNotification: boolean }
>({ control, name }: NotificationToggleProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card">
          <div className="space-y-0.5">
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
                ? "You'll receive purchase updates"
                : "No notifications will be sent"}
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-blue-600"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
