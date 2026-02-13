import { z } from "zod";

export const runSettingsSchema = z.object({
  automationEnabled: z.boolean(),
  automationMode: z.enum(["full-run", "buy-only", "cross-account"]),
  giftAmount: z.number().min(20).max(1500).nullable().optional(),
});

export type RunSettingsFormData = z.infer<typeof runSettingsSchema>;
