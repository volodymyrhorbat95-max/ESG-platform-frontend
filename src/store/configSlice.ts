// Config Slice - Redux state management for global configuration
// CRITICAL: All data through Redux - NO direct API calls from components

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { env } from '../config/env';

const API_URL = env.apiUrl;

// Types matching backend GlobalConfig model
interface GlobalConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Types matching backend ConfigAuditLog model
export interface ConfigAuditLog {
  id: string;
  configKey: string;
  oldValue: string | null;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

interface ConfigState {
  currentCSRPrice: number | null; // Cached for frontend calculations
  allocationMultiplier: number | null; // Cached for ALLOCATION mode impact calculations
  corsairThreshold: number | null; // Cached for threshold checks
  configs: GlobalConfig[];
  configHistory: ConfigAuditLog[]; // Audit log for currently viewed config
  loading: boolean;
  historyLoading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  currentCSRPrice: null,
  allocationMultiplier: null,
  corsairThreshold: null,
  configs: [],
  configHistory: [],
  loading: false,
  historyLoading: false,
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

// Thunk: Fetch ALLOCATION_MULTIPLIER (for ALLOCATION mode impact calculations)
export const fetchAllocationMultiplier = createAsyncThunk(
  'config/fetchAllocationMultiplier',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/config/ALLOCATION_MULTIPLIER`);
      if (!response.ok) {
        throw new Error('Failed to fetch ALLOCATION_MULTIPLIER');
      }
      const data = await response.json();
      return parseFloat(data.data.value);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk: Fetch CORSAIR_THRESHOLD (for threshold checks)
export const fetchCorsairThreshold = createAsyncThunk(
  'config/fetchCorsairThreshold',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/config/CORSAIR_THRESHOLD`);
      if (!response.ok) {
        throw new Error('Failed to fetch CORSAIR_THRESHOLD');
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

// Thunk: Fetch config change history (admin only)
export const fetchConfigHistory = createAsyncThunk(
  'config/fetchHistory',
  async ({ key, token }: { key: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/config/${key}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch config history');
      }
      const data = await response.json();
      return data.data as ConfigAuditLog[];
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

    // Fetch ALLOCATION_MULTIPLIER
    builder
      .addCase(fetchAllocationMultiplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllocationMultiplier.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.allocationMultiplier = action.payload;
      })
      .addCase(fetchAllocationMultiplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch CORSAIR_THRESHOLD
    builder
      .addCase(fetchCorsairThreshold.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCorsairThreshold.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.corsairThreshold = action.payload;
      })
      .addCase(fetchCorsairThreshold.rejected, (state, action) => {
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
        // Update cached config values if present
        const csrPriceConfig = action.payload.find((c) => c.key === 'CURRENT_CSR_PRICE');
        if (csrPriceConfig) {
          state.currentCSRPrice = parseFloat(csrPriceConfig.value);
        }
        const allocationMultiplierConfig = action.payload.find((c) => c.key === 'ALLOCATION_MULTIPLIER');
        if (allocationMultiplierConfig) {
          state.allocationMultiplier = parseFloat(allocationMultiplierConfig.value);
        }
        const corsairThresholdConfig = action.payload.find((c) => c.key === 'CORSAIR_THRESHOLD');
        if (corsairThresholdConfig) {
          state.corsairThreshold = parseFloat(corsairThresholdConfig.value);
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
        // Update cached values if they were updated
        if (action.payload.key === 'CURRENT_CSR_PRICE') {
          state.currentCSRPrice = parseFloat(action.payload.value);
        }
        if (action.payload.key === 'ALLOCATION_MULTIPLIER') {
          state.allocationMultiplier = parseFloat(action.payload.value);
        }
        if (action.payload.key === 'CORSAIR_THRESHOLD') {
          state.corsairThreshold = parseFloat(action.payload.value);
        }
      })
      .addCase(updateConfigValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch config history
    builder
      .addCase(fetchConfigHistory.pending, (state) => {
        state.historyLoading = true;
        state.error = null;
      })
      .addCase(fetchConfigHistory.fulfilled, (state, action: PayloadAction<ConfigAuditLog[]>) => {
        state.historyLoading = false;
        state.configHistory = action.payload;
      })
      .addCase(fetchConfigHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearConfigError } = configSlice.actions;
export default configSlice.reducer;
