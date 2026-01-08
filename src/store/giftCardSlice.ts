// Gift Card Slice - Redux state management for Gift Cards
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Type definitions (matching backend/database schema)
interface GiftCardCode {
  id: string;
  code: string;
  skuId: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  redeemedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface ValidateCodeData {
  code: string;
}

interface CreateBulkCodesData {
  codes: string[];
  skuId: string;
}

interface GenerateCodesData {
  quantity: number;
  skuId: string;
}

interface GiftCardState {
  codes: GiftCardCode[];
  validatedCode: GiftCardCode | null;
  loading: boolean;
  error: string | null;
}

const initialState: GiftCardState = {
  codes: [],
  validatedCode: null,
  loading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('csr26_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Async thunks
export const validateGiftCard = createAsyncThunk(
  'giftCards/validate',
  async (data: ValidateCodeData) => {
    const response = await fetch(`${API_URL}/validate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to validate gift card');
    }
    const result = await response.json();
    return result.data;
  }
);

export const createBulkGiftCards = createAsyncThunk(
  'giftCards/createBulk',
  async (data: CreateBulkCodesData) => {
    const response = await fetch(`${API_URL}/gift-cards/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create gift cards');
    const result = await response.json();
    return result.data;
  }
);

// Generate gift card codes (system generates unique codes)
export const generateGiftCards = createAsyncThunk(
  'giftCards/generate',
  async (data: GenerateCodesData) => {
    const response = await fetch(`${API_URL}/gift-cards/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate gift cards');
    }
    const result = await response.json();
    return result.data;
  }
);

export const fetchGiftCards = createAsyncThunk(
  'giftCards/fetchAll',
  async (filters?: { isRedeemed?: boolean; skuId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.isRedeemed !== undefined)
      params.append('isRedeemed', String(filters.isRedeemed));
    if (filters?.skuId) params.append('skuId', filters.skuId);

    const response = await fetch(`${API_URL}/gift-cards?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch gift cards');
    const data = await response.json();
    return data.data;
  }
);

export const fetchCodeStatus = createAsyncThunk(
  'giftCards/fetchCodeStatus',
  async (code: string) => {
    const response = await fetch(`${API_URL}/gift-cards/status/${code}`);
    if (!response.ok) throw new Error('Failed to fetch code status');
    const data = await response.json();
    return data.data;
  }
);

// Invalidate a single gift card code (admin action)
export const invalidateGiftCard = createAsyncThunk(
  'giftCards/invalidate',
  async (code: string) => {
    const response = await fetch(`${API_URL}/gift-cards/${encodeURIComponent(code)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to invalidate gift card');
    }
    const result = await response.json();
    return result.data;
  }
);

// Invalidate multiple gift card codes (admin action)
export const invalidateGiftCardsBulk = createAsyncThunk(
  'giftCards/invalidateBulk',
  async (codes: string[]) => {
    const response = await fetch(`${API_URL}/gift-cards/invalidate-bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ codes }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to invalidate gift cards');
    }
    const result = await response.json();
    return result.data;
  }
);

// Slice
const giftCardSlice = createSlice({
  name: 'giftCards',
  initialState,
  reducers: {
    clearValidatedCode: (state) => {
      state.validatedCode = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Validate gift card
    builder
      .addCase(validateGiftCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateGiftCard.fulfilled, (state, action: PayloadAction<GiftCardCode>) => {
        state.loading = false;
        state.validatedCode = action.payload;
      })
      .addCase(validateGiftCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to validate gift card';
      });

    // Create bulk gift cards (manual codes)
    builder
      .addCase(createBulkGiftCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createBulkGiftCards.fulfilled,
        (state, action: PayloadAction<GiftCardCode[]>) => {
          state.loading = false;
          state.codes.push(...action.payload);
        }
      )
      .addCase(createBulkGiftCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create gift cards';
      });

    // Generate gift cards (system generates unique codes)
    builder
      .addCase(generateGiftCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        generateGiftCards.fulfilled,
        (state, action: PayloadAction<GiftCardCode[]>) => {
          state.loading = false;
          state.codes.push(...action.payload);
        }
      )
      .addCase(generateGiftCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate gift cards';
      });

    // Fetch gift cards
    builder
      .addCase(fetchGiftCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGiftCards.fulfilled, (state, action: PayloadAction<GiftCardCode[]>) => {
        state.loading = false;
        state.codes = action.payload;
      })
      .addCase(fetchGiftCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch gift cards';
      });

    // Fetch code status
    builder
      .addCase(fetchCodeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCodeStatus.fulfilled, (state, action: PayloadAction<GiftCardCode>) => {
        state.loading = false;
        state.validatedCode = action.payload;
      })
      .addCase(fetchCodeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch code status';
      });

    // Invalidate single gift card
    builder
      .addCase(invalidateGiftCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(invalidateGiftCard.fulfilled, (state, action: PayloadAction<GiftCardCode>) => {
        state.loading = false;
        // Update the code in the list to reflect invalidation
        const index = state.codes.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.codes[index] = action.payload;
        }
      })
      .addCase(invalidateGiftCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to invalidate gift card';
      });

    // Invalidate bulk gift cards
    builder
      .addCase(invalidateGiftCardsBulk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(invalidateGiftCardsBulk.fulfilled, (state, action) => {
        state.loading = false;
        // Update invalidated codes in the list
        const results = action.payload as Array<{ code: string; success: boolean; giftCard?: GiftCardCode }>;
        results.forEach((result) => {
          if (result.success && result.giftCard) {
            const index = state.codes.findIndex((c) => c.id === result.giftCard!.id);
            if (index !== -1) {
              state.codes[index] = result.giftCard;
            }
          }
        });
      })
      .addCase(invalidateGiftCardsBulk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to invalidate gift cards';
      });
  },
});

export const { clearValidatedCode, clearError } = giftCardSlice.actions;
export default giftCardSlice.reducer;
