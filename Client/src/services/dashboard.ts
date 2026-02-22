import { api } from "@/api/api";
import type {
  ApiSuccessResponse,
  DashboardResponseData,
  TimeRange,
} from "@/types";

export const dashboardService = {
  async getDashboardAnalytics(
    timeRange: TimeRange = "30d",
  ): Promise<DashboardResponseData["analytics"]> {
    const response = await api.get<ApiSuccessResponse<DashboardResponseData>>(
      `/user/dashboard?timeRange=${timeRange}`,
    );
    return response.data.data.analytics;
  },
};
