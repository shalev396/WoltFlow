import { z } from "zod";
import { isValidEmail, isValidPhoneNumber } from "@/utils/validation";

export const notificationSettingsSchema = z
  .object({
    isEnabled: z.boolean(),
    notificationOnSuccess: z.boolean(),
    notificationOnError: z.boolean(),
    notificationMethod: z.enum(["sms", "email", "both"]).nullable().optional(),
    phoneNumber: z
      .string()
      .optional()
      .refine((value) => !value || value === "" || isValidPhoneNumber(value), {
        message: "Invalid phone number format. Use +972XXXXXXXXX format",
      }),
    phoneVerified: z.boolean(),
    email: z
      .string()
      .optional()
      .refine((value) => !value || value === "" || isValidEmail(value), {
        message: "Invalid email address",
      }),
    emailVerified: z.boolean(),
  })
  .refine(
    (data) => {
      // If notifications are enabled, at least one method should be configured
      if (data.isEnabled && data.notificationMethod) {
        if (data.notificationMethod === "sms") {
          return !!data.phoneNumber && data.phoneVerified;
        }
        if (data.notificationMethod === "email") {
          return !!data.email && data.emailVerified;
        }
      }
      return true;
    },
    {
      message:
        "Please verify your contact method before enabling notifications",
      path: ["notificationMethod"],
    }
  );

export type NotificationSettingsFormData = z.infer<
  typeof notificationSettingsSchema
>;
