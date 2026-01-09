// Admin Export Interface - Generate all report types
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  exportCorsairConnectData,
  exportPartnerReport,
  exportStripeReconciliation,
  exportImpactReport,
  exportTrendAnalysis,
  exportSKUPerformance,
} from '../../store/exportSlice';
import ExportTypeSelector, { type ExportType } from './ExportTypeSelector';
import FormatSelector from './FormatSelector';
import ExportFilters from './ExportFilters';

export default function AdminExport() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.export);

  const [exportType, setExportType] = useState<ExportType>('corsairConnect');
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    merchantId: '',
    partnerId: '',
    userId: '',
    corsairConnectOnly: false,
  });

  const handleExport = async () => {
    if (exportType === 'corsairConnect') {
      await dispatch(exportCorsairConnectData({ filters, format }));
    } else if (exportType === 'partner') {
      if (!filters.partnerId) {
        alert('Please enter a Partner ID');
        return;
      }
      await dispatch(exportPartnerReport({ partnerId: filters.partnerId, filters, format }));
    } else if (exportType === 'reconciliation') {
      await dispatch(exportStripeReconciliation({ filters, format }));
    } else if (exportType === 'impact') {
      await dispatch(exportImpactReport({ filters, format }));
    } else if (exportType === 'trends') {
      await dispatch(exportTrendAnalysis({ filters, format }));
    } else if (exportType === 'skuPerformance') {
      await dispatch(exportSKUPerformance({ filters, format }));
    }
  };

  const getExportButtonLabel = () => {
    const labels: Record<ExportType, string> = {
      corsairConnect: 'Corsair Connect Export',
      partner: 'Partner Report',
      reconciliation: 'Stripe Reconciliation',
      impact: 'Impact Report',
      trends: 'Trend Analysis',
      skuPerformance: 'SKU Performance',
    };
    return labels[exportType];
  };

  return (
    <div className=" py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">Data Export</h1>
          <p className="text-gray-600 animate-on-load fade-left duration-light-slow">Generate Excel/CSV reports for Corsair Connect submission and partner invoicing</p>
        </div>

        <div className="animate-on-load zoom-in duration-light-slow">
          <ExportTypeSelector exportType={exportType} onTypeChange={setExportType} />
        </div>
        <div className="animate-on-load fade-right duration-normal">
          <FormatSelector format={format} onFormatChange={setFormat} />
        </div>
        <div className="animate-on-load fade-left duration-slow">
          <ExportFilters exportType={exportType} filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-on-load fade-up duration-fast">
            {error}
          </div>
        )}

        {/* Export Button */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-very-slow">
          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load zoom-in duration-slow"
          >
            {loading ? 'Generating...' : `Generate ${getExportButtonLabel()} (${format.toUpperCase()})`}
          </button>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg animate-on-load flip-up duration-light-slow">
            <p className="text-sm text-gray-700 animate-on-load fade-right duration-normal">
              <strong className="animate-on-load zoom-out duration-fast">Note:</strong> The file will download automatically when you click the button.
              {exportType === 'corsairConnect' && ' Corsair Connect exports include all transaction details, user information, and impact calculations.'}
              {exportType === 'partner' && ' Partner reports include transaction summaries and totals for invoicing.'}
              {exportType === 'reconciliation' && ' Stripe reconciliation reports show payment details with platform fees for financial reconciliation.'}
              {exportType === 'impact' && ' Impact reports aggregate environmental metrics across all merchants and partners.'}
              {exportType === 'trends' && ' Trend analysis reports show monthly metrics with month-over-month growth for strategic planning.'}
              {exportType === 'skuPerformance' && ' SKU performance reports analyze individual product metrics for product development decisions.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
