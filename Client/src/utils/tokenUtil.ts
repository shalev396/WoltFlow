import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  exp: number;
  iat: number;
}

interface CognitoRefreshTokenResponse {
  idToken: string;
  accessToken: string;
  expiresIn: number;
}

/**
 * Decode JWT token to get user info
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Check if token is expired or will expire soon (within 5 minutes)
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = 5 * 60; // 5 minutes buffer
  return decoded.exp - currentTime < bufferTime;
};

/**
 * Refresh tokens using backend API (which calls Cognito InitiateAuth)
 */
export const refreshTokens = async (): Promise<{
  idToken: string;
  accessToken: string;
} | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token available");
      return null;
    }

    console.log("🔄 Refreshing tokens via backend API...");

    // Determine API endpoint based on environment
    const isLocal = import.meta.env.VITE_ENV === "local";
    const baseURL = isLocal
      ? "http://localhost:3000/api"
      : `${window.location.origin}/api`;

    // Call our backend refresh endpoint
    const response = await axios.post<{
      success: boolean;
      data?: CognitoRefreshTokenResponse;
      message?: string;
    }>(
      `${baseURL}/auth/refresh`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.data.success || !response.data.data) {
      console.error("❌ Token refresh failed:", response.data.message);
      return null;
    }

    const { idToken, accessToken } = response.data.data;

    if (!idToken) {
      console.error("❌ No ID token received from token refresh");
      return null;
    }

    // Store new tokens
    localStorage.setItem("idToken", idToken);
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    console.log("✅ Tokens refreshed successfully");
    return { idToken, accessToken };
  } catch (error) {
    console.error("❌ Failed to refresh tokens:", error);

    // Only clear tokens if it's a 401 or explicit auth error
    // Don't clear on network errors (user might be offline)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("❌ Refresh token expired or invalid - clearing tokens");
      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
    }

    return null;
  }
};

/**
 * Get user info from stored token
 */
export const getUserFromToken = () => {
  const token = localStorage.getItem("idToken");
  if (!token) {
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }

  return {
    id: decoded.sub,
    email: decoded.email || "",
    name: decoded.name || "",
  };
};
