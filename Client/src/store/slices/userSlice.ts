import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { GoogleUser } from "@/types";

interface AuthState {
  user: GoogleUser | null;
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
      // Dynamic import to avoid circular dependency
      const { api } = await import("@/api/api");
      const response = await api.get<GoogleUser>("/auth/me");
      return response.data;
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
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Dynamic import to avoid circular dependency
      const { api } = await import("@/api/api");
      await api.post("/auth/logout");
      return;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // Even if logout fails on server, we should clear local state
        console.error("Logout failed:", error);
        return rejectWithValue(error.response?.data?.error || "Logout failed");
      }
      return rejectWithValue("Logout failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Manual login action (for when we get user data from OAuth callback)
    loginSuccess: (state, action: PayloadAction<GoogleUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;
    },

    // Manual logout action
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;
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
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if logout fails, clear local state
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      });
  },
});

export const { loginSuccess, logoutSuccess, clearError, setLoading } =
  userSlice.actions;
export default userSlice.reducer;
