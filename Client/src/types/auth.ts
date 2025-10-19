// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================
// Types related to user authentication and AWS Cognito

export interface CognitoUser {
  email: string;
  name: string;
}

// User model - matches backend User schema
export interface User {
  id: string; // UUID primary key
  cognitoSub: string; // Cognito sub (unique external ID)
  name: string | null; // User's display name
  email: string | null; // User's email address
  apiKey: string | null; // API key for SMS forwarding and external access
  lastLoginAt: Date | null; // Last login timestamp
  createdAt: Date;
  updatedAt: Date;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup credentials
export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

// Email verification
export interface EmailVerification {
  email: string;
  code: string;
}

// Auth API responses
export interface AuthResponse {
  user: CognitoUser;
}
