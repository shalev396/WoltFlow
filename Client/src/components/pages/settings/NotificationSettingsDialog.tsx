import { useState, useEffect } from "react";
import {
  Settings,
  Smartphone,
  Mail,
  Check,
  Clock,
  Loader2,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

import { settingsService } from "@/services/settings";
import { twoFactorService } from "@/services/twoFactor";
import { useNotificationSettingsQuery } from "@/queries/settings";
import {
  formatPhoneNumber,
  isValidEmail,
  isValid2FACode,
} from "@/utils/validation";

// Check if in development mode
const isDev = import.meta.env.VITE_ENV === "Development1";

interface NotificationSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type VerificationStep = "setup" | "verify-sms" | "verify-email";

interface VerificationState {
  sms: {
    contact: string;
    verified: boolean;
    originalContact: string; // Track original to detect tampering
    sessionId?: string;
  };
  email: {
    contact: string;
    verified: boolean;
    originalContact: string; // Track original to detect tampering
    sessionId?: string;
  };
}

export function NotificationSettingsDialog({
  open,
  onOpenChange,
}: NotificationSettingsDialogProps) {
  const { t } = useTranslation("settings");
  const { data: settings, refetch } = useNotificationSettingsQuery();

  // SMS is now controlled by backend environment variables, not user settings
  const isSmsEnabled = true; // Will be handled by backend validation

  const [step, setStep] = useState<VerificationStep>("setup");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [activeVerificationMethod, setActiveVerificationMethod] = useState<
    "sms" | "email" | null
  >(null);
  const [primaryMethod, setPrimaryMethod] = useState<"sms" | "email">("sms");
  const [notificationOnSuccess, setNotificationOnSuccess] = useState(true);
  const [notificationOnError, setNotificationOnError] = useState(true);

  const [state, setState] = useState<VerificationState>({
    sms: {
      contact: "",
      verified: false,
      originalContact: "",
    },
    email: {
      contact: "",
      verified: false,
      originalContact: "",
    },
  });

  // Initialize state from settings
  useEffect(() => {
    if (settings && open) {
      setState({
        sms: {
          contact: settings.phoneNumber || "",
          verified: Boolean(settings.phoneVerified),
          originalContact: settings.phoneNumber || "",
        },
        email: {
          contact: settings.email || "",
          verified: Boolean(settings.emailVerified),
          originalContact: settings.email || "",
        },
      });

      // Set primary method, defaulting to email if SMS is disabled
      let defaultMethod: "sms" | "email" = !isSmsEnabled ? "email" : "sms";

      // If method is explicitly set to email or sms, use that
      if (
        settings.notificationMethod === "email" ||
        settings.notificationMethod === "sms"
      ) {
        defaultMethod = settings.notificationMethod;
      }
      // If method is "both", default to sms (user can change it)

      setPrimaryMethod(defaultMethod);

      // Set notification preferences
      setNotificationOnSuccess(settings.notificationOnSuccess ?? true);
      setNotificationOnError(settings.notificationOnError ?? true);

      setStep("setup");
      setVerificationCode("");
      setActiveVerificationMethod(null);
      setCooldownSeconds(0);
    }
  }, [settings, open, isSmsEnabled]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  // Reset when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setStep("setup");
      setVerificationCode("");
      setActiveVerificationMethod(null);
      setCooldownSeconds(0);
      setNotificationOnSuccess(true);
      setNotificationOnError(true);
    }
    onOpenChange(open);
  };

  // Validation functions
  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return false;
    const formatted = formatPhoneNumber(phone);
    return formatted !== null;
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) return false;
    return isValidEmail(email);
  };

  // Detect tampering - if contact changed but still marked as verified, invalidate verification
  const detectTampering = (method: "sms" | "email", newContact: string) => {
    const current = state[method];
    if (current.verified && current.originalContact !== newContact) {
      setState((prev) => ({
        ...prev,
        [method]: {
          ...prev[method],
          verified: false,
          sessionId: undefined,
        },
      }));
      toast.warning(
        `${method.toUpperCase()} verification reset due to contact change`
      );
    }
  };

  // Contact change handlers
  const handleContactChange = (method: "sms" | "email", value: string) => {
    detectTampering(method, value);
    setState((prev) => ({
      ...prev,
      [method]: {
        ...prev[method],
        contact: value,
      },
    }));
  };

  // Start 2FA verification
  const handleStartVerification = async (method: "sms" | "email") => {
    // Check if SMS is disabled
    if (method === "sms" && !isSmsEnabled) {
      toast.error("SMS functionality is currently disabled");
      return;
    }

    const contact = state[method].contact;
    const isValid =
      method === "sms" ? validatePhone(contact) : validateEmail(contact);

    if (!isValid) {
      toast.error(
        `Please enter a valid ${
          method === "sms" ? "phone number" : "email address"
        }`
      );
      return;
    }

    setIsLoading(true);
    try {
      if (isDev) {
        // Dev mode - simulate successful response
        console.log(
          `[DEV MODE] Skipping ${method.toUpperCase()} send to ${contact}`
        );
        const sessionId = `dev-session-${Date.now()}`;
        toast.success(`[DEV] ${method.toUpperCase()} verification ready`);
        setState((prev) => ({
          ...prev,
          [method]: {
            ...prev[method],
            sessionId: sessionId,
          },
        }));

        setActiveVerificationMethod(method);
        setStep(method === "sms" ? "verify-sms" : "verify-email");
        setVerificationCode("");
        setCooldownSeconds(30);
      } else {
        // Production mode
        const response = await twoFactorService.start2FA({
          method,
          contact: method === "sms" ? formatPhoneNumber(contact)! : contact,
        });

        setState((prev) => ({
          ...prev,
          [method]: {
            ...prev[method],
            sessionId: response.sessionId,
          },
        }));

        setActiveVerificationMethod(method);
        setStep(method === "sms" ? "verify-sms" : "verify-email");
        setVerificationCode("");
        setCooldownSeconds(30);

        toast.success(
          `Verification code sent via ${method === "sms" ? "SMS" : "email"}`
        );
      }
    } catch (error) {
      console.error("Failed to start verification:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code
  const handleVerifyCode = async () => {
    if (
      !activeVerificationMethod ||
      !verificationCode ||
      !isValid2FACode(verificationCode)
    ) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    const method = activeVerificationMethod;
    // const sessionId = state[method].sessionId;

    setIsLoading(true);
    try {
      if (isDev) {
        // Dev mode - simulate successful verification
        console.log(
          `[DEV MODE] Skipping ${method.toUpperCase()} verification for code: ${verificationCode}`
        );
      } else {
        // Production mode
        await twoFactorService.verify2FA({
          method,
          code: verificationCode,
          // sessionId,
        });
      }

      setState((prev) => ({
        ...prev,
        [method]: {
          ...prev[method],
          verified: true,
          originalContact: prev[method].contact, // Update original to current
        },
      }));

      setStep("setup");
      setActiveVerificationMethod(null);
      setVerificationCode("");
      toast.success(`${method.toUpperCase()} verified successfully!`);
    } catch (error) {
      console.error("Failed to verify code:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate save requirements
  const validateSave = (): { isValid: boolean; error?: string } => {
    // Check if at least one method is verified and has contact info
    const hasVerifiedSms =
      isSmsEnabled && state.sms.verified && state.sms.contact.trim();
    const hasVerifiedEmail = state.email.verified && state.email.contact.trim();

    if (!hasVerifiedSms && !hasVerifiedEmail) {
      const availableMethods = isSmsEnabled
        ? `${t("notificationDialog.primaryMethod.sms")} or ${t(
            "notificationDialog.primaryMethod.email"
          )}`
        : t("notificationDialog.primaryMethod.email");
      return {
        isValid: false,
        error: t("notificationDialog.validation.atLeastOne", {
          methods: availableMethods,
        }),
      };
    }

    if (primaryMethod === "sms") {
      if (!isSmsEnabled) {
        return {
          isValid: false,
          error: t("notificationDialog.validation.smsDisabled"),
        };
      }
      if (!state.sms.contact.trim()) {
        return {
          isValid: false,
          error: t("notificationDialog.validation.phoneRequired"),
        };
      }
      if (!validatePhone(state.sms.contact)) {
        return {
          isValid: false,
          error: t("notificationDialog.validation.phoneInvalid"),
        };
      }
      if (!state.sms.verified) {
        return {
          isValid: false,
          error: t("notificationDialog.validation.phoneNotVerified"),
        };
      }
    } else if (primaryMethod === "email") {
      if (!state.email.contact.trim()) {
        return {
          isValid: false,
          error: t("notificationDialog.validation.emailRequired"),
        };
      }
      if (!validateEmail(state.email.contact)) {
        return {
          isValid: false,
          error: t("notificationDialog.validation.emailInvalid"),
        };
      }
      if (!state.email.verified) {
        return {
          isValid: false,
          error: t("notificationDialog.validation.emailNotVerified"),
        };
      }
    }
    return { isValid: true };
  };

  // Remove contact info and save immediately
  const handleRemoveContact = async (method: "sms" | "email") => {
    // Check if SMS is disabled and they're trying to remove SMS
    if (method === "sms" && !isSmsEnabled) {
      toast.error("SMS functionality is currently disabled");
      return;
    }

    // Check if this would leave no verified methods
    const otherMethod = method === "sms" ? "email" : "sms";
    const otherMethodAvailable = otherMethod === "sms" ? isSmsEnabled : true;
    const otherMethodVerified =
      otherMethodAvailable &&
      state[otherMethod].verified &&
      state[otherMethod].contact.trim();

    if (!otherMethodVerified) {
      const availableMethods = isSmsEnabled ? "SMS or Email" : "Email";
      toast.error(
        `Cannot remove the last verified notification method. Please verify another method first (${availableMethods}).`
      );
      return;
    }

    setIsLoading(true);
    try {
      // Clear the contact info and verification status
      setState((prev) => ({
        ...prev,
        [method]: {
          ...prev[method],
          contact: "",
          verified: false,
          originalContact: "",
        },
      }));

      // If removing the primary method, switch to the other method if available
      let newPrimaryMethod = primaryMethod;
      if (primaryMethod === method) {
        if (state[otherMethod].verified) {
          newPrimaryMethod = otherMethod;
          setPrimaryMethod(otherMethod);
        }
      }

      // Save immediately
      const saveData: {
        notificationMethod?: "sms" | "email" | null;
        notificationOnSuccess?: boolean;
        notificationOnError?: boolean;
        phoneNumber?: string | null;
        phoneVerified?: boolean;
        email?: string | null;
        emailVerified?: boolean;
      } = {};

      // Set primary notification method
      saveData.notificationMethod = newPrimaryMethod;

      // Include notification preferences
      saveData.notificationOnSuccess = notificationOnSuccess;
      saveData.notificationOnError = notificationOnError;

      // Update the specific method being removed
      if (method === "sms") {
        saveData.phoneNumber = null;
        saveData.phoneVerified = false;
        // Keep email as is
        saveData.email = state.email.contact.trim() || null;
        saveData.emailVerified = state.email.verified;
      } else {
        saveData.email = null;
        saveData.emailVerified = false;
        // Keep SMS as is
        saveData.phoneNumber = state.sms.contact.trim()
          ? formatPhoneNumber(state.sms.contact)
          : null;
        saveData.phoneVerified = state.sms.verified;
      }

      await settingsService.updateNotificationSettings(saveData);
      await refetch(); // Refresh settings
      toast.success(`${method.toUpperCase()} contact removed successfully`);
    } catch (error) {
      console.error(`Failed to remove ${method} contact:`, error);
      toast.error(`Failed to remove ${method} contact. Please try again.`);

      // Revert the state change on error
      if (settings) {
        setState({
          sms: {
            contact: settings.phoneNumber || "",
            verified: Boolean(settings.phoneVerified),
            originalContact: settings.phoneNumber || "",
          },
          email: {
            contact: settings.email || "",
            verified: Boolean(settings.emailVerified),
            originalContact: settings.email || "",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings
  const handleSave = async () => {
    const validation = validateSave();
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsLoading(true);
    try {
      const saveData: {
        notificationMethod?: "sms" | "email" | null;
        notificationOnSuccess?: boolean;
        notificationOnError?: boolean;
        phoneNumber?: string | null;
        phoneVerified?: boolean;
        email?: string | null;
        emailVerified?: boolean;
      } = {};

      // Set primary notification method
      saveData.notificationMethod = primaryMethod;

      // Include notification preferences
      saveData.notificationOnSuccess = notificationOnSuccess;
      saveData.notificationOnError = notificationOnError;

      // SMS settings - always save current state (contact info regardless of verification)
      saveData.phoneNumber = state.sms.contact.trim()
        ? formatPhoneNumber(state.sms.contact)
        : null;
      saveData.phoneVerified = state.sms.verified;

      // Email settings - always save current state (contact info regardless of verification)
      saveData.email = state.email.contact.trim() || null;
      saveData.emailVerified = state.email.verified;

      await settingsService.updateNotificationSettings(saveData);
      await refetch(); // Refresh settings
      toast.success("Notification settings saved successfully");
      handleDialogOpenChange(false);
    } catch (error) {
      console.error("Failed to save notification settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validation = validateSave();

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="w-[95vw] max-w-md max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8 rtl:pl-8 rtl:pr-0">
            <Settings className="h-5 w-5 text-blue-600 flex-shrink-0" />
            {t("notificationDialog.title")}
            {isDev && (
              <Badge variant="secondary" className="text-xs">
                {t("notificationDialog.devMode.badge")}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === "setup"
              ? t("notificationDialog.description.setup")
              : t("notificationDialog.description.verify", {
                  method:
                    activeVerificationMethod === "sms"
                      ? t("notificationDialog.primaryMethod.sms")
                      : t("notificationDialog.primaryMethod.email"),
                })}
          </DialogDescription>
        </DialogHeader>

        {isDev && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t("notificationDialog.devMode.alert")}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {step === "setup" && (
            <>
              {/* Primary Notification Method Selector */}
              <div className="space-y-2">
                <Label htmlFor="primary-method">
                  {t("notificationDialog.primaryMethod.label")}
                </Label>
                <Select
                  value={primaryMethod}
                  onValueChange={(value: "sms" | "email") =>
                    setPrimaryMethod(value)
                  }
                >
                  <SelectTrigger id="primary-method">
                    <SelectValue
                      placeholder={t(
                        "notificationDialog.primaryMethod.placeholder"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms" disabled={!isSmsEnabled}>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        {t("notificationDialog.primaryMethod.sms")}
                        {!isSmsEnabled && (
                          <Badge variant="secondary" className="text-xs ml-2">
                            {t("notificationDialog.smsNotifications.disabled")}
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
              </div>

              {/* Notification Preferences */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <Label className="text-base font-medium">
                    {t("notificationDialog.preferences.title")}
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        {t("notificationDialog.preferences.success.label")}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "notificationDialog.preferences.success.description"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="success-notifications"
                        checked={notificationOnSuccess}
                        onCheckedChange={(checked) =>
                          setNotificationOnSuccess(checked === true)
                        }
                      />
                      {/* <Label
                        htmlFor="success-notifications"
                        className="text-sm cursor-pointer"
                      >
                        {notificationOnSuccess ? "Enabled" : "Disabled"}
                      </Label> */}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        {t("notificationDialog.preferences.error.label")}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t("notificationDialog.preferences.error.description")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="error-notifications"
                        checked={notificationOnError}
                        onCheckedChange={(checked) =>
                          setNotificationOnError(checked === true)
                        }
                      />
                      {/* <Label
                        htmlFor="error-notifications"
                        className="text-sm cursor-pointer"
                      >
                        {notificationOnError ? "Enabled" : "Disabled"}
                      </Label> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* SMS Notifications */}
              <div
                className={`rounded-lg border p-4 space-y-3 ${
                  !isSmsEnabled ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <Label className="text-base font-medium">
                    {t("notificationDialog.smsNotifications.title")}
                  </Label>
                  {primaryMethod === "sms" && isSmsEnabled && (
                    <Badge variant="default" className="text-xs">
                      {t("notificationDialog.smsNotifications.primary")}
                    </Badge>
                  )}
                  {!isSmsEnabled && (
                    <Badge variant="secondary" className="text-xs">
                      {t("notificationDialog.smsNotifications.disabled")}
                    </Badge>
                  )}
                </div>

                {!isSmsEnabled && (
                  <div className="text-sm text-muted-foreground">
                    {t("notificationDialog.smsNotifications.disabledMessage")}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder={t(
                        "notificationDialog.smsNotifications.placeholder"
                      )}
                      value={state.sms.contact}
                      onChange={(e) =>
                        handleContactChange("sms", e.target.value)
                      }
                      className="flex-1"
                      disabled={isLoading || !isSmsEnabled}
                    />
                    {state.sms.verified ? (
                      <Button
                        onClick={() => handleRemoveContact("sms")}
                        disabled={isLoading || !isSmsEnabled}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">
                          {t("notificationDialog.smsNotifications.remove")}
                        </span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStartVerification("sms")}
                        disabled={
                          isLoading ||
                          !validatePhone(state.sms.contact) ||
                          !isSmsEnabled
                        }
                        size="sm"
                        variant="outline"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          t("notificationDialog.smsNotifications.verify")
                        )}
                      </Button>
                    )}
                  </div>
                  {state.sms.verified && (
                    <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                      <CheckCircle className="h-4 w-4" />
                      {t("notificationDialog.smsNotifications.verified")}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Notifications */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label className="text-base font-medium">
                    {t("notificationDialog.emailNotifications.title")}
                  </Label>
                  {primaryMethod === "email" && (
                    <Badge variant="default" className="text-xs">
                      {t("notificationDialog.emailNotifications.primary")}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder={t(
                        "notificationDialog.emailNotifications.placeholder"
                      )}
                      value={state.email.contact}
                      onChange={(e) =>
                        handleContactChange("email", e.target.value)
                      }
                      className="flex-1"
                      disabled={isLoading}
                    />
                    {state.email.verified ? (
                      <Button
                        onClick={() => handleRemoveContact("email")}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">
                          {t("notificationDialog.emailNotifications.remove")}
                        </span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStartVerification("email")}
                        disabled={
                          isLoading || !validateEmail(state.email.contact)
                        }
                        size="sm"
                        variant="outline"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          t("notificationDialog.emailNotifications.verify")
                        )}
                      </Button>
                    )}
                  </div>
                  {state.email.verified && (
                    <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                      <CheckCircle className="h-4 w-4" />
                      {t("notificationDialog.emailNotifications.verified")}
                    </div>
                  )}
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogOpenChange(false)}
                  className="flex-1"
                >
                  {t("notificationDialog.buttons.cancel")}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !validation.isValid}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("notificationDialog.buttons.saving")}
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {t("notificationDialog.buttons.save")}
                    </>
                  )}
                </Button>
              </div>

              {!validation.isValid && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validation.error}</AlertDescription>
                </Alert>
              )}
            </>
          )}

          {(step === "verify-sms" || step === "verify-email") &&
            activeVerificationMethod && (
              <>
                <Alert>
                  {activeVerificationMethod === "sms" ? (
                    <Smartphone className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {isDev
                      ? t("notificationDialog.verification.devModeMessage")
                      : t("notificationDialog.verification.productionMessage", {
                          contact: state[activeVerificationMethod].contact,
                          method:
                            activeVerificationMethod === "sms"
                              ? t("notificationDialog.primaryMethod.sms")
                              : t("notificationDialog.primaryMethod.email"),
                        })}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="verification-code">
                    {t("notificationDialog.verification.title")}
                  </Label>
                  <Input
                    id="verification-code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder={t(
                      "notificationDialog.verification.placeholder"
                    )}
                    maxLength={6}
                    className="text-center text-lg tracking-widest font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    {isDev
                      ? t("notificationDialog.verification.devModePrompt")
                      : t("notificationDialog.verification.productionPrompt")}
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep("setup");
                      setActiveVerificationMethod(null);
                      setVerificationCode("");
                    }}
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t("notificationDialog.verification.cancel")}
                  </Button>
                  {!isDev && (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={cooldownSeconds > 0 || isLoading}
                      onClick={() =>
                        handleStartVerification(activeVerificationMethod!)
                      }
                      className="flex-shrink-0"
                    >
                      {cooldownSeconds > 0 ? (
                        <>
                          <Clock className="mr-1 h-3 w-3" />
                          {cooldownSeconds}s
                        </>
                      ) : isLoading ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          {t("notificationDialog.verification.sending")}
                        </>
                      ) : (
                        t("notificationDialog.verification.resend")
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={handleVerifyCode}
                    disabled={
                      isLoading ||
                      !verificationCode ||
                      verificationCode.length !== 6
                    }
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("notificationDialog.verification.verifying")}
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {t("notificationDialog.verification.verify")}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
