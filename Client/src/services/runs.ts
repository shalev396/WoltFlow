import { api } from "@/api/api";
import type {
  ApiSuccessResponse,
  RunsResponseData,
  RunFilters,
} from "@/types";

export const runsService = {
  async getRuns(
    page: number = 1,
    limit: number = 10,
    filters?: RunFilters,
  ): Promise<RunsResponseData> {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters?.status) params.append("status", filters.status);
    if (filters?.stage) params.append("stage", filters.stage);

    const response = await api.get<ApiSuccessResponse<RunsResponseData>>(
      `/user/runs?${params.toString()}`,
    );
    return response.data.data;
  },

  async getRecentRuns(
    limit: number = 5,
  ): Promise<RunsResponseData["runs"]> {
    const response = await this.getRuns(1, limit);
    return response.runs;
  },
};
