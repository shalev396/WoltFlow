import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Bell, Mail, Phone, Shield, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import AsyncButton from "@/components/shared/AsyncButton";

import {
  notificationSettingsSchema,
  type NotificationSettingsFormData,
} from "@/lib/validations/settings/notifications";
import {
  useNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/queries/settings";
import { twoFactorService } from "@/services/twoFactor";
import { formatPhoneNumber } from "@/utils/validation";

// Check if SMS is enabled via environment variable
const isSmsEnabled = import.meta.env.VITE_SMS_ENABLED === "true";

interface VerificationState {
  isVerifying: boolean;
  step: "input" | "verify" | "success";
  method: "sms" | "email" | null;
  contact: string;
  sessionId: string | null;
  code: string;
  isLoadingVerification: boolean;
}

export default function NotificationsForm() {
  const { t } = useTranslation("settings");
  const [verificationState, setVerificationState] = useState<VerificationState>(
    {
      isVerifying: false,
      step: "input",
      method: null,
      contact: "",
      sessionId: null,
      code: "",
      isLoadingVerification: false,
    }
  );

  const { data: notificationSettings, isLoading } =
    useNotificationSettingsQuery();
  const updateNotificationSettings = useUpdateNotificationSettingsMutation();

  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      isEnabled: false,
      notificationOnSuccess: true,
      notificationOnError: true,
      notificationMethod: null,
      phoneNumber: "",
      phoneVerified: false,
      email: "",
      emailVerified: false,
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (notificationSettings) {
      form.reset({
        isEnabled: notificationSettings.isEnabled,
        notificationOnSuccess: notificationSettings.notificationOnSuccess,
        notificationOnError: notificationSettings.notificationOnError,
        notificationMethod: notificationSettings.notificationMethod,
        phoneNumber: notificationSettings.phoneNumber || "",
        phoneVerified: notificationSettings.phoneVerified,
        email: notificationSettings.email || "",
        emailVerified: notificationSettings.emailVerified,
      });
    }
  }, [notificationSettings, form]);

  const onSubmit = async (data: NotificationSettingsFormData) => {
    try {
      await updateNotificationSettings.mutateAsync(data);
    } catch (error) {
      console.error("Failed to update notification settings:", error);
    }
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return false;
    // Use the same formatPhoneNumber function to handle Israeli numbers
    const formatted = formatPhoneNumber(phone);
    return formatted !== null;
  };

  // Start verification process
  const handleStartVerification = async (
    method: "sms" | "email",
    contact: string
  ) => {
    // Check if SMS is disabled
    if (method === "sms" && !isSmsEnabled) {
      toast.error("SMS functionality is currently disabled");
      return;
    }

    const isValid =
      method === "sms" ? validatePhone(contact) : validateEmail(contact);

    if (!isValid) {
      const contactType =
        method === "sms"
          ? t("notificationsForm.toast.phoneNumber")
          : t("notificationsForm.toast.emailAddress");
      toast.error(
        t("notificationsForm.toast.invalidContact", { type: contactType })
      );
      return;
    }

    setVerificationState((prev) => ({ ...prev, isLoadingVerification: true }));

    try {
      const response = await twoFactorService.start2FA({ method, contact });

      setVerificationState({
        isVerifying: true,
        step: "verify",
        method,
        contact,
        sessionId: response.sessionId || null,
        code: "",
        isLoadingVerification: false,
      });

      const methodName =
        method === "sms"
          ? t("notificationsForm.toast.phone")
          : t("notificationsForm.toast.email");
      toast.success(
        t("notificationsForm.toast.codeSent", { method: methodName })
      );
    } catch {
      toast.error(t("notificationsForm.toast.sendFailed"));
      setVerificationState((prev) => ({
        ...prev,
        isLoadingVerification: false,
      }));
    }
  };

  // Verify code
  const handleVerifyCode = async () => {
    if (
      !verificationState.code ||
      !verificationState.method ||
      !verificationState.sessionId
    ) {
      toast.error(t("notificationsForm.toast.enterCode"));
      return;
    }

    setVerificationState((prev) => ({ ...prev, isLoadingVerification: true }));

    try {
      await twoFactorService.verify2FA({
        method: verificationState.method,
        code: verificationState.code,
        sessionId: verificationState.sessionId,
      });

      // Update form with verified contact
      if (verificationState.method === "sms") {
        const formattedPhone = formatPhoneNumber(verificationState.contact);
        form.setValue(
          "phoneNumber",
          formattedPhone || verificationState.contact
        );
        form.setValue("phoneVerified", true);
      } else {
        form.setValue("email", verificationState.contact);
        form.setValue("emailVerified", true);
      }

      setVerificationState({
        isVerifying: false,
        step: "success",
        method: verificationState.method,
        contact: verificationState.contact,
        sessionId: null,
        code: "",
        isLoadingVerification: false,
      });

      const methodName =
        verificationState.method === "sms"
          ? t("notificationsForm.toast.phone")
          : t("notificationsForm.toast.email");
      toast.success(
        t("notificationsForm.verificationSuccess", { method: methodName })
      );

      // Reset to input step after 2 seconds
      setTimeout(() => {
        setVerificationState((prev) => ({ ...prev, step: "input" }));
      }, 2000);
    } catch {
      toast.error(t("notificationsForm.toast.invalidCode"));
      setVerificationState((prev) => ({
        ...prev,
        isLoadingVerification: false,
      }));
    }
  };

  const watchedMethod = form.watch("notificationMethod");
  const watchedPhone = form.watch("phoneNumber");
  const watchedEmail = form.watch("email");
  const phoneVerified = form.watch("phoneVerified");
  const emailVerified = form.watch("emailVerified");

  const getVerificationStatus = () => {
    if (!watchedMethod) return null;

    if (watchedMethod === "sms") {
      return {
        contact: watchedPhone,
        verified: phoneVerified,
        type: "phone",
      };
    } else {
      return {
        contact: watchedEmail,
        verified: emailVerified,
        type: "email",
      };
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          {t("notificationsForm.title")}
        </CardTitle>
        <CardDescription>{t("notificationsForm.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Form {...form}>
          <form className="flex-1 flex flex-col">
            <div className="flex-1 space-y-6">
              {/* Master toggle */}
              <FormField
                control={form.control}
                name="isEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Bell
                          className={
                            field.value
                              ? "h-4 w-4 text-purple-600"
                              : "h-4 w-4 text-muted-foreground"
                          }
                        />
                        {t("notificationsForm.enableNotifications.label")}
                      </FormLabel>
                      <FormDescription>
                        {t("notificationsForm.enableNotifications.description")}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={
                          isLoading || updateNotificationSettings.isPending
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* When to Notify - Always visible, disabled when notifications are off */}
              <div className={!form.watch("isEnabled") ? "opacity-50" : ""}>
                <FormField
                  control={form.control}
                  name="notificationOnSuccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t("notificationsForm.successfulRuns.label")}
                        </FormLabel>
                        <FormDescription>
                          {t("notificationsForm.successfulRuns.description")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={
                            !form.watch("isEnabled") ||
                            isLoading ||
                            updateNotificationSettings.isPending
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="notificationOnError"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t("notificationsForm.failedRuns.label")}
                          </FormLabel>
                          <FormDescription>
                            {t("notificationsForm.failedRuns.description")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={
                              !form.watch("isEnabled") ||
                              isLoading ||
                              updateNotificationSettings.isPending
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Method - Always visible, disabled when notifications are off */}
              <FormField
                control={form.control}
                name="notificationMethod"
                render={({ field }) => (
                  <FormItem
                    className={!form.watch("isEnabled") ? "opacity-50" : ""}
                  >
                    <FormLabel>
                      {t("notificationsForm.contactMethod.label")}
                    </FormLabel>
                    <Select
                      value={field.value || "none"}
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? null : value)
                      }
                      disabled={
                        !form.watch("isEnabled") ||
                        isLoading ||
                        updateNotificationSettings.isPending
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "notificationsForm.contactMethod.placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          {t("notificationsForm.contactMethod.none")}
                        </SelectItem>
                        <SelectItem value="sms" disabled={!isSmsEnabled}>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {t("notificationDialog.primaryMethod.sms")}
                            {!isSmsEnabled && (
                              <Badge
                                variant="secondary"
                                className="text-xs ml-2"
                              >
                                Disabled
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value="email">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {t("notificationDialog.primaryMethod.email")}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("notificationsForm.contactMethod.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact info and verification - Only show when notifications are enabled and method is selected */}
              {form.watch("isEnabled") && watchedMethod && (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                  {watchedMethod === "sms" ? (
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {t("notificationsForm.phoneNumber.label")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder={t(
                                "notificationsForm.phoneNumber.placeholder"
                              )}
                              disabled={
                                isLoading ||
                                updateNotificationSettings.isPending
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {t("notificationsForm.phoneNumber.description")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {t("notificationsForm.email.label")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""}
                              type="email"
                              placeholder={t(
                                "notificationsForm.email.placeholder"
                              )}
                              disabled={
                                isLoading ||
                                updateNotificationSettings.isPending
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {t("notificationsForm.email.description")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Inline Verification */}
                  {verificationStatus && verificationStatus.contact && (
                    <div className="space-y-3">
                      {/* Current verification status */}
                      <div className="flex items-center justify-between p-2 bg-background rounded border">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium">
                            {t("notificationsForm.verificationStatus.label")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {verificationStatus.verified ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-xs py-0 px-2"
                            >
                              <Check className="h-2 w-2 mr-1 text-green-600 dark:text-green-400" />
                              {t(
                                "notificationsForm.verificationStatus.verified"
                              )}
                            </Badge>
                          ) : (
                            <>
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800 text-xs py-0 px-2"
                              >
                                <X className="h-2 w-2 mr-1 text-yellow-600 dark:text-yellow-400" />
                                {t(
                                  "notificationsForm.verificationStatus.notVerified"
                                )}
                              </Badge>
                              {!verificationState.isVerifying &&
                                verificationState.step === "input" &&
                                verificationStatus.contact && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="h-6 text-xs px-2"
                                    onClick={() =>
                                      handleStartVerification(
                                        verificationStatus.type === "phone"
                                          ? "sms"
                                          : "email",
                                        verificationStatus.contact!
                                      )
                                    }
                                    disabled={
                                      isLoading ||
                                      updateNotificationSettings.isPending ||
                                      verificationState.isLoadingVerification
                                    }
                                  >
                                    {verificationState.isLoadingVerification ? (
                                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    ) : null}
                                    {t(
                                      "notificationsForm.verificationStatus.verify"
                                    )}
                                  </Button>
                                )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Verification code input step */}
                      {verificationState.isVerifying &&
                        verificationState.step === "verify" && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded space-y-2">
                            <div className="flex items-center gap-2">
                              <Shield className="h-3 w-3 text-blue-600" />
                              <span className="text-xs font-medium">
                                {t("notificationsForm.enterCode.title")}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {t("notificationsForm.enterCode.subtitle", {
                                contact: verificationState.contact,
                              })}
                            </p>
                            <div className="flex gap-2">
                              <Input
                                placeholder={t(
                                  "notificationsForm.enterCode.placeholder"
                                )}
                                value={verificationState.code}
                                onChange={(e) =>
                                  setVerificationState((prev) => ({
                                    ...prev,
                                    code: e.target.value,
                                  }))
                                }
                                className="flex-1 h-8 text-sm"
                                maxLength={6}
                              />
                              <Button
                                size="sm"
                                className="h-8 text-xs px-3"
                                onClick={handleVerifyCode}
                                disabled={
                                  verificationState.isLoadingVerification ||
                                  !verificationState.code
                                }
                              >
                                {verificationState.isLoadingVerification ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  t("notificationsForm.enterCode.verify")
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                      {/* Success state */}
                      {verificationState.step === "success" && (
                        <div className="p-2 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded">
                          <div className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium text-green-800 dark:text-green-200">
                              {t("notificationsForm.verificationSuccess", {
                                method:
                                  verificationState.method === "sms"
                                    ? t("notificationsForm.toast.phone")
                                    : t("notificationsForm.toast.email"),
                              })}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Warning if not verified */}
                      {!verificationStatus.verified &&
                        verificationState.step === "input" &&
                        !verificationState.isVerifying && (
                          <Alert className="py-2">
                            <Shield className="h-3 w-3" />
                            <AlertDescription className="text-xs">
                              {t("notificationsForm.verificationWarning", {
                                type: verificationStatus.type,
                              })}
                            </AlertDescription>
                          </Alert>
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit button - Fixed at bottom */}
            <div className="flex justify-end pt-6 border-t mt-6">
              <AsyncButton
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                loading={updateNotificationSettings.isPending}
                disabled={isLoading || !form.formState.isDirty}
                className="min-w-32"
              >
                {t("notificationsForm.saveChanges")}
              </AsyncButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
