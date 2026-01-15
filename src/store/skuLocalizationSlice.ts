// SKU Localization Slice - Redux state management for multi-market SKU support
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { env } from '../config/env';
import type { PayloadAction } from '@reduxjs/toolkit';

// Type definitions (matching backend/database schema)
interface SKULocalization {
  id: string;
  skuId: string;
  locale: string;
  localizedName: string;
  localizedDescription: string | null;
  localizedTerminology: string | null;
  currency: string;
  localizedPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SKULocalizationState {
  items: SKULocalization[];
  availableLocales: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SKULocalizationState = {
  items: [],
  availableLocales: [],
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
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Async thunks for API calls
export const fetchSKULocalizations = createAsyncThunk(
  'skuLocalizations/fetchBySKU',
  async (skuId: string) => {
    const response = await fetch(`${API_URL}/admin/skus/${skuId}/localizations`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch localizations');
    const data = await response.json();
    return data.data;
  }
);

export const fetchAvailableLocales = createAsyncThunk(
  'skuLocalizations/fetchLocales',
  async () => {
    const response = await fetch(`${API_URL}/admin/locales`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch available locales');
    const data = await response.json();
    return data.data;
  }
);

export const createSKULocalization = createAsyncThunk(
  'skuLocalizations/create',
  async ({
    skuId,
    localization,
  }: {
    skuId: string;
    localization: {
      locale: string;
      localizedName: string;
      localizedDescription?: string;
      localizedTerminology?: string;
      currency: string;
      localizedPrice: number;
    };
  }) => {
    const response = await fetch(`${API_URL}/admin/skus/${skuId}/localizations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(localization),
    });
    if (!response.ok) throw new Error('Failed to create localization');
    const data = await response.json();
    return data.data;
  }
);

export const updateSKULocalization = createAsyncThunk(
  'skuLocalizations/update',
  async ({
    id,
    updates,
  }: {
    id: string;
    updates: Partial<SKULocalization>;
  }) => {
    const response = await fetch(`${API_URL}/admin/localizations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update localization');
    const data = await response.json();
    return data.data;
  }
);

export const deleteSKULocalization = createAsyncThunk(
  'skuLocalizations/delete',
  async (id: string) => {
    const response = await fetch(`${API_URL}/admin/localizations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete localization');
    return id;
  }
);

export const bulkCreateLocalizations = createAsyncThunk(
  'skuLocalizations/bulkCreate',
  async ({
    skuId,
    localizations,
  }: {
    skuId: string;
    localizations: Array<{
      locale: string;
      localizedName: string;
      localizedDescription?: string;
      localizedTerminology?: string;
      currency: string;
      localizedPrice: number;
    }>;
  }) => {
    const response = await fetch(`${API_URL}/admin/skus/${skuId}/localizations/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ localizations }),
    });
    if (!response.ok) throw new Error('Failed to bulk create localizations');
    const data = await response.json();
    return data.data;
  }
);

// Slice
const skuLocalizationSlice = createSlice({
  name: 'skuLocalizations',
  initialState,
  reducers: {
    clearLocalizations: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch localizations by SKU
    builder
      .addCase(fetchSKULocalizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSKULocalizations.fulfilled, (state, action: PayloadAction<SKULocalization[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSKULocalizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch localizations';
      });

    // Fetch available locales
    builder
      .addCase(fetchAvailableLocales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableLocales.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.availableLocales = action.payload;
      })
      .addCase(fetchAvailableLocales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch locales';
      });

    // Create localization
    builder
      .addCase(createSKULocalization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSKULocalization.fulfilled, (state, action: PayloadAction<SKULocalization>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createSKULocalization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create localization';
      });

    // Update localization
    builder
      .addCase(updateSKULocalization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSKULocalization.fulfilled, (state, action: PayloadAction<SKULocalization>) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateSKULocalization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update localization';
      });

    // Delete localization
    builder
      .addCase(deleteSKULocalization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSKULocalization.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteSKULocalization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete localization';
      });

    // Bulk create localizations
    builder
      .addCase(bulkCreateLocalizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateLocalizations.fulfilled, (state, action: PayloadAction<SKULocalization[]>) => {
        state.loading = false;
        state.items.push(...action.payload);
      })
      .addCase(bulkCreateLocalizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to bulk create localizations';
      });
  },
});

export const { clearLocalizations, clearError } = skuLocalizationSlice.actions;
export default skuLocalizationSlice.reducer;
