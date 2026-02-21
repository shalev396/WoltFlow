// API Response envelope types
// Enforced by the responseFormatter middleware (Server/src/middlewares/responseFormatter.ts)
// Imported by the frontend for type-safe response unwrapping

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
