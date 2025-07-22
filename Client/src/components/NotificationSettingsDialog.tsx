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

import { settingsService } from "@/services/settings";
import { useSettingsQuery } from "@/queries/settings";
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
  const { data: settings, refetch } = useSettingsQuery();

  const [step, setStep] = useState<VerificationStep>("setup");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [activeVerificationMethod, setActiveVerificationMethod] = useState<
    "sms" | "email" | null
  >(null);
  const [primaryMethod, setPrimaryMethod] = useState<"sms" | "email">("sms");

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
      setPrimaryMethod(settings.notificationMethod || "sms");
      setStep("setup");
      setVerificationCode("");
      setActiveVerificationMethod(null);
      setCooldownSeconds(0);
    }
  }, [settings, open]);

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
      let response;

      if (isDev) {
        // Dev mode - simulate successful response
        console.log(
          `[DEV MODE] Skipping ${method.toUpperCase()} send to ${contact}`
        );
        response = {
          success: true,
          message: "Development mode - verification skipped",
          sessionId: `dev-session-${Date.now()}`,
        };
        toast.success(`[DEV] ${method.toUpperCase()} verification ready`);
      } else {
        // Production mode
        response = await settingsService.start2FA({
          method,
          contact: method === "sms" ? formatPhoneNumber(contact)! : contact,
        });
      }

      if (response.success) {
        setState((prev) => ({
          ...prev,
          [method]: {
            ...prev[method],
            // sessionId: response.sessionId,
          },
        }));

        setActiveVerificationMethod(method);
        setStep(method === "sms" ? "verify-sms" : "verify-email");
        setVerificationCode("");
        setCooldownSeconds(30);

        if (!isDev) {
          toast.success(
            `Verification code sent via ${method === "sms" ? "SMS" : "email"}`
          );
        }
      } else {
        toast.error(response.message || "Failed to send verification code");
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
    const sessionId = state[method].sessionId;

    setIsLoading(true);
    try {
      let response;

      if (isDev) {
        // Dev mode - simulate successful verification
        console.log(
          `[DEV MODE] Skipping ${method.toUpperCase()} verification for code: ${verificationCode}`
        );
        response = {
          success: true,
          message: "Development mode - verification skipped",
        };
      } else {
        // Production mode
        response = await settingsService.verify2FA({
          method,
          code: verificationCode,
          // sessionId,
        });
      }

      if (response.success) {
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
      } else {
        toast.error(response.message || "Invalid verification code");
      }
    } catch (error) {
      console.error("Failed to verify code:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate save requirements
  const validateSave = (): { isValid: boolean; error?: string } => {
    if (primaryMethod === "sms") {
      if (!state.sms.contact.trim()) {
        return {
          isValid: false,
          error: "Please enter a phone number for SMS notifications",
        };
      }
      if (!state.sms.verified) {
        return {
          isValid: false,
          error: "Please verify your phone number before saving",
        };
      }
    } else if (primaryMethod === "email") {
      if (!state.email.contact.trim()) {
        return {
          isValid: false,
          error: "Please enter an email address for email notifications",
        };
      }
      if (!state.email.verified) {
        return {
          isValid: false,
          error: "Please verify your email address before saving",
        };
      }
    }
    return { isValid: true };
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
        phoneNumber?: string | null;
        phoneVerified?: boolean;
        email?: string | null;
        emailVerified?: boolean;
      } = {};

      // Set primary notification method
      saveData.notificationMethod = primaryMethod;

      // SMS settings - always save current state
      saveData.phoneNumber = state.sms.verified
        ? formatPhoneNumber(state.sms.contact)
        : null;
      saveData.phoneVerified = state.sms.verified;

      // Email settings - always save current state
      saveData.email = state.email.verified ? state.email.contact : null;
      saveData.emailVerified = state.email.verified;

      await settingsService.saveNotificationSettings(saveData);
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
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Notification Settings
            {isDev && (
              <Badge variant="secondary" className="text-xs">
                DEV MODE
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === "setup"
              ? "Configure your notification preferences"
              : `Enter the verification code sent to your ${
                  activeVerificationMethod === "sms" ? "phone" : "email"
                }`}
          </DialogDescription>
        </DialogHeader>

        {isDev && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Development Mode:</strong> API calls are disabled. Any
              6-digit code will work for verification.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {step === "setup" && (
            <>
              {/* Primary Notification Method Selector */}
              <div className="space-y-2">
                <Label htmlFor="primary-method">
                  Primary Notification Method
                </Label>
                <Select
                  value={primaryMethod}
                  onValueChange={(value: "sms" | "email") =>
                    setPrimaryMethod(value)
                  }
                >
                  <SelectTrigger id="primary-method">
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        SMS
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SMS Notifications */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <Label className="text-base font-medium">
                    SMS Notifications
                  </Label>
                  {primaryMethod === "sms" && (
                    <Badge variant="default" className="text-xs">
                      Primary
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="+972501234567 or 050-123-4567"
                      value={state.sms.contact}
                      onChange={(e) =>
                        handleContactChange("sms", e.target.value)
                      }
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={() => handleStartVerification("sms")}
                      disabled={
                        isLoading ||
                        !validatePhone(state.sms.contact) ||
                        state.sms.verified
                      }
                      size="sm"
                      variant={state.sms.verified ? "default" : "outline"}
                    >
                      {state.sms.verified ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                  {state.sms.verified && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </div>
                  )}
                </div>
              </div>

              {/* Email Notifications */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label className="text-base font-medium">
                    Email Notifications
                  </Label>
                  {primaryMethod === "email" && (
                    <Badge variant="default" className="text-xs">
                      Primary
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={state.email.contact}
                      onChange={(e) =>
                        handleContactChange("email", e.target.value)
                      }
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={() => handleStartVerification("email")}
                      disabled={
                        isLoading ||
                        !validateEmail(state.email.contact) ||
                        state.email.verified
                      }
                      size="sm"
                      variant={state.email.verified ? "default" : "outline"}
                    >
                      {state.email.verified ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                  {state.email.verified && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Verified
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
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !validation.isValid}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Settings
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
                    {isDev ? (
                      <>
                        <strong>Development Mode:</strong> Enter any 6-digit
                        code to continue
                      </>
                    ) : (
                      <>
                        We sent a 6-digit verification code to{" "}
                        <strong>
                          {state[activeVerificationMethod].contact}
                        </strong>{" "}
                        via{" "}
                        {activeVerificationMethod === "sms" ? "SMS" : "email"}
                      </>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg tracking-widest font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    {isDev
                      ? "Development mode: Any 6-digit code will work"
                      : "Enter the 6-digit code sent to your contact"}
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
                    Cancel
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
                          Sending...
                        </>
                      ) : (
                        "Resend"
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
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Verify Code
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
