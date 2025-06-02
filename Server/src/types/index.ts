import { APIGatewayProxyEvent } from "aws-lambda";

export interface User {
  id?: number;
  email: string;
  password: string;
  in_notification: boolean;
  total_saved: number;
}

export interface Run {
  id?: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  status: "failed" | "in progress" | "success";
  amount: number;
  is_notify: boolean;
}

export interface Screenshot {
  id?: number;
  run_id: number;
  url: string;
  is_error: boolean;
}

export interface TokenPayload {
  userId: number;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, "password">;
}

export interface CustomRequest extends Omit<APIGatewayProxyEvent, "body"> {
  user?: TokenPayload;
  body: string | null;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
}
