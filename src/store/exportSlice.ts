// Export Slice - Redux state management for data export
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ExportFilters {
  startDate: string;
  endDate: string;
  merchantId?: string;
  partnerId?: string;
  userId?: string;
  amplivoOnly?: boolean;
}

interface ExportState {
  loading: boolean;
  error: string | null;
  lastExportUrl: string | null;
}

const initialState: ExportState = {
  loading: false,
  error: null,
  lastExportUrl: null,
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Async thunks
export const exportAmplivoData = createAsyncThunk(
  'export/amplivo',
  async ({ filters, format }: { filters: ExportFilters; format: 'xlsx' | 'csv' }) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.merchantId) params.append('merchantId', filters.merchantId);
    if (filters.partnerId) params.append('partnerId', filters.partnerId);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.amplivoOnly) params.append('amplivoOnly', 'true');
    params.append('format', format);

    const url = `${API_URL}/admin/export?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `amplivo_export_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return url;
  }
);

export const exportPartnerReport = createAsyncThunk(
  'export/partner',
  async ({ partnerId, filters, format }: { partnerId: string; filters: ExportFilters; format: 'xlsx' | 'csv' }) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('format', format);

    const url = `${API_URL}/admin/export/partner/${partnerId}?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `partner_report_${partnerId}_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return url;
  }
);

// Slice
const exportSlice = createSlice({
  name: 'export',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Amplivo Export
      .addCase(exportAmplivoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportAmplivoData.fulfilled, (state, action) => {
        state.loading = false;
        state.lastExportUrl = action.payload;
      })
      .addCase(exportAmplivoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export Amplivo data';
      })
      // Partner Report
      .addCase(exportPartnerReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportPartnerReport.fulfilled, (state, action) => {
        state.loading = false;
        state.lastExportUrl = action.payload;
      })
      .addCase(exportPartnerReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export partner report';
      });
  },
});

export const { clearError } = exportSlice.actions;
export default exportSlice.reducer;
