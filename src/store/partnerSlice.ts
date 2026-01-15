// Partner Slice - Redux state management for Partners
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { env } from '../config/env';

// Type definitions (matching backend/database schema)
interface Partner {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
  phone?: string;
  billingAddress?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PartnerState {
  partners: Partner[];
  currentPartner: Partner | null;
  loading: boolean;
  error: string | null;
}

const initialState: PartnerState = {
  partners: [],
  currentPartner: null,
  loading: false,
  error: null,
};

// Get API URL from environment
const API_URL = env.apiUrl;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('csr26_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Async thunks for API calls
export const fetchPartners = createAsyncThunk('partners/fetchAll', async () => {
  const response = await fetch(`${API_URL}/admin/partners`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch partners');
  const data = await response.json();
  return data.data;
});

export const createPartner = createAsyncThunk(
  'partners/create',
  async (partnerData: Partial<Partner>) => {
    const response = await fetch(`${API_URL}/admin/partners`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(partnerData),
    });
    if (!response.ok) throw new Error('Failed to create partner');
    const data = await response.json();
    return data.data;
  }
);

export const updatePartner = createAsyncThunk(
  'partners/update',
  async ({ id, updates }: { id: string; updates: Partial<Partner> }) => {
    const response = await fetch(`${API_URL}/admin/partners/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update partner');
    const data = await response.json();
    return data.data;
  }
);

export const deletePartner = createAsyncThunk('partners/delete', async (id: string) => {
  const response = await fetch(`${API_URL}/admin/partners/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete partner');
  return id;
});

// Slice
const partnerSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all partners
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch partners';
      });

    // Create partner
    builder
      .addCase(createPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.loading = false;
        state.partners.push(action.payload);
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create partner';
      });

    // Update partner
    builder
      .addCase(updatePartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.loading = false;
        const index = state.partners.findIndex((partner) => partner.id === action.payload.id);
        if (index !== -1) {
          state.partners[index] = action.payload;
        }
      })
      .addCase(updatePartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update partner';
      });

    // Delete partner
    builder
      .addCase(deletePartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePartner.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.partners = state.partners.filter((partner) => partner.id !== action.payload);
      })
      .addCase(deletePartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete partner';
      });
  },
});

export const { clearError } = partnerSlice.actions;
export default partnerSlice.reducer;
