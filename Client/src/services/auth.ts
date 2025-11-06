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

  // Start Google OAuth flow
  startGoogleOAuth(): void {
    const cognitoHostedUIUrl = import.meta.env.VITE_COGNITO_HOSTED_UI_URL;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;

    const authUrl = `${cognitoHostedUIUrl}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&identity_provider=Google`;

    window.location.href = authUrl;
  },
};
