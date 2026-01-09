// User Slice - Redux state management for Users
// Supports 3 registration levels: minimal (email only), standard (email+name), full (all fields)
// CRITICAL: Types must match backend/database schema

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

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
export interface MinimalRegistrationInput {
  email: string;
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

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
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
      return result.data as User;
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
      return result.data as User;
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
      return result.data as User;
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
      return result.data as User;
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
        state.loading = false;
        state.currentUser = action.payload;
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
        state.loading = false;
        state.currentUser = action.payload;
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
        state.loading = false;
        state.currentUser = action.payload;
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
        state.loading = false;
        state.currentUser = action.payload;
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
  },
});

export const { setCurrentUser, clearCurrentUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;
