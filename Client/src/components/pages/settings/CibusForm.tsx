import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { CreditCard, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import AsyncButton from "@/components/shared/AsyncButton";

import {
  useCibusSettingsQuery,
  useUpdateCibusSettingsMutation,
} from "@/queries/settings";

// Simplified schema for just Cibus credentials
const cibusCredentialsSchema = z.object({
  cibusUsername: z.string().nullable(),
  cibusPassword: z.string().nullable(),
  cibusCompany: z.string().nullable(),
});

type CibusCredentialsFormData = z.infer<typeof cibusCredentialsSchema>;

export default function CibusForm() {
  const { t } = useTranslation("settings");
  const [showPassword, setShowPassword] = useState(false);

  const { data: cibusSettings, isLoading: cibusLoading } =
    useCibusSettingsQuery();
  const updateCibusSettings = useUpdateCibusSettingsMutation();

  const form = useForm<CibusCredentialsFormData>({
    resolver: zodResolver(cibusCredentialsSchema),
    defaultValues: {
      cibusUsername: null,
      cibusPassword: null,
      cibusCompany: null,
    },
  });

  const isLoading = cibusLoading;

  // Populate form when data loads
  useEffect(() => {
    if (cibusSettings) {
      form.reset({
        cibusUsername: cibusSettings.cibusUsername || "",
        cibusPassword: cibusSettings.cibusPassword || "",
        cibusCompany: cibusSettings.cibusCompany || "",
      });
    }
  }, [cibusSettings, form]);

  const onSubmit = async (data: CibusCredentialsFormData) => {
    try {
      await updateCibusSettings.mutateAsync({
        cibusUsername: data.cibusUsername,
        cibusPassword: data.cibusPassword,
        cibusCompany: data.cibusCompany,
      });
    } catch (error) {
      console.error("Failed to update Cibus settings:", error);
    }
  };

  const isSubmitting = updateCibusSettings.isPending;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          {t("cibusForm.title")}
        </CardTitle>
        <CardDescription>{t("cibusForm.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Form {...form}>
          <form className="flex-1 flex flex-col">
            <div className="flex-1 space-y-6">
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  {t("cibusForm.securityAlert")}
                </AlertDescription>
              </Alert>

              {/* Username */}
              <FormField
                control={form.control}
                name="cibusUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("cibusForm.username.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={t("cibusForm.username.placeholder")}
                        disabled={isLoading || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="cibusPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("cibusForm.password.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          value={field.value || ""}
                          type={showPassword ? "text" : "password"}
                          placeholder={t("cibusForm.password.placeholder")}
                          className="pr-10"
                          disabled={isLoading || isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                          <span className="sr-only">
                            {showPassword
                              ? t("cibusForm.password.hide")
                              : t("cibusForm.password.show")}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="cibusCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("cibusForm.company.label")}</FormLabel>
                    <FormDescription>
                      {t("cibusForm.company.description")}
                    </FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        type="text"
                        placeholder={t("cibusForm.company.placeholder")}
                        disabled={isLoading || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit button - Fixed at bottom */}
            <div className="flex justify-end pt-6 border-t mt-6">
              <AsyncButton
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                loading={isSubmitting}
                disabled={isLoading || !form.formState.isDirty}
                className="min-w-32"
              >
                {t("cibusForm.saveChanges")}
              </AsyncButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
