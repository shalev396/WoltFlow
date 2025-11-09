import { api } from "@/api/api";
import type {
  CognitoUser,
  LoginCredentials,
  SignupCredentials,
  EmailVerification,
  ApiResponse,
} from "@/types";

export const authService = {
  // Logout
  async logout(): Promise<void> {
    // No server call needed - just clear localStorage
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
  },

  // Email/password signup
  async signup(
    credentials: SignupCredentials
  ): Promise<{ userSub: string; userConfirmed: boolean }> {
    const response = await api.post<
      ApiResponse<{ userSub: string; userConfirmed: boolean }>
    >("/auth/signup", credentials);
    return response.data.data!;
  },

  // Email verification
  async confirmSignup(verification: EmailVerification): Promise<void> {
    await api.post<ApiResponse>("/auth/confirm", verification);
  },

  // Email/password login
  async login(credentials: LoginCredentials): Promise<{
    user: CognitoUser;
    tokens: { idToken: string; refreshToken: string; expiresIn: number };
  }> {
    const response = await api.post<
      ApiResponse<{
        user: CognitoUser;
        tokens: { idToken: string; refreshToken: string; expiresIn: number };
      }>
    >("/auth/login", credentials);
    return response.data.data!;
  },

  // Forgot password - Request password reset code
  async forgotPassword(email: string): Promise<void> {
    await api.post<ApiResponse>("/auth/forgot-password", { email });
  },

  // Reset password - Confirm with code and new password
  async resetPassword(
    email: string,
    code: string,
    password: string
  ): Promise<void> {
    await api.post<ApiResponse>("/auth/reset-password", {
      email,
      code,
      password,
    });
  },
};
