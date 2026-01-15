// SKU Slice - Redux state management for SKUs
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { env } from '../config/env';

// Type definitions (matching backend/database schema)
// CRITICAL: gramsWeight removed - impact calculated dynamically using CURRENT_CSR_PRICE
// CRITICAL: amplivoThreshold renamed to corsairThreshold
// Section 5.1: Added productWeight and description fields
interface SKU {
  id: string;
  code: string;
  name: string;
  price: number;
  paymentMode: 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION';
  requiresValidation: boolean;
  corsairThreshold: number;
  impactMultiplier: number;
  productWeight?: number; // Section 5.1: Actual grams for physical products
  description?: string; // Section 5.1: Merchant-facing description
  partnerId?: string;
  merchantId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SKUState {
  items: SKU[];
  currentSKU: SKU | null;
  loading: boolean;
  error: string | null;
}

const initialState: SKUState = {
  items: [],
  currentSKU: null,
  loading: false,
  error: null,
};

// Get API URL from environment
const API_URL = env.apiUrl;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('csr26_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Async thunks for API calls
export const fetchSKUs = createAsyncThunk('skus/fetchAll', async () => {
  const response = await fetch(`${API_URL}/admin/skus`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch SKUs');
  const data = await response.json();
  return data.data;
});

// Fetch SKU by code (public endpoint for landing page)
export const fetchSKUByCode = createAsyncThunk(
  'skus/fetchByCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/skus/code/${code}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch SKU with code: ${code}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSKU = createAsyncThunk(
  'skus/create',
  async (skuData: Partial<SKU>) => {
    const response = await fetch(`${API_URL}/admin/skus`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skuData),
    });
    if (!response.ok) throw new Error('Failed to create SKU');
    const data = await response.json();
    return data.data;
  }
);

export const updateSKU = createAsyncThunk(
  'skus/update',
  async ({ id, updates }: { id: string; updates: Partial<SKU> }) => {
    const response = await fetch(`${API_URL}/admin/skus/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update SKU');
    const data = await response.json();
    return data.data;
  }
);

export const deleteSKU = createAsyncThunk('skus/delete', async (id: string) => {
  const response = await fetch(`${API_URL}/admin/skus/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete SKU');
  return id;
});

// Section 9.3: Toggle SKU active status
export const toggleSKUActive = createAsyncThunk(
  'skus/toggleActive',
  async ({ id, isActive }: { id: string; isActive: boolean }) => {
    const response = await fetch(`${API_URL}/admin/skus/${id}/toggle-active`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive }),
    });
    if (!response.ok) throw new Error('Failed to toggle SKU status');
    const data = await response.json();
    return data.data as SKU;
  }
);

// Slice
const skuSlice = createSlice({
  name: 'skus',
  initialState,
  reducers: {
    clearCurrentSKU: (state) => {
      state.currentSKU = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all SKUs
    builder
      .addCase(fetchSKUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSKUs.fulfilled, (state, action: PayloadAction<SKU[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSKUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch SKUs';
      });

    // Fetch SKU by code
    builder
      .addCase(fetchSKUByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSKUByCode.fulfilled, (state, action: PayloadAction<SKU>) => {
        state.loading = false;
        state.currentSKU = action.payload;
      })
      .addCase(fetchSKUByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch SKU';
      });

    // Create SKU
    builder
      .addCase(createSKU.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSKU.fulfilled, (state, action: PayloadAction<SKU>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createSKU.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create SKU';
      });

    // Update SKU
    builder
      .addCase(updateSKU.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSKU.fulfilled, (state, action: PayloadAction<SKU>) => {
        state.loading = false;
        const index = state.items.findIndex((sku) => sku.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateSKU.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update SKU';
      });

    // Delete SKU
    builder
      .addCase(deleteSKU.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSKU.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((sku) => sku.id !== action.payload);
      })
      .addCase(deleteSKU.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete SKU';
      });

    // Toggle SKU active status - Section 9.3
    builder
      .addCase(toggleSKUActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSKUActive.fulfilled, (state, action: PayloadAction<SKU>) => {
        state.loading = false;
        const index = state.items.findIndex((sku) => sku.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleSKUActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to toggle SKU status';
      });
  },
});

export const { clearCurrentSKU, clearError } = skuSlice.actions;
export default skuSlice.reducer;
