import { api } from "@/api/api";
import type {
  ApiResponse,
  DashboardResponse,
  DashboardAnalytics,
  TimeRange,
} from "@/types/api";

export const dashboardService = {
  /**
   * Get dashboard analytics for the authenticated user
   */
  async getDashboardAnalytics(
    timeRange: TimeRange = "30d"
  ): Promise<DashboardAnalytics> {
    const response = await api.get<ApiResponse<DashboardResponse>>(
      `/user/dashboard?timeRange=${timeRange}`
    );
    return response.data.data!.analytics;
  },
};
