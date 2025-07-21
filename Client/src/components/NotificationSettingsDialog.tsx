import { useState, useEffect } from "react";
import {
  Settings,
  Smartphone,
  Mail,
  Check,
  Clock,
  Shield,
  Loader2,
  AlertTriangle,
  CheckCircle,
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

// Development flag to skip actual SMS/Email sending (set to false for production)
const DEV_SKIP_VERIFICATION = "true";

interface NotificationSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationSettingsDialog({
  open,
  onOpenChange,
}: NotificationSettingsDialogProps) {
  const { data: settings } = useSettingsQuery();
  const [step, setStep] = useState<"setup" | "verify-contact" | "verify">(
    "setup"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Form state
  const [notificationMethod, setNotificationMethod] = useState<"sms" | "email">(
    "sms"
  );
  const [notificationContact, setNotificationContact] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [contactVerified, setContactVerified] = useState(false);

  // Security state to prevent 2FA bypass/mixing
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [active2FAMethod, setActive2FAMethod] = useState<
    "sms" | "email" | null
  >(null);
  const [active2FAContact, setActive2FAContact] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    method?: string;
    contact?: string;
    code?: string;
  }>({});

  // Update form when settings change
  useEffect(() => {
    if (settings) {
      setNotificationMethod(settings.notificationMethod || "sms");
      setNotificationContact(settings.notificationContact || "");
      setVerificationCode("");
      setContactVerified(false);
      setErrors({});
      // Reset security state
      setActiveSessionId(null);
      setActive2FAMethod(null);
      setActive2FAContact(null);
    }
  }, [settings]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open && settings) {
      setNotificationMethod(settings.notificationMethod || "sms");
      setNotificationContact(settings.notificationContact || "");
      setVerificationCode("");
      setContactVerified(false);
      setErrors({});
      setStep("setup");
      setCooldownSeconds(0);
      // Reset security state
      setActiveSessionId(null);
      setActive2FAMethod(null);
      setActive2FAContact(null);
    }
  }, [open, settings]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  // Reset state when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setStep("setup");
      setVerificationCode("");
      setContactVerified(false);
      setCooldownSeconds(0);
      setErrors({});
      // Clear security state when closing
      setActiveSessionId(null);
      setActive2FAMethod(null);
      setActive2FAContact(null);
    }
    onOpenChange(open);
  };

  // Validate contact based on method
  const validateContact = (
    contact: string,
    method: "sms" | "email"
  ): boolean => {
    if (method === "email") {
      return isValidEmail(contact);
    } else {
      const formatted = formatPhoneNumber(contact);
      return formatted !== null;
    }
  };

  // Enhanced phone number validation with detailed feedback
  const validatePhoneNumber = (
    phone: string
  ): { valid: boolean; message?: string; formatted?: string } => {
    if (!phone.trim()) {
      return { valid: false, message: "Phone number is required" };
    }

    // Remove all non-digit characters for checking
    const cleaned = phone.replace(/\D/g, "");

    // Check minimum length
    if (cleaned.length < 8) {
      return { valid: false, message: "Phone number is too short" };
    }

    // Check maximum length
    if (cleaned.length > 15) {
      return { valid: false, message: "Phone number is too long" };
    }

    // Try to format the number
    const formatted = formatPhoneNumber(phone);
    if (!formatted) {
      return {
        valid: false,
        message:
          "Invalid phone number format. Use international format (+972501234567) or local format (050-123-4567)",
      };
    }

    // Additional checks for Israeli numbers (since default country code is 972)
    if (formatted.startsWith("+972")) {
      const localPart = formatted.substring(4);
      // Israeli mobile numbers should start with 5 and be 9 digits
      if (localPart.length === 9 && localPart.startsWith("5")) {
        return { valid: true, formatted };
      }
      // Israeli landline numbers can start with other digits and be 8-9 digits
      if (localPart.length >= 8 && localPart.length <= 9) {
        return { valid: true, formatted };
      }
      return {
        valid: false,
        message:
          "Invalid Israeli phone number. Mobile should be 9 digits starting with 5, landline 8-9 digits",
      };
    }

    // For other international numbers, basic validation passed
    return { valid: true, formatted };
  };

  // Enhanced email validation with detailed feedback
  const validateEmailAddress = (
    email: string
  ): { valid: boolean; message?: string; formatted?: string } => {
    if (!email.trim()) {
      return { valid: false, message: "Email address is required" };
    }

    // Basic format validation
    if (!isValidEmail(email)) {
      return {
        valid: false,
        message:
          "Invalid email format. Please use a valid email address like user@example.com",
      };
    }

    // Additional checks
    const normalizedEmail = email.trim().toLowerCase();

    // Check for common email issues
    if (normalizedEmail.includes("..")) {
      return { valid: false, message: "Email cannot contain consecutive dots" };
    }

    if (normalizedEmail.startsWith(".") || normalizedEmail.endsWith(".")) {
      return { valid: false, message: "Email cannot start or end with a dot" };
    }

    return { valid: true, formatted: normalizedEmail };
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!notificationMethod) {
      newErrors.method = "Please select a notification method";
    }

    if (!notificationContact.trim()) {
      newErrors.contact = "Contact information is required";
    } else if (notificationMethod === "email") {
      const emailValidation = validateEmailAddress(notificationContact);
      if (!emailValidation.valid) {
        newErrors.contact = emailValidation.message;
      }
    } else {
      const phoneValidation = validatePhoneNumber(notificationContact);
      if (!phoneValidation.valid) {
        newErrors.contact = phoneValidation.message;
      }
    }

    if (
      step === "verify" &&
      (!verificationCode || !isValid2FACode(verificationCode))
    ) {
      newErrors.code = "Please enter a valid 6-digit verification code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Security check to prevent 2FA method mixing
  const validate2FASecurity = (): boolean => {
    if (step === "verify") {
      // If we're in verification step, ensure consistency
      if (!active2FAMethod || !active2FAContact || !activeSessionId) {
        toast.error(
          "Security error: 2FA session invalid. Please restart the process."
        );
        setStep("setup");
        return false;
      }

      // Ensure the method and contact haven't changed
      if (
        active2FAMethod !== notificationMethod ||
        active2FAContact !== notificationContact
      ) {
        toast.error(
          "Security error: Cannot change method during verification. Please restart."
        );
        setStep("setup");
        setActiveSessionId(null);
        setActive2FAMethod(null);
        setActive2FAContact(null);
        return false;
      }
    }
    return true;
  };

  // Verify contact format and proceed to next step
  const handleVerifyContact = () => {
    if (!validateForm()) {
      return;
    }

    // Clear any existing 2FA session when starting new verification
    setActiveSessionId(null);
    setActive2FAMethod(null);
    setActive2FAContact(null);

    if (notificationMethod === "email") {
      const emailValidation = validateEmailAddress(notificationContact);
      if (!emailValidation.valid) {
        toast.error(emailValidation.message || "Invalid email address");
        return;
      }

      // Update contact with formatted email
      if (emailValidation.formatted) {
        setNotificationContact(emailValidation.formatted);
      }

      setContactVerified(true);
      setStep("verify-contact");
      toast.success("Email address format verified!");
    } else {
      const phoneValidation = validatePhoneNumber(notificationContact);
      if (!phoneValidation.valid) {
        toast.error(phoneValidation.message || "Invalid phone number");
        return;
      }

      // Update contact with formatted number
      if (phoneValidation.formatted) {
        setNotificationContact(phoneValidation.formatted);
      }

      setContactVerified(true);
      setStep("verify-contact");
      toast.success("Phone number format verified!");
    }
  };

  // Start 2FA verification with security measures
  const handleStart2FA = async () => {
    if (!validateForm() || !validate2FASecurity()) {
      return;
    }

    // Double-check contact verification
    if (!contactVerified) {
      toast.error(
        `Please verify ${
          notificationMethod === "email" ? "email address" : "phone number"
        } format first`
      );
      return;
    }

    setIs2FALoading(true);
    try {
      let response;

      if (DEV_SKIP_VERIFICATION === "true") {
        // Development mode - simulate successful response
        console.log(
          `[DEV MODE] Skipping ${notificationMethod.toUpperCase()} send to ${notificationContact}`
        );
        response = {
          success: true,
          message: "Development mode - verification skipped",
          sessionId: `dev-session-${Date.now()}`,
        };
        toast.success(
          `Development mode: ${notificationMethod.toUpperCase()} sending skipped`
        );
      } else {
        // Production mode - use method-specific API calls
        if (notificationMethod === "email") {
          response = await settingsService.start2FAEmail(notificationContact);
        } else {
          const formattedPhone = formatPhoneNumber(notificationContact);
          if (!formattedPhone) {
            throw new Error("Invalid phone number format");
          }
          response = await settingsService.start2FASMS(formattedPhone);
        }
      }

      if (response.success) {
        // Set security state to track this 2FA session
        setActiveSessionId(response.sessionId || `session-${Date.now()}`);
        setActive2FAMethod(notificationMethod);
        setActive2FAContact(notificationContact);

        setStep("verify");
        setCooldownSeconds(30);
        const methodName = notificationMethod === "email" ? "Email" : "SMS";
        toast.success(
          DEV_SKIP_VERIFICATION === "true"
            ? `Development mode: ${methodName} verification ready`
            : `Verification code sent via ${methodName.toLowerCase()}`
        );
      } else {
        toast.error(response.message || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Failed to start verification:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIs2FALoading(false);
    }
  };

  // Verify 2FA with security checks
  const handleVerifyAndSave = async () => {
    if (!validateForm() || !validate2FASecurity()) {
      return;
    }

    // Additional security check - ensure we have an active session
    if (!activeSessionId || !active2FAMethod || !active2FAContact) {
      toast.error(
        "Security error: No active 2FA session. Please restart the process."
      );
      setStep("setup");
      return;
    }

    // Ensure the verification is for the same method and contact that started the session
    if (
      active2FAMethod !== notificationMethod ||
      active2FAContact !== notificationContact
    ) {
      toast.error(
        "Security error: Method or contact mismatch. Please restart the process."
      );
      setStep("setup");
      setActiveSessionId(null);
      setActive2FAMethod(null);
      setActive2FAContact(null);
      return;
    }

    setIsLoading(true);
    try {
      let verifyResponse;

      if (DEV_SKIP_VERIFICATION === "true") {
        // Development mode - simulate successful verification
        console.log(
          `[DEV MODE] Skipping ${notificationMethod.toUpperCase()} verification for code: ${verificationCode}`
        );
        verifyResponse = {
          success: true,
          message: "Development mode - verification skipped",
        };
      } else {
        // Production mode - use method-specific verification with session ID
        if (notificationMethod === "email") {
          verifyResponse = await settingsService.verify2FAEmail(
            verificationCode,
            activeSessionId
          );
        } else {
          verifyResponse = await settingsService.verify2FASMS(
            verificationCode,
            activeSessionId
          );
        }
      }

      if (!verifyResponse.success) {
        toast.error(verifyResponse.message || "Invalid verification code");
        return;
      }

      // Clear security state after successful verification
      setActiveSessionId(null);
      setActive2FAMethod(null);
      setActive2FAContact(null);

      // Save notification settings
      await handleSave();
    } catch (error) {
      console.error("Failed to verify code:", error);
      toast.error("Verification failed. Please try again.");
      // Clear security state on error
      setActiveSessionId(null);
      setActive2FAMethod(null);
      setActive2FAContact(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Save notification settings
  const handleSave = async () => {
    setIsLoading(true);
    try {
      let finalContact = notificationContact;

      // Format contact based on method
      if (notificationMethod === "sms") {
        const formatted = formatPhoneNumber(notificationContact);
        if (!formatted) {
          throw new Error("Invalid phone number format");
        }
        finalContact = formatted;
      } else {
        const formatted = validateEmailAddress(notificationContact);
        if (formatted.formatted) {
          finalContact = formatted.formatted;
        }
      }

      await settingsService.updateNotificationSettings({
        notificationMethod,
        notificationContact: finalContact,
      });

      toast.success("Notification settings saved successfully");
      handleDialogOpenChange(false);
    } catch (error) {
      console.error("Failed to save notification settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "setup") {
      handleVerifyContact();
    } else if (step === "verify-contact") {
      handleStart2FA();
    } else {
      handleVerifyAndSave();
    }
  };

  // Security check: prevent method changes during 2FA process
  const handleMethodChange = (value: "sms" | "email") => {
    if (activeSessionId) {
      toast.error(
        "Cannot change method during active 2FA session. Please restart the process."
      );
      setStep("setup");
      setActiveSessionId(null);
      setActive2FAMethod(null);
      setActive2FAContact(null);
      return;
    }
    setNotificationMethod(value);
    setContactVerified(false);
    setErrors((prev) => ({ ...prev, method: undefined }));
  };

  // Security check: prevent contact changes during 2FA process
  const handleContactChange = (value: string) => {
    if (activeSessionId) {
      toast.error(
        "Cannot change contact during active 2FA session. Please restart the process."
      );
      setStep("setup");
      setActiveSessionId(null);
      setActive2FAMethod(null);
      setActive2FAContact(null);
      return;
    }
    setNotificationContact(value);
    setContactVerified(false);
    setErrors((prev) => ({ ...prev, contact: undefined }));
  };

  const currentContact = settings?.notificationContact;
  const currentMethod = settings?.notificationMethod;
  const isVerified = settings?.notificationVerified;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="w-[95vw] max-w-md max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Notification Settings
            {DEV_SKIP_VERIFICATION === "true" && (
              <Badge variant="secondary" className="text-xs">
                DEV MODE
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === "setup"
              ? "Configure how you want to receive notifications"
              : step === "verify-contact"
              ? `Confirm your ${
                  notificationMethod === "email"
                    ? "email address"
                    : "phone number"
                } and send verification code`
              : `Enter the verification code sent to your ${
                  notificationMethod === "email" ? "email" : "phone"
                }`}
          </DialogDescription>
        </DialogHeader>

        {/* Development Mode Warning */}
        {DEV_SKIP_VERIFICATION === "true" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Development Mode:</strong>{" "}
              {notificationMethod === "email" ? "Email" : "SMS"} sending is
              disabled. Any 6-digit code will work for verification.
            </AlertDescription>
          </Alert>
        )}

        {/* Active 2FA Session Warning */}
        {activeSessionId && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Secure 2FA Session Active:</strong>{" "}
              {active2FAMethod?.toUpperCase()} verification in progress for{" "}
              {active2FAContact}
            </AlertDescription>
          </Alert>
        )}

        {/* Current Status */}
        {currentContact &&
          currentMethod &&
          step === "setup" &&
          !activeSessionId && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Current: {currentMethod.toUpperCase()} - {currentContact}
                </span>
                <Badge variant={isVerified ? "default" : "secondary"}>
                  {isVerified ? "Verified" : "Unverified"}
                </Badge>
              </AlertDescription>
            </Alert>
          )}

        <div className="space-y-4">
          {step === "setup" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="notification-method">Notification Method</Label>
                <Select
                  value={notificationMethod}
                  onValueChange={handleMethodChange}
                  disabled={!!activeSessionId}
                >
                  <SelectTrigger id="notification-method">
                    <SelectValue placeholder="Select method" />
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
                {errors.method && (
                  <p className="text-sm text-destructive">{errors.method}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-contact">
                  {notificationMethod === "email"
                    ? "Email Address"
                    : "Phone Number"}
                </Label>
                <Input
                  id="notification-contact"
                  type={notificationMethod === "email" ? "email" : "tel"}
                  value={notificationContact}
                  onChange={(e) => handleContactChange(e.target.value)}
                  disabled={!!activeSessionId}
                  placeholder={
                    notificationMethod === "email"
                      ? "your.email@example.com"
                      : "+972501234567 or 050-123-4567"
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {notificationMethod === "email"
                    ? "We'll send notifications to this email address"
                    : "Israeli numbers: +972501234567 or 050-123-4567. International: +1234567890"}
                </p>
                {errors.contact && (
                  <p className="text-sm text-destructive">{errors.contact}</p>
                )}
              </div>

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
                  onClick={handleSubmit}
                  disabled={
                    isLoading ||
                    is2FALoading ||
                    !notificationContact ||
                    !validateContact(notificationContact, notificationMethod)
                  }
                  className="flex-1"
                >
                  {notificationMethod === "email"
                    ? "Verify Email Address"
                    : "Verify Phone Number"}
                </Button>
              </div>
            </>
          )}

          {step === "verify-contact" && (
            <>
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  {notificationMethod === "email"
                    ? "Email address"
                    : "Phone number"}{" "}
                  chosen: <strong>{notificationContact}</strong>
                  <br />
                  Ready to send verification code via{" "}
                  {notificationMethod === "email" ? "email" : "SMS"}
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("setup")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={is2FALoading}
                  className="flex-1"
                >
                  {is2FALoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {DEV_SKIP_VERIFICATION === "true"
                        ? "Simulating..."
                        : "Sending..."}
                    </>
                  ) : (
                    <>
                      {notificationMethod === "email" ? (
                        <Mail className="mr-2 h-4 w-4" />
                      ) : (
                        <Smartphone className="mr-2 h-4 w-4" />
                      )}
                      Send Verification Code
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {step === "verify" && (
            <>
              <Alert>
                {notificationMethod === "email" ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <Smartphone className="h-4 w-4" />
                )}
                <AlertDescription>
                  {DEV_SKIP_VERIFICATION === "true" ? (
                    <>
                      <strong>Development Mode:</strong> Enter any 6-digit code
                      to continue
                    </>
                  ) : (
                    <>
                      We sent a 6-digit verification code to{" "}
                      <strong>{notificationContact}</strong> via{" "}
                      {notificationMethod === "email" ? "email" : "SMS"}
                    </>
                  )}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setErrors((prev) => ({ ...prev, code: undefined }));
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg tracking-widest font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  {DEV_SKIP_VERIFICATION === "true"
                    ? "Development mode: Any 6-digit code will work"
                    : `Enter the 6-digit code sent to your ${
                        notificationMethod === "email" ? "email" : "phone"
                      }`}
                </p>
                {errors.code && (
                  <p className="text-sm text-destructive">{errors.code}</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("verify-contact")}
                  className="flex-1"
                >
                  Back
                </Button>
                {DEV_SKIP_VERIFICATION !== "true" && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={cooldownSeconds > 0 || is2FALoading}
                    onClick={handleStart2FA}
                    className="flex-shrink-0"
                  >
                    {cooldownSeconds > 0 ? (
                      <>
                        <Clock className="mr-1 h-3 w-3" />
                        {cooldownSeconds}s
                      </>
                    ) : is2FALoading ? (
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
                  onClick={handleSubmit}
                  disabled={isLoading || !verificationCode}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {DEV_SKIP_VERIFICATION === "true"
                        ? "Simulating..."
                        : "Verifying..."}
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Verify & Save
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
