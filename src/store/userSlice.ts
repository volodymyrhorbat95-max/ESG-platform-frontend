// User Slice - Redux state management for Users
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Type definitions (matching backend/database schema)
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  termsAcceptedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  termsAccepted: boolean;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Async thunks
export const registerUser = createAsyncThunk(
  'users/register',
  async (userData: RegisterUserData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register user');
    }
    const data = await response.json();
    return data.data;
  }
);

export const fetchUserById = createAsyncThunk('users/fetchById', async (id: string) => {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  const data = await response.json();
  return data.data;
});

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  const data = await response.json();
  return data.data;
});

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, updates }: { id: string; updates: UpdateUserData }) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }
    const data = await response.json();
    return data.data;
  }
);

export const deleteUser = createAsyncThunk('users/delete', async (id: string) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete user');
  }
  return id;
});

export const exportUserData = createAsyncThunk('users/export', async (id: string) => {
  const response = await fetch(`${API_URL}/users/${id}/export`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to export user data');
  }

  // Get the JSON blob
  const blob = await response.blob();

  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `user_data_${id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return { success: true };
});

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register user';
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });

    // Fetch all users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
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
        state.error = action.error.message || 'Failed to delete user';
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
        state.error = action.error.message || 'Failed to export user data';
      });
  },
});

export const { clearCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;
