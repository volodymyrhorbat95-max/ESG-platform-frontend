// Config Slice - Redux state management for global configuration
// CRITICAL: All data through Redux - NO direct API calls from components

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

// Types matching backend GlobalConfig model
interface GlobalConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ConfigState {
  currentCSRPrice: number | null; // Cached for frontend calculations
  configs: GlobalConfig[];
  loading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  currentCSRPrice: null,
  configs: [],
  loading: false,
  error: null,
};

// Thunk: Fetch CURRENT_CSR_PRICE (most frequently used)
export const fetchCurrentCSRPrice = createAsyncThunk(
  'config/fetchCurrentCSRPrice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/config/CURRENT_CSR_PRICE`);
      if (!response.ok) {
        throw new Error('Failed to fetch CURRENT_CSR_PRICE');
      }
      const data = await response.json();
      return parseFloat(data.data.value);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk: Fetch all config entries (admin only)
export const fetchAllConfigs = createAsyncThunk(
  'config/fetchAll',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/config`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch configs');
      }
      const data = await response.json();
      return data.data as GlobalConfig[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk: Update config value (admin only)
export const updateConfigValue = createAsyncThunk(
  'config/updateValue',
  async (
    { key, value, description, token }: { key: string; value: string; description?: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/config/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value, description }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update config');
      }
      const data = await response.json();
      return data.data as GlobalConfig;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    clearConfigError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch CURRENT_CSR_PRICE
    builder
      .addCase(fetchCurrentCSRPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentCSRPrice.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.currentCSRPrice = action.payload;
      })
      .addCase(fetchCurrentCSRPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch all configs
    builder
      .addCase(fetchAllConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllConfigs.fulfilled, (state, action: PayloadAction<GlobalConfig[]>) => {
        state.loading = false;
        state.configs = action.payload;
        // Update currentCSRPrice if present
        const csrPriceConfig = action.payload.find((c) => c.key === 'CURRENT_CSR_PRICE');
        if (csrPriceConfig) {
          state.currentCSRPrice = parseFloat(csrPriceConfig.value);
        }
      })
      .addCase(fetchAllConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update config value
    builder
      .addCase(updateConfigValue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConfigValue.fulfilled, (state, action: PayloadAction<GlobalConfig>) => {
        state.loading = false;
        // Update in configs array
        const index = state.configs.findIndex((c) => c.key === action.payload.key);
        if (index !== -1) {
          state.configs[index] = action.payload;
        } else {
          state.configs.push(action.payload);
        }
        // Update currentCSRPrice if it's the one that was updated
        if (action.payload.key === 'CURRENT_CSR_PRICE') {
          state.currentCSRPrice = parseFloat(action.payload.value);
        }
      })
      .addCase(updateConfigValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearConfigError } = configSlice.actions;
export default configSlice.reducer;
