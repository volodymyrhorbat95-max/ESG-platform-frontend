// Global Loading Slice - Single source of truth for loading state across the app
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

const initialState: LoadingState = {
  isLoading: false,
  loadingMessage: undefined,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message;
    },
    clearLoading: (state) => {
      state.isLoading = false;
      state.loadingMessage = undefined;
    },
  },
});

export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
