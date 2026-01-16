// User Slice - Redux state management for Users
// Supports 3 registration levels: minimal (email only), standard (email+name), full (all fields)
// CRITICAL: Types must match backend/database schema

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { env } from '../config/env';

const API_URL = env.apiUrl;

// Registration level type
export type RegistrationLevel = 'minimal' | 'standard' | 'full';

// User type matching backend model
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  state?: string;
  registrationLevel: RegistrationLevel;
  corsairConnectFlag: boolean;
  termsAcceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Input types for different registration levels
// Section 3.1: Minimal Registration - email required, name optional
export interface MinimalRegistrationInput {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface StandardRegistrationInput {
  email: string;
  firstName: string;
  lastName: string;
  termsAccepted: boolean;
}

export interface FullRegistrationInput {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
  termsAccepted: boolean;
}

// Generic registration input (used by transaction creation)
export interface RegistrationInput {
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  state?: string;
  termsAccepted: boolean;
}

interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  state?: string;
}

// Section 9.4: Wallet adjustment types
export interface WalletAdjustment {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  adjustedBy: string;
  adjustedAt: string;
}

interface UserState {
  currentUser: User | null;
  users: User[];
  walletAdjustments: WalletAdjustment[]; // Section 9.4: Adjustment history for currently viewed user
  loading: boolean;
  adjustmentLoading: boolean; // Section 9.4: Separate loading for adjustments
  error: string | null;
}

// LocalStorage helpers for persisting user session
const STORAGE_KEY = 'csr26_current_user_id';

const saveUserIdToStorage = (userId: string) => {
  try {
    console.log('💾 Saving userId to localStorage:', userId);
    localStorage.setItem(STORAGE_KEY, userId);
    console.log('✅ Saved to localStorage successfully');
  } catch (error) {
    console.error('❌ Failed to save userId to localStorage:', error);
  }
};

const clearUserIdFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear userId from localStorage:', error);
  }
};

const initialState: UserState = {
  currentUser: null,
  users: [],
  walletAdjustments: [],
  loading: false,
  adjustmentLoading: false,
  error: null,
};

// Async thunks

