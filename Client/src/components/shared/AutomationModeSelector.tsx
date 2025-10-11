import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { type Control, type FieldPath } from "react-hook-form";
import { AutomationModesHelp } from "@/components/shared/AutomationModesHelp";

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
  const { t } = useTranslation("settings");

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
                {t("automationModeSelector.label")}
                <AutomationModesHelp />
              </FormLabel>
              <FormDescription>
                {t("automationModeSelector.description")}
              </FormDescription>
            </div>
          </div>
          <FormControl>
            <Select
              value={field.value as string}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="bg-card w-full">
                <SelectValue
                  placeholder={t("automationModeSelector.placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-run">
                  <div className="flex items-center gap-2">
                    <span>🚀</span>
                    <div>
                      <p className="font-medium">
                        {t("automationModeSelector.options.fullRun.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "automationModeSelector.options.fullRun.description"
                        )}
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="buy-only">
                  <div className="flex items-center gap-2">
                    <span>🛒</span>
                    <div>
                      <p className="font-medium">
                        {t("automationModeSelector.options.buyOnly.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "automationModeSelector.options.buyOnly.description"
                        )}
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
