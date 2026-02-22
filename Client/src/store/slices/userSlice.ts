import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { AppUser } from "@/types";
import { getUserFromToken } from "@/utils/tokenUtil";

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Async thunk for checking authentication status
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Get user from stored token instead of API call
      const user = getUserFromToken();
      if (!user) {
        return rejectWithValue("No valid token found");
      }
      return user;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.error || "Authentication failed"
        );
      }
      return rejectWithValue("Authentication failed");
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  // No server call needed - just clear local storage
  // Cognito sessions are stateless with JWTs
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
  return;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Manual login action (for when we get user data from login/callback)
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: AppUser;
        tokens: { idToken: string; refreshToken: string; expiresIn: number };
      }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;

      // Store tokens in localStorage
      localStorage.setItem("idToken", action.payload.tokens.idToken);
      localStorage.setItem("refreshToken", action.payload.tokens.refreshToken);
    },

    // Manual logout action
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;

      // Clear tokens from localStorage
      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Check auth cases
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.isInitialized = true;

        // Clear tokens from localStorage (already done in thunk, but ensure it)
        localStorage.removeItem("idToken");
        localStorage.removeItem("refreshToken");
      });
  },
});

export const { loginSuccess, logoutSuccess, clearError, setLoading } =
  userSlice.actions;
export default userSlice.reducer;
