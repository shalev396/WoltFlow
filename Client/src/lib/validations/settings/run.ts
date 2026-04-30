import { z } from "zod";

export const runSettingsSchema = z.object({
  automationEnabled: z.boolean(),
  giftAmount: z
    .number()
    .int()
    .min(1, "Minimum 1 ₪")
    .max(1500, "Maximum 1500 ₪"),
});

export type RunSettingsFormData = z.infer<typeof runSettingsSchema>;
