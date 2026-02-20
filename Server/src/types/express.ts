import { type Request } from "express";
/// <reference path="./express-extensions.d.ts" />

// JWT Token Types (from Cognito)
export interface CognitoJwtPayload {
  sub: string;
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: "access" | "refresh";
  scope?: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
  email?: string;
  name?: string;
}

// Extended Express Request with authenticated user
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    cognitoSub: string;
  };
}

// API Response envelope types (used by frontend for type-safe response unwrapping)
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
