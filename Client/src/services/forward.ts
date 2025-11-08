import { api } from "@/api/api";
import type { ApiResponse, ApiKeyResponse } from "@/types";

export const forwardService = {
  // ============================================================================
  // API KEY GENERATION
  // ============================================================================
  async generateApiKey(): Promise<string> {
    const response = await api.post<ApiResponse<ApiKeyResponse>>(
      "/forward/api/generate"
    );
    return response.data.data!.apiKey;
  },
};
