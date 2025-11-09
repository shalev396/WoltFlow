import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  exp: number;
  iat: number;
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
 * Refresh tokens using Cognito refresh token
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

    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    const cognitoClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const region = import.meta.env.VITE_AWS_REGION;

    if (!cognitoDomain || !cognitoClientId) {
      console.error("Missing Cognito configuration");
      return null;
    }

    // Call Cognito token endpoint using domain (not issuer URL)
    const tokenEndpoint = `https://${cognitoDomain}.auth.${region}.amazoncognito.com/oauth2/token`;

    const response = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: cognitoClientId,
        refresh_token: refreshToken,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { id_token, access_token } = response.data;

    if (!id_token) {
      console.error("No ID token received from token refresh");
      return null;
    }

    // Store new tokens
    localStorage.setItem("idToken", id_token);
    if (access_token) {
      localStorage.setItem("accessToken", access_token);
    }

    console.log("✅ Tokens refreshed successfully");
    return { idToken: id_token, accessToken: access_token };
  } catch (error) {
    console.error("Failed to refresh tokens:", error);
    // Clear invalid tokens
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
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
