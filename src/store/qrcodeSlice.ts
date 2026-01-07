// QR Code Slice - Redux state for QR code generation
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface QRCodeData {
  qrCodeDataUrl: string;
  targetUrl: string;
  downloadFileName: string;
  sku?: {
    code: string;
    name: string;
  };
}

interface QRCodeState {
  generatedQRCodes: QRCodeData[];
  loading: boolean;
  error: string | null;
}

const initialState: QRCodeState = {
  generatedQRCodes: [],
  loading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Generate single QR code
export const generateQRCode = createAsyncThunk(
  'qrcode/generate',
  async ({ merchantId, skuCode }: { merchantId: string; skuCode: string }) => {
    const response = await fetch(`${API_URL}/merchants/${merchantId}/qrcodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skuCode }),
    });
    if (!response.ok) throw new Error('Failed to generate QR code');
    const data = await response.json();
    return data.data;
  }
);

// Generate bulk QR codes
export const generateBulkQRCodes = createAsyncThunk(
  'qrcode/generateBulk',
  async ({ merchantId, skuCodes }: { merchantId: string; skuCodes: string[] }) => {
    const response = await fetch(`${API_URL}/merchants/${merchantId}/qrcodes/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skuCodes }),
    });
    if (!response.ok) throw new Error('Failed to generate QR codes');
    const data = await response.json();
    return data.data;
  }
);

const qrcodeSlice = createSlice({
  name: 'qrcode',
  initialState,
  reducers: {
    clearQRCodes: (state) => {
      state.generatedQRCodes = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Single QR generation
      .addCase(generateQRCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQRCode.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.generatedQRCodes = [action.payload];
      })
      .addCase(generateQRCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate QR code';
      })
      // Bulk QR generation
      .addCase(generateBulkQRCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateBulkQRCodes.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.generatedQRCodes = action.payload.qrCodes;
      })
      .addCase(generateBulkQRCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate QR codes';
      });
  },
});

export const { clearQRCodes, clearError } = qrcodeSlice.actions;
export default qrcodeSlice.reducer;
