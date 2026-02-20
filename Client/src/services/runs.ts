import { api } from "@/api/api";
import type {
  RunsResponse,
  RunFilters,
  RunWithScreenshots,
  ApiResponse,
} from "@/types";

export const runsService = {
  async getRuns(
    page: number = 1,
    limit: number = 10,
    filters?: RunFilters
  ): Promise<RunsResponse> {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters?.status) params.append("status", filters.status);
    if (filters?.stage) params.append("stage", filters.stage);
    if (filters?.automationMode)
      params.append("automationMode", filters.automationMode);

    const response = await api.get<ApiResponse<RunsResponse>>(
      `/user/runs?${params.toString()}`,
    );
    return response.data.data!;
  },

  async getRecentRuns(limit: number = 5): Promise<RunWithScreenshots[]> {
    const response = await this.getRuns(1, limit);
    return response.runs;
  },
};
