// Transaction Slice - Redux state management for Transactions
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Type definitions (matching backend/database schema)
interface Transaction {
  id: string;
  userId: string;
  skuId: string;
  merchantId?: string;
  partnerId?: string;
  orderId?: string;
  amount: number;
  calculatedImpact: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  amplivoFlag: boolean;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTransactionData {
  userId: string;
  skuCode: string;
  amount?: number;
  merchantId?: string;
  partnerId?: string;
  orderId?: string;
  giftCardCode?: string;
}

interface TransactionState {
  items: Transaction[];
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  items: [],
  currentTransaction: null,
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
export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (transactionData: CreateTransactionData) => {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create transaction');
    }
    const data = await response.json();
    return data.data;
  }
);

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (filters?: { userId?: string; merchantId?: string; partnerId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.merchantId) params.append('merchantId', filters.merchantId);
    if (filters?.partnerId) params.append('partnerId', filters.partnerId);

    const response = await fetch(`${API_URL}/transactions?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    const data = await response.json();
    return data.data;
  }
);

export const fetchTransactionById = createAsyncThunk(
  'transactions/fetchById',
  async (id: string) => {
    const response = await fetch(`${API_URL}/transactions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch transaction');
    const data = await response.json();
    return data.data;
  }
);

export const updateTransactionPaymentStatus = createAsyncThunk(
  'transactions/updatePaymentStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await fetch(`${API_URL}/transactions/${id}/payment-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: status }),
    });
    if (!response.ok) throw new Error('Failed to update payment status');
    const data = await response.json();
    return data.data;
  }
);

// Slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    clearError: (state) => {
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
      .addCase(createTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        state.items.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create transaction';
      });

    // Fetch transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });

    // Fetch transaction by ID
    builder
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transaction';
      });

    // Update payment status
    builder
      .addCase(updateTransactionPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTransactionPaymentStatus.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.loading = false;
          const index = state.items.findIndex((t) => t.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          if (state.currentTransaction?.id === action.payload.id) {
            state.currentTransaction = action.payload;
          }
        }
      )
      .addCase(updateTransactionPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update payment status';
      });
  },
});

export const { clearCurrentTransaction, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
