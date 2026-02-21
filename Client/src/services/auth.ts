import { api } from "@/api/api";
import type {
  ApiSuccessResponse,
  SignupRequestBody,
  SignupResponseData,
  ConfirmSignupRequestBody,
  LoginRequestBody,
  LoginResponseData,
  ForgotPasswordRequestBody,
  ResetPasswordRequestBody,
} from "@/types";

export const authService = {
  async logout(): Promise<void> {
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
  },

  async signup(
    credentials: SignupRequestBody,
  ): Promise<SignupResponseData> {
    const response = await api.post<ApiSuccessResponse<SignupResponseData>>(
      "/auth/signup",
      credentials,
    );
    return response.data.data;
  },

  async confirmSignup(verification: ConfirmSignupRequestBody): Promise<void> {
    await api.post("/auth/confirm", verification);
  },

  async login(credentials: LoginRequestBody): Promise<LoginResponseData> {
    const response = await api.post<ApiSuccessResponse<LoginResponseData>>(
      "/auth/login",
      credentials,
    );
    return response.data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    const body: ForgotPasswordRequestBody = { email };
    await api.post("/auth/forgot-password", body);
  },

  async resetPassword(
    email: string,
    code: string,
    password: string,
  ): Promise<void> {
    const body: ResetPasswordRequestBody = { email, code, password };
    await api.post("/auth/reset-password", body);
  },
};
