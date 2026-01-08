// Payment Slice - Redux state management for Stripe payments
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

interface CreatePaymentIntentData {
  amount: number;
  transactionId: string;
  userId: string;
  skuId: string;
  partnerId?: string;
  merchantStripeAccountId?: string;
}

interface PaymentState {
  paymentIntent: PaymentIntent | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentIntent: null,
  loading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  'payment/createIntent',
  async (data: CreatePaymentIntentData) => {
    const response = await fetch(`${API_URL}/payments/create-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create payment intent');
    const result = await response.json();
    return result.data;
  }
);

// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action: PayloadAction<PaymentIntent>) => {
        state.loading = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create payment intent';
      });
  },
});

export const { clearPaymentIntent, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
