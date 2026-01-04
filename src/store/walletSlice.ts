// Wallet Slice - Redux state management for Wallets
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Type definitions (matching backend/database schema)
interface Wallet {
  id: string;
  userId?: string;
  merchantId?: string;
  totalAccumulated: number;
  totalRedeemed: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

interface WalletWithHistory {
  wallet: Wallet;
  transactions: any[];
}

interface WalletState {
  userWallet: WalletWithHistory | null;
  merchantWallet: WalletWithHistory | null;
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  userWallet: null,
  merchantWallet: null,
  loading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Async thunks
export const fetchUserWallet = createAsyncThunk(
  'wallets/fetchUserWallet',
  async (userId: string) => {
    const response = await fetch(`${API_URL}/user/wallet?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user wallet');
    const data = await response.json();
    return data.data;
  }
);

export const fetchMerchantWallet = createAsyncThunk(
  'wallets/fetchMerchantWallet',
  async (merchantId: string) => {
    const response = await fetch(`${API_URL}/merchant/wallet?merchantId=${merchantId}`);
    if (!response.ok) throw new Error('Failed to fetch merchant wallet');
    const data = await response.json();
    return data.data;
  }
);

// Slice
const walletSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    clearUserWallet: (state) => {
      state.userWallet = null;
    },
    clearMerchantWallet: (state) => {
      state.merchantWallet = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user wallet
    builder
      .addCase(fetchUserWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWallet.fulfilled, (state, action: PayloadAction<WalletWithHistory>) => {
        state.loading = false;
        state.userWallet = action.payload;
      })
      .addCase(fetchUserWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user wallet';
      });

    // Fetch merchant wallet
    builder
      .addCase(fetchMerchantWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMerchantWallet.fulfilled,
        (state, action: PayloadAction<WalletWithHistory>) => {
          state.loading = false;
          state.merchantWallet = action.payload;
        }
      )
      .addCase(fetchMerchantWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch merchant wallet';
      });
  },
});

export const { clearUserWallet, clearMerchantWallet, clearError } = walletSlice.actions;
export default walletSlice.reducer;
