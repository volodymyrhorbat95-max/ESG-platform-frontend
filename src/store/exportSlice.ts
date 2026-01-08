// Export Slice - Redux state management for data export
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ExportFilters {
  startDate: string;
  endDate: string;
  merchantId?: string;
  partnerId?: string;
  userId?: string;
  corsairConnectOnly?: boolean;
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

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('csr26_admin_token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Async thunks
export const exportCorsairConnectData = createAsyncThunk(
  'export/corsairConnect',
  async ({ filters, format }: { filters: ExportFilters; format: 'xlsx' | 'csv' }) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.merchantId) params.append('merchantId', filters.merchantId);
    if (filters.partnerId) params.append('partnerId', filters.partnerId);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.corsairConnectOnly) params.append('corsairConnectOnly', 'true');
    params.append('format', format);

    const url = `${API_URL}/admin/export?${params.toString()}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `corsair_connect_export_${new Date().toISOString().split('T')[0]}.${format}`;
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

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
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

export const exportStripeReconciliation = createAsyncThunk(
  'export/reconciliation',
  async ({ filters, format }: { filters: ExportFilters; format: 'xlsx' | 'csv' }) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('format', format);

    const url = `${API_URL}/admin/export/reconciliation?${params.toString()}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `stripe_reconciliation_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return url;
  }
);

export const exportImpactReport = createAsyncThunk(
  'export/impact',
  async ({ filters, format }: { filters: ExportFilters; format: 'xlsx' | 'csv' }) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('format', format);

    const url = `${API_URL}/admin/export/impact?${params.toString()}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `impact_report_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return url;
  }
);

export const exportTrendAnalysis = createAsyncThunk(
  'export/trends',
  async ({ filters, format }: { filters: ExportFilters; format: 'xlsx' | 'csv' }) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('format', format);

    const url = `${API_URL}/admin/export/trends?${params.toString()}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `trend_analysis_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return url;
  }
);

export const exportSKUPerformance = createAsyncThunk(
  'export/skuPerformance',
  async ({ filters, format }: { filters: ExportFilters; format: 'xlsx' | 'csv' }) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('format', format);

    const url = `${API_URL}/admin/export/sku-performance?${params.toString()}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `sku_performance_${new Date().toISOString().split('T')[0]}.${format}`;
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
      // Corsair Connect Export
      .addCase(exportCorsairConnectData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportCorsairConnectData.fulfilled, (state, action) => {
        state.loading = false;
        state.lastExportUrl = action.payload;
      })
      .addCase(exportCorsairConnectData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export Corsair Connect data';
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
      })
      // Stripe Reconciliation
      .addCase(exportStripeReconciliation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportStripeReconciliation.fulfilled, (state, action) => {
        state.loading = false;
        state.lastExportUrl = action.payload;
      })
      .addCase(exportStripeReconciliation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export reconciliation report';
      })
      // Impact Report
      .addCase(exportImpactReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportImpactReport.fulfilled, (state, action) => {
        state.loading = false;
        state.lastExportUrl = action.payload;
      })
      .addCase(exportImpactReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export impact report';
      })
      // Trend Analysis
      .addCase(exportTrendAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportTrendAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.lastExportUrl = action.payload;
      })
      .addCase(exportTrendAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export trend analysis';
      })
      // SKU Performance
      .addCase(exportSKUPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportSKUPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.lastExportUrl = action.payload;
      })
      .addCase(exportSKUPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export SKU performance';
      });
  },
});

export const { clearError } = exportSlice.actions;
export default exportSlice.reducer;
