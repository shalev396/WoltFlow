import { api } from "@/api/api";

export interface RunFilters {
  status?: "failed" | "in progress" | "success";
  stage?:
    | "triggered"
    | "refreshing tokens"
    | "buying gift"
    | "getting code from mail"
    | "applying gift"
    | "done";
  minAmount?: number;
  maxAmount?: number;
  isNotify?: boolean;
}

export interface RunsResponse {
  runs: RunWithScreenshots[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  filters: {
    status: string | null;
    stage: string | null;
    minAmount: number | null;
    maxAmount: number | null;
    isNotify: boolean | null;
  };
}

export interface Screenshot {
  id: number;
  url: string;
  is_error: boolean;
}

export interface RunWithScreenshots {
  id: number;
  status: "failed" | "in progress" | "success";
  stage:
    | "triggered"
    | "refreshing tokens"
    | "buying gift"
    | "getting code from mail"
    | "applying gift"
    | "done";
  amount: number;
  is_notify: boolean;
  created_at: string;
  updated_at: string;
  Screenshots?: Screenshot[];
}

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
    if (filters?.minAmount !== undefined)
      params.append("minAmount", filters.minAmount.toString());
    if (filters?.maxAmount !== undefined)
      params.append("maxAmount", filters.maxAmount.toString());
    if (filters?.isNotify !== undefined)
      params.append("isNotify", filters.isNotify.toString());

    const response = await api.get<RunsResponse>(`/runs?${params.toString()}`);
    return response.data;
  },

  async getRecentRuns(limit: number = 5): Promise<RunWithScreenshots[]> {
    const response = await this.getRuns(1, limit);
    return response.runs;
  },
};
