import { Settings } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, FieldPath } from "react-hook-form";
import { AutomationModesHelp } from "@/components/AutomationModesHelp";

interface AutomationModeSelectorProps<
  T extends Record<string, unknown> & {
    automationMode: "full-run" | "buy-only" | "cross-account";
  }
> {
  control: Control<T>;
  name: FieldPath<T>;
}

export function AutomationModeSelector<
  T extends Record<string, unknown> & {
    automationMode: "full-run" | "buy-only" | "cross-account";
  }
>({ control, name }: AutomationModeSelectorProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="rounded-lg border p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-600" />
                Automation Mode
                <AutomationModesHelp />
              </FormLabel>
              <FormDescription>
                Choose how the automation should work
              </FormDescription>
            </div>
          </div>
          <FormControl>
            <Select
              value={field.value as string}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="bg-card w-full">
                <SelectValue placeholder="Select automation mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-run">
                  <div className="flex items-center gap-2">
                    <span>🚀</span>
                    <div>
                      <p className="font-medium">Complete Automation</p>
                      <p className="text-xs text-muted-foreground">
                        Buy and apply automatically
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="buy-only">
                  <div className="flex items-center gap-2">
                    <span>🛒</span>
                    <div>
                      <p className="font-medium">Buy Only</p>
                      <p className="text-xs text-muted-foreground">
                        Just purchase, apply manually
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="cross-account">
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <div>
                      <p className="font-medium">Smart Account Strategy</p>
                      <p className="text-xs text-muted-foreground">
                        Buy from secondary, apply to main
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
