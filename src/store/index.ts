// Redux Store Configuration
import { configureStore, type Middleware } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import skuReducer from './skuSlice';
import userReducer from './userSlice';
import transactionReducer from './transactionSlice';
import walletReducer from './walletSlice';
import giftCardReducer from './giftCardSlice';
import paymentReducer from './paymentSlice';
import loadingReducer from './loadingSlice';
import exportReducer from './exportSlice';
import merchantReducer from './merchantSlice';
import partnerReducer from './partnerSlice';

// Global error handling middleware
const errorLoggingMiddleware: Middleware = () => (next) => (action: any) => {
  if (action.type && typeof action.type === 'string' && action.type.endsWith('/rejected')) {
    console.error('❌ Redux Action Error:', {
      type: action.type,
      error: action.error?.message || action.error,
      payload: action.payload,
    });
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    skus: skuReducer,
    users: userReducer,
    transactions: transactionReducer,
    wallets: walletReducer,
    giftCards: giftCardReducer,
    payment: paymentReducer,
    loading: loadingReducer,
    export: exportReducer,
    merchants: merchantReducer,
    partners: partnerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorLoggingMiddleware),
  devTools: import.meta.env.MODE !== 'production',
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
