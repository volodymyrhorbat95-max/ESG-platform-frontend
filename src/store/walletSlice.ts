// Wallet Slice - Redux state management for Wallets
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { env } from '../config/env';
import type { Transaction } from '../types/transaction';

// Type definitions (matching backend/database schema)
// Section 6: Added totalAmountSpent and certifiedAssetStatus for threshold tracking
interface Wallet {
  id: string;
  userId?: string;
  merchantId?: string;
  totalAccumulated: number;
  totalRedeemed: number;
  currentBalance: number;
  totalAmountSpent: number; // Section 6.1: Total euros spent (for €10 threshold tracking)
  certifiedAssetStatus: boolean; // Section 6.2: True if totalAmountSpent >= threshold
  createdAt: string;
  updatedAt: string;
}

interface WalletWithHistory {
  wallet: Wallet;
  transactions: Transaction[]; // Now properly typed instead of any[]
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

const API_URL = env.apiUrl;

// Helper function to get auth headers with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('csr26_session_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Async thunks
export const fetchUserWallet = createAsyncThunk(
  'wallets/fetchUserWallet',
  async (_userId: string) => {
    // JWT token in header provides authentication, userId still passed for dashboard routing
    const response = await fetch(`${API_URL}/user/wallet`, {
      headers: getAuthHeaders(),
    });
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