// Register minimal user (email only) - for CLAIM type
export const registerMinimalUser = createAsyncThunk(
  'users/registerMinimal',
  async (data: MinimalRegistrationInput, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/register/minimal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to register user');
      }
      const result = await response.json();
      // Backend now returns { user, sessionToken }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Register standard user (email + name) - for small transactions under threshold
export const registerStandardUser = createAsyncThunk(
  'users/registerStandard',
  async (data: StandardRegistrationInput, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/register/standard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to register user');
      }
      const result = await response.json();
      // Backend now returns { user, sessionToken }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Register full user (all fields) - for 10+ euro transactions
export const registerFullUser = createAsyncThunk(
  'users/registerFull',
  async (data: FullRegistrationInput, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/register/full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to register user');
      }
      const result = await response.json();
      // Backend now returns { user, sessionToken }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Generic register user (auto-determines level based on data provided)
export const registerUser = createAsyncThunk(
  'users/register',
  async (data: RegistrationInput, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to register user');
      }
      const result = await response.json();
      // Backend now returns { user, sessionToken }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch user');
      }
      const result = await response.json();
      return result.data as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to get auth headers for admin routes
const getAdminAuthHeaders = () => {
  const token = localStorage.getItem('csr26_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Fetch user by email (admin only - requires auth)
export const fetchUserByEmail = createAsyncThunk(
  'users/fetchByEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/email/${encodeURIComponent(email)}`, {
        headers: getAdminAuthHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'User not found');
      }
      const result = await response.json();
      return result.data as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all users (admin only - requires auth)
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getAdminAuthHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch users');
      }
      const result = await response.json();
      return result.data as User[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user profile (user self-update - no auth required)
export const updateUserSelf = createAsyncThunk(
  'users/updateSelf',
  async ({ id, updates }: { id: string; updates: UpdateUserInput }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}/self`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to update user');
      }
      const result = await response.json();
      return result.data as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user profile (admin only)
export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, updates }: { id: string; updates: UpdateUserInput }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to update user');
      }
      const result = await response.json();
      return result.data as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete user (soft delete - admin only)
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to delete user');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Export user data (GDPR)
export const exportUserData = createAsyncThunk(
  'users/export',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}/export`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to export user data');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user_data_${id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Section 9.4: Adjust user wallet (admin only)
export const adjustUserWallet = createAsyncThunk(
  'users/adjustWallet',
  async ({ userId, amount, reason }: { userId: string; amount: number; reason: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/wallet/adjust`, {
        method: 'POST',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ amount, reason }),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to adjust wallet');
      }
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Section 9.4: Fetch wallet adjustment history (admin only)
export const fetchWalletAdjustments = createAsyncThunk(
  'users/fetchWalletAdjustments',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/wallet/adjustments`, {
        headers: getAdminAuthHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch wallet adjustments');
      }
      const result = await response.json();
      return result.data as WalletAdjustment[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register minimal user
    builder
      .addCase(registerMinimalUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerMinimalUser.fulfilled, (state, action) => {
        const { user, sessionToken } = action.payload;
        console.log('✅ registerMinimalUser.fulfilled - Setting currentUser:', user);
        console.log('💾 Session token received, saving to localStorage');
        state.loading = false;
        state.currentUser = user;
        saveUserIdToStorage(user.id);
        // Save session token to localStorage (handled by userAuthSlice)
        if (sessionToken) {
          localStorage.setItem('csr26_session_token', sessionToken);
        }
      })
      .addCase(registerMinimalUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register standard user
    builder
      .addCase(registerStandardUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStandardUser.fulfilled, (state, action) => {
        const { user, sessionToken } = action.payload;
        console.log('✅ registerStandardUser.fulfilled - Setting currentUser:', user);
        console.log('💾 Session token received, saving to localStorage');
        state.loading = false;
        state.currentUser = user;
        saveUserIdToStorage(user.id);
        // Save session token to localStorage
        if (sessionToken) {
          localStorage.setItem('csr26_session_token', sessionToken);
        }
      })
      .addCase(registerStandardUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register full user
    builder
      .addCase(registerFullUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerFullUser.fulfilled, (state, action) => {
        const { user, sessionToken } = action.payload;
        console.log('✅ registerFullUser.fulfilled - Setting currentUser:', user);
        console.log('💾 Session token received, saving to localStorage');
        state.loading = false;
        state.currentUser = user;
        saveUserIdToStorage(user.id);
        // Save session token to localStorage
        if (sessionToken) {
          localStorage.setItem('csr26_session_token', sessionToken);
        }
      })
      .addCase(registerFullUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register user (generic)
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // Backend returns { user, sessionToken }
        const { user, sessionToken } = action.payload;
        console.log('✅ registerUser.fulfilled - Setting currentUser:', user);
        console.log('💾 Session token received, saving to localStorage');
        state.loading = false;
        state.currentUser = user;
        saveUserIdToStorage(user.id);
        // Save session token to localStorage for auto-login
        if (sessionToken) {
          localStorage.setItem('csr26_session_token', sessionToken);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        console.log('✅ fetchUserById.fulfilled - Setting currentUser:', action.payload);
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch user by email
    builder
      .addCase(fetchUserByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch all users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user self
    builder
      .addCase(updateUserSelf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserSelf.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUserSelf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user (admin)
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Export user data
    builder
      .addCase(exportUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportUserData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Section 9.4: Adjust user wallet
    builder
      .addCase(adjustUserWallet.pending, (state) => {
        state.adjustmentLoading = true;
        state.error = null;
      })
      .addCase(adjustUserWallet.fulfilled, (state) => {
        state.adjustmentLoading = false;
      })
      .addCase(adjustUserWallet.rejected, (state, action) => {
        state.adjustmentLoading = false;
        state.error = action.payload as string;
      });

    // Section 9.4: Fetch wallet adjustments
    builder
      .addCase(fetchWalletAdjustments.pending, (state) => {
        state.adjustmentLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletAdjustments.fulfilled, (state, action: PayloadAction<WalletAdjustment[]>) => {
        state.adjustmentLoading = false;
        state.walletAdjustments = action.payload;
      })
      .addCase(fetchWalletAdjustments.rejected, (state, action) => {
        state.adjustmentLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export helper function for logout
export const logoutUser = () => {
  clearUserIdFromStorage();
};

export const { setCurrentUser, clearCurrentUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;
