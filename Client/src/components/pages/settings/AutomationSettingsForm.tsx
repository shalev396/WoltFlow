import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Settings, DollarSign } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import AsyncButton from "@/components/shared/AsyncButton";
import { AutomationToggle } from "@/components/shared/AutomationToggle";
import { AutomationModeSelector } from "@/components/shared/AutomationModeSelector";

import {
  cibusSettingsSchema,
  type CibusSettingsFormData,
} from "@/lib/validations/settings/cibus";
import {
  useRunSettingsQuery,
  useUpdateRunSettingsMutation,
} from "@/queries/settings";

export default function AutomationSettingsForm() {
  const { t } = useTranslation("settings");
  const { data: runSettings } = useRunSettingsQuery();
  const updateRunSettingsMutation = useUpdateRunSettingsMutation();

  const form = useForm<CibusSettingsFormData>({
    resolver: zodResolver(cibusSettingsSchema),
    defaultValues: {
      automationEnabled: false,
      automationMode: "full-run" as const,
      giftAmount: 40,
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (runSettings) {
      // Convert decimal string to number
      const giftAmount = runSettings.giftAmount
        ? typeof runSettings.giftAmount === "string"
          ? parseFloat(runSettings.giftAmount)
          : runSettings.giftAmount
        : 40;

      form.reset({
        automationEnabled: runSettings.automationEnabled || false,
        automationMode: runSettings.automationMode || "full-run",
        giftAmount,
      });
    }
  }, [runSettings, form]);

  const onSubmit = async (data: {
    automationEnabled: boolean;
    automationMode: "full-run" | "buy-only" | "cross-account";
    giftAmount?: number | null;
  }) => {
    try {
      await updateRunSettingsMutation.mutateAsync({
        automationEnabled: data.automationEnabled,
        automationMode: data.automationMode,
        giftAmount: data.giftAmount,
      });
    } catch (error) {
      console.error("Failed to update automation settings:", error);
    }
  };

  const isLoading = updateRunSettingsMutation.isPending;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
          {t("automationForm.title")}
        </CardTitle>
        <CardDescription>{t("automationForm.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Form {...form}>
          <form className="flex-1 flex flex-col">
            <div className="flex-1 space-y-6">
              {/* Automation Toggle */}
              <AutomationToggle
                control={form.control}
                name="automationEnabled"
              />

              {/* Automation Mode - Always visible, disabled when automation is off */}
              <div
                className={!form.watch("automationEnabled") ? "opacity-50" : ""}
              >
                <AutomationModeSelector
                  control={form.control}
                  name="automationMode"
                />
              </div>

              {/* Gift Amount - Always visible, disabled when automation is off */}
              <FormField
                control={form.control}
                name="giftAmount"
                render={({ field }) => (
                  <FormItem
                    className={
                      !form.watch("automationEnabled") ? "opacity-50" : ""
                    }
                  >
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {t("automationForm.giftAmount.label")}
                    </FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={!form.watch("automationEnabled")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "automationForm.giftAmount.placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="20">₪20</SelectItem>
                        <SelectItem value="25">₪25</SelectItem>
                        <SelectItem value="30">₪30</SelectItem>
                        <SelectItem value="35">₪35</SelectItem>
                        <SelectItem value="40">₪40</SelectItem>
                        <SelectItem value="45">₪45</SelectItem>
                        <SelectItem value="50">₪50</SelectItem>
                        <SelectItem value="60">₪60</SelectItem>
                        <SelectItem value="70">₪70</SelectItem>
                        <SelectItem value="75">₪75</SelectItem>
                        <SelectItem value="80">₪80</SelectItem>
                        <SelectItem value="85">₪85</SelectItem>
                        <SelectItem value="90">₪90</SelectItem>
                        <SelectItem value="100">₪100</SelectItem>
                        <SelectItem value="150">₪150</SelectItem>
                        <SelectItem value="180">₪180</SelectItem>
                        <SelectItem value="200">₪200</SelectItem>
                        <SelectItem value="250">₪250</SelectItem>
                        <SelectItem value="300">₪300</SelectItem>
                        <SelectItem value="350">₪350</SelectItem>
                        <SelectItem value="400">₪400</SelectItem>
                        <SelectItem value="450">₪450</SelectItem>
                        <SelectItem value="500">₪500</SelectItem>
                        <SelectItem value="550">₪550</SelectItem>
                        <SelectItem value="600">₪600</SelectItem>
                        <SelectItem value="650">₪650</SelectItem>
                        <SelectItem value="700">₪700</SelectItem>
                        <SelectItem value="800">₪800</SelectItem>
                        <SelectItem value="850">₪850</SelectItem>
                        <SelectItem value="900">₪900</SelectItem>
                        <SelectItem value="1000">₪1000</SelectItem>
                        <SelectItem value="1500">₪1500</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("automationForm.giftAmount.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("giftAmount") &&
                form.watch("giftAmount")! > 40 &&
                form.watch("automationEnabled") && (
                  <Alert>
                    <AlertDescription>
                      <strong>{t("automationForm.note")}</strong>{" "}
                      {t("automationForm.highAmountWarning", {
                        amount: form.watch("giftAmount"),
                      })}
                    </AlertDescription>
                  </Alert>
                )}
            </div>

            {/* Submit button - Fixed at bottom */}
            <div className="flex justify-end pt-6 border-t mt-6">
              <AsyncButton
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                loading={isLoading}
                loadingText={t("automationForm.savingChanges")}
                disabled={isLoading || !form.formState.isDirty}
                className="min-w-32"
              >
                {t("automationForm.saveChanges")}
              </AsyncButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
