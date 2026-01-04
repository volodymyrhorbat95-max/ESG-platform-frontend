// SKU Slice - Redux state management for SKUs
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Type definitions (matching backend/database schema)
interface SKU {
  id: string;
  code: string;
  name: string;
  gramsWeight: number;
  price: number;
  paymentMode: 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION';
  requiresValidation: boolean;
  amplivoThreshold: number;
  impactMultiplier: number;
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
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Async thunks for API calls
export const fetchSKUs = createAsyncThunk('skus/fetchAll', async () => {
  const response = await fetch(`${API_URL}/admin/skus`);
  if (!response.ok) throw new Error('Failed to fetch SKUs');
  const data = await response.json();
  return data.data;
});

export const fetchSKUByCode = createAsyncThunk(
  'skus/fetchByCode',
  async (code: string) => {
    const response = await fetch(`${API_URL}/impact?code=${code}`);
    if (!response.ok) throw new Error('Failed to fetch SKU');
    const data = await response.json();
    return data.data;
  }
);

export const createSKU = createAsyncThunk(
  'skus/create',
  async (skuData: Partial<SKU>) => {
    const response = await fetch(`${API_URL}/admin/skus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
  });
  if (!response.ok) throw new Error('Failed to delete SKU');
  return id;
});

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
  },
});

export const { clearCurrentSKU, clearError } = skuSlice.actions;
export default skuSlice.reducer;
