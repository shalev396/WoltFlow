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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import AsyncButton from "@/components/shared/AsyncButton";
import { AutomationToggle } from "@/components/shared/AutomationToggle";

import {
  runSettingsSchema,
  type RunSettingsFormData,
} from "@/lib/validations/settings/run";
import {
  useRunSettingsQuery,
  useUpdateRunSettingsMutation,
} from "@/queries/settings";

const DEFAULT_GIFT_AMOUNT = 35;
const HIGH_AMOUNT_WARNING_THRESHOLD = 100;

export default function AutomationSettingsForm() {
  const { t } = useTranslation("settings");
  const { data: runSettings, isLoading: isQueryLoading } = useRunSettingsQuery();
  const updateRunSettingsMutation = useUpdateRunSettingsMutation();

  const form = useForm<RunSettingsFormData>({
    resolver: zodResolver(runSettingsSchema),
    defaultValues: {
      automationEnabled: false,
      giftAmount: DEFAULT_GIFT_AMOUNT,
    },
  });

  useEffect(() => {
    if (runSettings) {
      const giftAmount = runSettings.giftAmount
        ? typeof runSettings.giftAmount === "string"
          ? parseFloat(runSettings.giftAmount)
          : runSettings.giftAmount
        : DEFAULT_GIFT_AMOUNT;

      form.reset({
        automationEnabled: runSettings.automationEnabled || false,
        giftAmount,
      });
    }
  }, [runSettings, form]);

  const onSubmit = async (data: RunSettingsFormData) => {
    try {
      await updateRunSettingsMutation.mutateAsync({
        automationEnabled: data.automationEnabled,
        giftAmount: data.giftAmount,
      });
    } catch (error) {
      console.error("Failed to update automation settings:", error);
    }
  };

  const isLoading = updateRunSettingsMutation.isPending;

  if (isQueryLoading) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-40" />
          </CardTitle>
          <Skeleton className="h-4 w-60 mt-1" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-52" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="flex justify-end pt-6 border-t mt-6">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <AutomationToggle
                control={form.control}
                name="automationEnabled"
              />

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
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={1500}
                        step={1}
                        placeholder={t("automationForm.giftAmount.placeholder")}
                        disabled={!form.watch("automationEnabled")}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") {
                            field.onChange(undefined);
                            return;
                          }
                          const parsed = Number(raw);
                          field.onChange(Number.isNaN(parsed) ? undefined : parsed);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("automationForm.giftAmount.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("giftAmount") &&
                form.watch("giftAmount")! > HIGH_AMOUNT_WARNING_THRESHOLD &&
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
