// Export Filters Component
import type { ExportType } from './ExportTypeSelector';

interface ExportFiltersProps {
  exportType: ExportType;
  filters: {
    startDate: string;
    endDate: string;
    merchantId: string;
    partnerId: string;
    userId: string;
    corsairConnectOnly: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export default function ExportFilters({ exportType, filters, onFiltersChange }: ExportFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-normal">
      <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-fast">Filters</h2>
      <div className="space-y-4 animate-on-load zoom-in duration-light-slow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-on-load fade-down duration-normal">
          <div className="animate-on-load fade-left duration-fast">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">
              Start Date *
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load zoom-in duration-normal"
            />
          </div>
          <div className="animate-on-load fade-right duration-fast">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">
              End Date *
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load flip-up duration-light-slow"
            />
          </div>
        </div>

        {exportType === 'corsairConnect' && (
          <>
            <div className="animate-on-load fade-up duration-normal">
              <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-left duration-very-fast">
                Merchant ID (optional)
              </label>
              <input
                type="text"
                value={filters.merchantId}
                onChange={(e) => onFiltersChange({ ...filters, merchantId: e.target.value })}
                placeholder="Filter by merchant ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load zoom-out duration-normal"
              />
            </div>
            <div className="animate-on-load fade-down duration-light-slow">
              <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-right duration-very-fast">
                Partner ID (optional)
              </label>
              <input
                type="text"
                value={filters.partnerId}
                onChange={(e) => onFiltersChange({ ...filters, partnerId: e.target.value })}
                placeholder="Filter by partner ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load fade-left duration-normal"
              />
            </div>
            <div className="animate-on-load fade-right duration-slow">
              <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load zoom-in duration-very-fast">
                User ID (optional)
              </label>
              <input
                type="text"
                value={filters.userId}
                onChange={(e) => onFiltersChange({ ...filters, userId: e.target.value })}
                placeholder="Filter by user ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load flip-down duration-light-slow"
              />
            </div>
            <div className="flex items-center animate-on-load fade-up duration-very-slow">
              <input
                type="checkbox"
                id="corsairConnectOnly"
                checked={filters.corsairConnectOnly}
                onChange={(e) => onFiltersChange({ ...filters, corsairConnectOnly: e.target.checked })}
                className="mr-2 animate-on-load zoom-in duration-fast"
              />
              <label htmlFor="corsairConnectOnly" className="text-sm text-gray-700 animate-on-load fade-left duration-normal">
                Only include transactions flagged for Corsair Connect
              </label>
            </div>
          </>
        )}

        {exportType === 'partner' && (
          <div className="animate-on-load fade-up duration-normal">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">
              Partner ID *
            </label>
            <input
              type="text"
              value={filters.partnerId}
              onChange={(e) => onFiltersChange({ ...filters, partnerId: e.target.value })}
              placeholder="Enter partner ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load zoom-in duration-light-slow"
              required
            />
          </div>
        )}

        {exportType === 'reconciliation' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 animate-on-load fade-up duration-normal">
            <h4 className="font-semibold text-purple-800 mb-2">Stripe Reconciliation Report</h4>
            <p className="text-sm text-gray-700">
              This report shows all Stripe payments within the selected date range, including:
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
              <li>Transaction details and Stripe Payment Intent IDs</li>
              <li>Gross transaction amounts</li>
              <li>Platform fees (10% of transaction)</li>
              <li>Net merchant payouts</li>
              <li>Summary totals for the period</li>
            </ul>
          </div>
        )}

        {exportType === 'impact' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 animate-on-load fade-up duration-normal">
            <h4 className="font-semibold text-emerald-800 mb-2">Aggregate Impact Report</h4>
            <p className="text-sm text-gray-700">
              This report aggregates impact data across all merchants and partners, including:
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
              <li>Overall summary (total transactions, revenue, trees planted, plastic removed)</li>
              <li>Breakdown by merchant</li>
              <li>Breakdown by partner</li>
              <li>Breakdown by SKU type (e.g., tree_planting, plastic_removal)</li>
            </ul>
          </div>
        )}

        {exportType === 'trends' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-on-load fade-up duration-normal">
            <h4 className="font-semibold text-blue-800 mb-2">Trend Analysis Report</h4>
            <p className="text-sm text-gray-700">
              This report provides monthly trend analysis for strategic planning:
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
              <li>Monthly transaction volume and revenue</li>
              <li>Month-over-month growth percentages</li>
              <li>Impact trends over time</li>
              <li>SKU type breakdown per month</li>
            </ul>
          </div>
        )}

        {exportType === 'skuPerformance' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 animate-on-load fade-up duration-normal">
            <h4 className="font-semibold text-orange-800 mb-2">SKU Performance Report</h4>
            <p className="text-sm text-gray-700">
              This report analyzes individual SKU performance for product development:
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
              <li>Per-SKU transaction volume and revenue</li>
              <li>Unique user counts per SKU</li>
              <li>Average transaction value</li>
              <li>Revenue share percentages</li>
              <li>Merchant breakdown for top SKUs</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
