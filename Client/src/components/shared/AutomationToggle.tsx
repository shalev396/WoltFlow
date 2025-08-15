import { Bot, BotOff } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { type Control, type FieldPath } from "react-hook-form";

interface AutomationToggleProps<
  T extends Record<string, unknown> & { automationEnabled: boolean }
> {
  control: Control<T>;
  name: FieldPath<T>;
}

export function AutomationToggle<
  T extends Record<string, unknown> & { automationEnabled: boolean }
>({ control, name }: AutomationToggleProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card">
          <div className="space-y-0.5">
            <FormLabel className="text-base flex items-center gap-2">
              {field.value ? (
                <Bot className="h-4 w-4 text-green-600" />
              ) : (
                <BotOff className="h-4 w-4 text-muted-foreground" />
              )}
              Automation
            </FormLabel>
            <FormDescription>
              {field.value
                ? "Automation is enabled and ready to run"
                : "Enable automation to start scheduled runs"}
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-green-600"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
