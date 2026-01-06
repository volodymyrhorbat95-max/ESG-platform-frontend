// Auth Slice - Redux state management for Admin Authentication
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

// Type definitions
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  role: string | null;
  error: string | null;
}

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    role: string;
  };
  error?: string;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  token: localStorage.getItem('csr26_admin_token'),
  role: localStorage.getItem('csr26_admin_role'),
  error: null,
};

// Async thunk: Admin login with secret code
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data: LoginResponse = await response.json();

      if (!data.success || !data.data) {
        return rejectWithValue(data.error || 'Login failed');
      }

      // Store token and role in localStorage
      localStorage.setItem('csr26_admin_token', data.data.token);
      localStorage.setItem('csr26_admin_role', data.data.role);

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

// Async thunk: Verify admin token
export const verifyAdminToken = createAsyncThunk(
  'auth/verifyAdminToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`${API_URL}/admin/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error || 'Token verification failed');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
      state.error = null;
      localStorage.removeItem('csr26_admin_token');
      localStorage.removeItem('csr26_admin_role');
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login admin
    builder.addCase(loginAdmin.fulfilled, (state, action: PayloadAction<{ token: string; role: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.error = null;
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
      state.error = action.payload as string;
    });

    // Verify token
    builder.addCase(verifyAdminToken.fulfilled, (state) => {
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(verifyAdminToken.rejected, (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
      state.error = 'Session expired';
      localStorage.removeItem('csr26_admin_token');
      localStorage.removeItem('csr26_admin_role');
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
