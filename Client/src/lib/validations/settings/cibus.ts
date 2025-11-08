import { z } from "zod";

export const cibusSettingsSchema = z.object({
  cibusUsername: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username is too long")
    .nullable()
    .optional(),
  cibusPassword: z
    .string()
    .min(1, "Password is required")
    .max(200, "Password is too long")
    .nullable()
    .optional(),
  cibusCompany: z
    .string()
    .min(1, "Company is required")
    .max(100, "Company name is too long")
    .nullable()
    .optional(),
  automationEnabled: z.boolean(),
  automationMode: z.enum(["full-run", "buy-only", "cross-account"]),
  giftAmount: z
    .number()
    .min(20, "Minimum amount is ₪20")
    .max(1500, "Maximum amount is ₪1500")
    .nullable()
    .optional(),
});

export type CibusSettingsFormData = z.infer<typeof cibusSettingsSchema>;
