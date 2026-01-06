// Merchant Slice - Redux state management for Merchants
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Type definitions (matching backend/database schema)
interface Merchant {
  id: string;
  name: string;
  email: string;
  stripeAccountId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MerchantState {
  items: Merchant[];
  currentMerchant: Merchant | null;
  loading: boolean;
  error: string | null;
}

const initialState: MerchantState = {
  items: [],
  currentMerchant: null,
  loading: false,
  error: null,
};

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('csr26_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Async thunks for API calls
export const fetchMerchants = createAsyncThunk('merchants/fetchAll', async () => {
  const response = await fetch(`${API_URL}/admin/merchants`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch merchants');
  const data = await response.json();
  return data.data;
});

export const fetchMerchantById = createAsyncThunk(
  'merchants/fetchById',
  async (id: string) => {
    const response = await fetch(`${API_URL}/merchants/${id}`);
    if (!response.ok) throw new Error('Failed to fetch merchant');
    const data = await response.json();
    return data.data;
  }
);

export const createMerchant = createAsyncThunk(
  'merchants/create',
  async (merchantData: Partial<Merchant>) => {
    const response = await fetch(`${API_URL}/admin/merchants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(merchantData),
    });
    if (!response.ok) throw new Error('Failed to create merchant');
    const data = await response.json();
    return data.data;
  }
);

export const updateMerchant = createAsyncThunk(
  'merchants/update',
  async ({ id, updates }: { id: string; updates: Partial<Merchant> }) => {
    const response = await fetch(`${API_URL}/admin/merchants/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update merchant');
    const data = await response.json();
    return data.data;
  }
);

export const deleteMerchant = createAsyncThunk('merchants/delete', async (id: string) => {
  const response = await fetch(`${API_URL}/admin/merchants/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete merchant');
  return id;
});

// Slice
const merchantSlice = createSlice({
  name: 'merchants',
  initialState,
  reducers: {
    clearCurrentMerchant: (state) => {
      state.currentMerchant = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all merchants
    builder
      .addCase(fetchMerchants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchants.fulfilled, (state, action: PayloadAction<Merchant[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMerchants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch merchants';
      });

    // Fetch merchant by ID
    builder
      .addCase(fetchMerchantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchantById.fulfilled, (state, action: PayloadAction<Merchant>) => {
        state.loading = false;
        state.currentMerchant = action.payload;
      })
      .addCase(fetchMerchantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch merchant';
      });

    // Create merchant
    builder
      .addCase(createMerchant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMerchant.fulfilled, (state, action: PayloadAction<Merchant>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create merchant';
      });

    // Update merchant
    builder
      .addCase(updateMerchant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMerchant.fulfilled, (state, action: PayloadAction<Merchant>) => {
        state.loading = false;
        const index = state.items.findIndex((merchant) => merchant.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update merchant';
      });

    // Delete merchant
    builder
      .addCase(deleteMerchant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMerchant.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((merchant) => merchant.id !== action.payload);
      })
      .addCase(deleteMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete merchant';
      });
  },
});

export const { clearCurrentMerchant, clearError } = merchantSlice.actions;
export default merchantSlice.reducer;
