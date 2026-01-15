// Shareable Link Slice - Redux state management for dashboard sharing
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { env } from '../config/env';

// Type definitions
interface ShareableLink {
  id: string;
  token: string;
  shareUrl: string;
  expiresAt: string | null;
  isPublic: boolean;
  viewCount: number;
  lastViewedAt: string | null;
  createdAt: string;
  isValid: boolean;
}

interface SharedDashboardData {
  user: {
    firstName: string;
  };
  wallet: {
    currentBalance: number;
    currentBalanceKg: string;
    totalAccumulated: number;
    totalAccumulatedKg: string;
  };
  impact: {
    plasticBottles: number;
    totalGrams: number;
    totalKg: string;
  };
  transactions: Array<{
    id: string;
    date: string;
    skuName: string;
    impact: number;
    impactKg: string;
  }>;
  transactionCount: number;
  linkStats: {
    viewCount: number;
    createdAt: string;
    expiresAt: string | null;
  };
}

interface ShareableLinkState {
  links: ShareableLink[];
  sharedDashboard: SharedDashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShareableLinkState = {
  links: [],
  sharedDashboard: null,
  loading: false,
  error: null,
};

const API_URL = env.apiUrl;

// Async thunks
export const createShareableLink = createAsyncThunk(
  'shareableLinks/create',
  async ({ userId, expiresInDays, isPublic }: { userId: string; expiresInDays?: number; isPublic?: boolean }) => {
    const response = await fetch(`${API_URL}/users/${userId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresInDays, isPublic }),
    });
    if (!response.ok) throw new Error('Failed to create shareable link');
    const data = await response.json();
    return data.data;
  }
);

export const fetchUserLinks = createAsyncThunk(
  'shareableLinks/fetchUserLinks',
  async (userId: string) => {
    const response = await fetch(`${API_URL}/users/${userId}/share`);
    if (!response.ok) throw new Error('Failed to fetch shareable links');
    const data = await response.json();
    return data.data;
  }
);

export const fetchSharedDashboard = createAsyncThunk(
  'shareableLinks/fetchSharedDashboard',
  async (token: string) => {
    const response = await fetch(`${API_URL}/share/${token}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch shared dashboard');
    }
    const data = await response.json();
    return data.data;
  }
);

export const deleteShareableLink = createAsyncThunk(
  'shareableLinks/delete',
  async ({ userId, linkId }: { userId: string; linkId: string }) => {
    const response = await fetch(`${API_URL}/users/${userId}/share/${linkId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete shareable link');
    return linkId;
  }
);

// Slice
const shareableLinkSlice = createSlice({
  name: 'shareableLinks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSharedDashboard: (state) => {
      state.sharedDashboard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create link
      .addCase(createShareableLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShareableLink.fulfilled, (state, action: PayloadAction<ShareableLink>) => {
        state.loading = false;
        state.links.unshift({ ...action.payload, isValid: true });
      })
      .addCase(createShareableLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create link';
      })
      // Fetch user links
      .addCase(fetchUserLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLinks.fulfilled, (state, action: PayloadAction<ShareableLink[]>) => {
        state.loading = false;
        state.links = action.payload;
      })
      .addCase(fetchUserLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch links';
      })
      // Fetch shared dashboard
      .addCase(fetchSharedDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSharedDashboard.fulfilled, (state, action: PayloadAction<SharedDashboardData>) => {
        state.loading = false;
        state.sharedDashboard = action.payload;
      })
      .addCase(fetchSharedDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shared dashboard';
      })
      // Delete link
      .addCase(deleteShareableLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShareableLink.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.links = state.links.filter((link) => link.id !== action.payload);
      })
      .addCase(deleteShareableLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete link';
      });
  },
});

export const { clearError, clearSharedDashboard } = shareableLinkSlice.actions;
export default shareableLinkSlice.reducer;
