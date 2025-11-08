import { z } from "zod";

export const woltSettingsSchema = z.object({
  woltRefreshToken: z
    .string()
    .min(1, "Refresh token is required")
    .nullable()
    .optional(),
  woltAccessToken: z
    .string()
    .min(1, "Access token is required")
    .nullable()
    .optional(),
});

export type WoltSettingsFormData = z.infer<typeof woltSettingsSchema>;
