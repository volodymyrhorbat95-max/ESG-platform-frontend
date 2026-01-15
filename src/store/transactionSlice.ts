// Transaction Slice - Redux state management for Transactions
// CRITICAL: Types must match backend/database schema
// Flow: Component → dispatch → thunk → API → backend → database → response → store → UI

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RegistrationInput } from './userSlice';

const API_URL = import.meta.env.VITE_API_URL;

// Payment status enum matching backend
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'n/a';

// Payment mode enum matching backend
export type PaymentMode = 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION';

// SKU type (minimal, from transaction includes)
export interface SKU {
  id: string;
  code: string;
  name: string;
  price: number;
  paymentMode: PaymentMode;
  corsairThreshold: number;
  impactMultiplier: number;
}

// Transaction type matching backend model
export interface Transaction {
  id: string;
  userId: string;
  skuId: string;
  masterId: string; // Marcello's Master ID - for overall network tracking
  merchantId?: string;
  partnerId?: string;
  orderId?: string;
  amount: number;
  calculatedImpact: number; // in grams
  paymentStatus: PaymentStatus;
  corsairConnectFlag: boolean;
  giftCardCodeId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
  // Joined data from API
  sku?: SKU;
}

// Input for creating a transaction
export interface CreateTransactionInput {
  skuCode: string;
  userId?: string;
  merchantId?: string;
  partnerId?: string;
  orderId?: string;
  amount?: number; // Required for ALLOCATION type
  giftCardCode?: string; // Required for GIFT_CARD type
  registrationData?: RegistrationInput;
}

interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  userTotalImpact: number; // total grams for current user
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  currentTransaction: null,
  userTotalImpact: 0,
  loading: false,
  error: null,
};

// Create transaction
export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (input: CreateTransactionInput, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to create transaction');
      }
      const result = await response.json();
      return result.data as Transaction;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch transaction by ID
export const fetchTransactionById = createAsyncThunk(
  'transactions/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch transaction');
      }
      const result = await response.json();
      return result.data as Transaction;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch transactions for a user (user dashboard)
export const fetchUserTransactions = createAsyncThunk(
  'transactions/fetchByUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transactions/user/${userId}`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch user transactions');
      }
      const result = await response.json();
      return result.data as Transaction[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch transactions for a merchant (merchant dashboard)
export const fetchMerchantTransactions = createAsyncThunk(
  'transactions/fetchByMerchant',
  async (merchantId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transactions/merchant/${merchantId}`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch merchant transactions');
      }
      const result = await response.json();
      return result.data as Transaction[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all transactions (admin)
// Supports filtering by all 3 attribution IDs: masterId, merchantId, partnerId
export const fetchAllTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (filters: {
    userId?: string;
    masterId?: string;
    merchantId?: string;
    partnerId?: string;
    corsairConnectFlag?: boolean;
    paymentStatus?: PaymentStatus;
    startDate?: string;
    endDate?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.masterId) params.append('masterId', filters.masterId);
      if (filters.merchantId) params.append('merchantId', filters.merchantId);
      if (filters.partnerId) params.append('partnerId', filters.partnerId);
      if (filters.corsairConnectFlag !== undefined) params.append('corsairConnectFlag', String(filters.corsairConnectFlag));
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const token = localStorage.getItem('csr26_admin_token');
      const response = await fetch(`${API_URL}/transactions?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch transactions');
      }
      const result = await response.json();
      return result.data as Transaction[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update payment status (after Stripe webhook or manual update)
export const updatePaymentStatus = createAsyncThunk(
  'transactions/updatePaymentStatus',
  async ({ id, paymentStatus, stripePaymentIntentId }: {
    id: string;
    paymentStatus: PaymentStatus;
    stripePaymentIntentId?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}/payment-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus, stripePaymentIntentId }),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to update payment status');
      }
      const result = await response.json();
      return result.data as Transaction;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Section 9.5: Create manual transaction (admin only)
export const createManualTransaction = createAsyncThunk(
  'transactions/createManual',
  async (input: {
    userId: string;
    skuCode: string;
    amount: number;
    merchantId?: string;
    partnerId?: string;
    orderId?: string;
    reason: string;
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('csr26_admin_token');
      const response = await fetch(`${API_URL}/transactions/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to create manual transaction');
      }
      const result = await response.json();
      return result.data as Transaction;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get user's total impact
export const fetchUserTotalImpact = createAsyncThunk(
  'transactions/fetchUserTotalImpact',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/transactions/user/${userId}/total-impact`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch total impact');
      }
      const result = await response.json();
      return result.data.totalImpact as number;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setCurrentTransaction: (state, action: PayloadAction<Transaction>) => {
      state.currentTransaction = action.payload;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
    clearTransactionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        state.transactions.unshift(action.payload);
        // Update total impact if transaction is completed
        if (action.payload.paymentStatus === 'completed' || action.payload.paymentStatus === 'n/a') {
          state.userTotalImpact += action.payload.calculatedImpact;
        }
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch transaction by ID
    builder
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch user transactions
    builder
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch merchant transactions
    builder
      .addCase(fetchMerchantTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchantTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchMerchantTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch all transactions
    builder
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update payment status
    builder
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        if (state.currentTransaction?.id === action.payload.id) {
          state.currentTransaction = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch user total impact
    builder
      .addCase(fetchUserTotalImpact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTotalImpact.fulfilled, (state, action) => {
        state.loading = false;
        state.userTotalImpact = action.payload;
      })
      .addCase(fetchUserTotalImpact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Section 9.5: Create manual transaction
    builder
      .addCase(createManualTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createManualTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        // Add to transactions list if it's loaded
        if (state.transactions.length > 0) {
          state.transactions.unshift(action.payload);
        }
      })
      .addCase(createManualTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentTransaction,
  clearCurrentTransaction,
  clearTransactions,
  clearTransactionError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
