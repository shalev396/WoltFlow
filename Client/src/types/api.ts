// ============================================================================
// API RESPONSE TYPES
// ============================================================================
// Core types for API communication

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
}
