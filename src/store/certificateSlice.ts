// Certificate Slice - Redux state management for Certificate downloads and verification
// Section 9: Certificate Generation
// CRITICAL: All API calls through Redux, NO direct fetch in components

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { env } from '../config/env';

const API_URL = env.apiUrl;

// Verification result interface
interface CertificateVerification {
  transactionId: string;
  isValid: boolean;
  verifiedAt: string;
  details: {
    impactGrams: number;
    impactKg: string;
    date: string;
    sku: {
      code: string;
      name: string;
    };
    user: {
      name: string;
    };
    equivalents: {
      plasticBottles: number;
      trees: string;
      oceanCleanup: string;
    };
  };
}

interface CertificateState {
  loading: boolean;
  verifying: boolean;
  error: string | null;
  verificationResult: CertificateVerification | null;
}

const initialState: CertificateState = {
  loading: false,
  verifying: false,
  error: null,
  verificationResult: null,
};

// Download certificate as PDF
export const downloadCertificate = createAsyncThunk(
  'certificates/download',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/certificates/${transactionId}`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to download certificate');
      }

      // Get blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CSR26_Certificate_${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, transactionId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Verify certificate by transaction ID (for QR code scanning)
export const verifyCertificate = createAsyncThunk(
  'certificates/verify',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/certificates/${transactionId}/verify`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Certificate verification failed');
      }

      const data = await response.json();
      return data as CertificateVerification;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const certificateSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {
    clearCertificateError: (state) => {
      state.error = null;
    },
    clearVerificationResult: (state) => {
      state.verificationResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Download certificate
      .addCase(downloadCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadCertificate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify certificate
      .addCase(verifyCertificate.pending, (state) => {
        state.verifying = true;
        state.error = null;
        state.verificationResult = null;
      })
      .addCase(verifyCertificate.fulfilled, (state, action) => {
        state.verifying = false;
        state.verificationResult = action.payload;
      })
      .addCase(verifyCertificate.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload as string;
        state.verificationResult = null;
      });
  },
});

export const { clearCertificateError, clearVerificationResult } = certificateSlice.actions;
export default certificateSlice.reducer;
