import { api } from "@/api/api";
import type {
  ApiResponse,
  Start2FARequest,
  Verify2FARequest,
  TwoFactorResponse,
} from "@/types";

export const twoFactorService = {
  // ============================================================================
  // TWO-FACTOR AUTHENTICATION
  // ============================================================================
  async start2FA(request: Start2FARequest): Promise<TwoFactorResponse> {
    const response = await api.post<ApiResponse<TwoFactorResponse>>(
      "/settings/notification/2fa/start",
      request
    );
    return response.data.data!;
  },

  async verify2FA(request: Verify2FARequest): Promise<TwoFactorResponse> {
    const response = await api.post<ApiResponse<TwoFactorResponse>>(
      "/settings/notification/2fa/verify",
      request
    );
    return response.data.data!;
  },
};
