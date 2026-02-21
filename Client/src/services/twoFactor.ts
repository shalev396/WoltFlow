import { api } from "@/api/api";
import type {
  ApiSuccessResponse,
  Start2FARequestBody,
  Start2FAResponseData,
  Verify2FARequestBody,
  Verify2FAResponseData,
} from "@/types";

export const twoFactorService = {
  async start2FA(
    request: Start2FARequestBody,
  ): Promise<Start2FAResponseData> {
    const response = await api.post<
      ApiSuccessResponse<Start2FAResponseData>
    >("/user/settings/notification/2fa/start", request);
    return response.data.data;
  },

  async verify2FA(
    request: Verify2FARequestBody,
  ): Promise<Verify2FAResponseData> {
    const response = await api.post<
      ApiSuccessResponse<Verify2FAResponseData>
    >("/user/settings/notification/2fa/verify", request);
    return response.data.data;
  },
};
