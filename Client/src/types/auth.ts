// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================
// Types related to user authentication and Google OAuth

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

// User model - matches backend User schema
export interface User {
  id: string; // UUID primary key
  googleId: string; // Google sub (unique external ID)
  googleRefreshToken: string; // Google refresh token
  name: string | null; // User's display name
  email: string | null; // User's email address
  apiKey: string | null; // API key for SMS forwarding and external access
  lastLoginAt: Date | null; // Last login timestamp
  createdAt: Date;
  updatedAt: Date;
}
