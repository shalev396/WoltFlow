import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types";

/**
 * Extracts a human-readable error message from any caught error.
 * Prioritises the backend's `message` field (from ApiErrorResponse),
 * then falls back to the Axios message, and finally a generic fallback.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred",
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) return data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
