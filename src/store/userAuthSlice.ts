// User Auth Slice - Redux state management for user authentication
// Handles magic link authentication and session management
// CRITICAL: All API calls through Redux, types match backend

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from './userSlice';

const API_URL = import.meta.env.VITE_API_URL;

// Session token storage key
const SESSION_TOKEN_KEY = 'csr26_session_token';

// Auth state interface
interface UserAuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  sessionToken: string | null;
  loading: boolean;
  error: string | null;
  magicLinkSent: boolean;
}

const initialState: UserAuthState = {
  isAuthenticated: false,
  currentUser: null,
  sessionToken: null,
  loading: false,
  error: null,
  magicLinkSent: false,
};

// Helper functions for session token storage
const saveSessionToken = (token: string) => {
  try {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    console.log('💾 Session token saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save session token:', error);
  }
};

const getSessionToken = (): string | null => {
  try {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    console.log('📖 Loading session token from localStorage:', token ? 'Found' : 'Not found');
    return token;
  } catch (error) {
    console.error('❌ Failed to load session token:', error);
    return null;
  }
};

const clearSessionToken = () => {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    // Also clear old userId-based storage
    localStorage.removeItem('csr26_current_user_id');
    console.log('🗑️ Session token cleared from localStorage');
  } catch (error) {
    console.error('❌ Failed to clear session token:', error);
  }
};

// Async thunks for API calls

/**
 * Request magic link to be sent to email
 */
export const requestMagicLink = createAsyncThunk(
  'userAuth/requestMagicLink',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/request-magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to send magic link');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

/**
 * Verify magic link token and create session
 */
export const verifyMagicLink = createAsyncThunk(
  'userAuth/verifyMagicLink',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Invalid or expired magic link');
      }

      return data.data; // { sessionToken, user }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

/**
 * Verify existing session token
 */
export const verifySession = createAsyncThunk(
  'userAuth/verifySession',
  async (_, { rejectWithValue }) => {
    try {
      const token = getSessionToken();

      if (!token) {
        return rejectWithValue('No session token found');
      }

      const response = await fetch(`${API_URL}/auth/verify-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        clearSessionToken();
        return rejectWithValue(data.error || 'Session expired');
      }

      return data.data; // { user }
    } catch (error: any) {
      clearSessionToken();
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

/**
 * Logout user
 */
export const logoutUser = createAsyncThunk('userAuth/logout', async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Continue with logout even if API call fails
  }

  clearSessionToken();
  return null;
});

/**
 * DEVELOPMENT ONLY: Login with email directly (bypass magic link)
 */
export const devLogin = createAsyncThunk(
  'userAuth/devLogin',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/dev-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Dev login failed');
      }

      const result = await response.json();
      console.log('✅ Dev login successful:', result.data.user.email);
      return result.data; // { user, sessionToken }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// User Auth slice
const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    // Set current user (used when registering)
    setAuthenticatedUser: (state, action: PayloadAction<User>) => {
      console.log('✅ setAuthenticatedUser - User set:', action.payload);
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    // Clear magic link sent flag
    clearMagicLinkSent: (state) => {
      state.magicLinkSent = false;
    },
    // Clear auth error
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Request magic link
    builder
      .addCase(requestMagicLink.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.magicLinkSent = false;
      })
      .addCase(requestMagicLink.fulfilled, (state) => {
        console.log('✅ Magic link request sent');
        state.loading = false;
        state.magicLinkSent = true;
      })
      .addCase(requestMagicLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Verify magic link
    builder
      .addCase(verifyMagicLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMagicLink.fulfilled, (state, action) => {
        console.log('✅ Magic link verified - User logged in:', action.payload.user);
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.sessionToken = action.payload.sessionToken;
        saveSessionToken(action.payload.sessionToken);
      })
      .addCase(verifyMagicLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Verify session
    builder
      .addCase(verifySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        console.log('✅ Session verified - User logged in:', action.payload.user);
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.sessionToken = getSessionToken();
      })
      .addCase(verifySession.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.currentUser = null;
        state.sessionToken = null;
        state.error = action.payload as string;
      });

    // Dev Login (DEVELOPMENT ONLY)
    builder
      .addCase(devLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(devLogin.fulfilled, (state, action) => {
        console.log('✅ Dev login successful - User logged in:', action.payload.user);
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.sessionToken = action.payload.sessionToken;
        saveSessionToken(action.payload.sessionToken);
      })
      .addCase(devLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.log('✅ User logged out');
        state.loading = false;
        state.isAuthenticated = false;
        state.currentUser = null;
        state.sessionToken = null;
        state.error = null;
        state.magicLinkSent = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Logout locally even if API call fails
        state.loading = false;
        state.isAuthenticated = false;
        state.currentUser = null;
        state.sessionToken = null;
        state.error = null;
        state.magicLinkSent = false;
      });
  },
});

export const { setAuthenticatedUser, clearMagicLinkSent, clearAuthError } = userAuthSlice.actions;
export default userAuthSlice.reducer;
