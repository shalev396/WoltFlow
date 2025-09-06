// ============================================================================
// RUN & SCREENSHOT TYPES
// ============================================================================
// Types related to automation runs and their screenshots

export interface Run {
  id: string; // UUID
  userId: string;
  status: "started" | "in_progress" | "completed" | "failed";
  stage:
    | "triggered"
    | "refreshing_tokens"
    | "buying_gift"
    | "getting_code_from_email"
    | "applying_gift"
    | "completed";
  automationMode: "full-run" | "buy-only" | "cross-account";
  amount: number | null; // Gift card amount for this run
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Screenshot {
  id: string; // UUID
  runId: string;
  screenshotType: "error" | "success" | "step" | "debug" | "final";
  stage: string | null;
  siteUrl: string | null; // URL of the site where screenshot was taken
  screenshotUrl: string; // S3 URL for the screenshot image
  isError: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RunWithScreenshots extends Run {
  screenshots?: Screenshot[];
}

export interface RunFilters {
  status?: "started" | "in_progress" | "completed" | "failed";
  stage?:
    | "triggered"
    | "refreshing_tokens"
    | "buying_gift"
    | "getting_code_from_email"
    | "applying_gift"
    | "completed";
  automationMode?: "full-run" | "buy-only" | "cross-account";
}

export interface RunsPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface RunsResponse {
  runs: RunWithScreenshots[];
  pagination: RunsPaginationInfo;
  filters: {
    status: string | null;
    stage: string | null;
    automationMode: string | null;
  };
}
