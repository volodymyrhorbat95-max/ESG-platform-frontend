// Transaction Filters Component - Supports date range, status, payment mode filtering
import type { TransactionFilterState, PaymentMode } from './index';
import type { PaymentStatus } from '../../store/transactionSlice';

interface TransactionFiltersProps {
  filters: TransactionFilterState;
  onFiltersChange: (filters: TransactionFilterState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function TransactionFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: TransactionFiltersProps) {
  const paymentModes: { value: PaymentMode; label: string }[] = [
    { value: '', label: 'All Payment Modes' },
    { value: 'CLAIM', label: 'CLAIM' },
    { value: 'PAY', label: 'PAY' },
    { value: 'GIFT_CARD', label: 'GIFT_CARD' },
    { value: 'ALLOCATION', label: 'ALLOCATION' },
  ];

  const paymentStatuses: { value: PaymentStatus | ''; label: string }[] = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'n/a', label: 'N/A' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-normal">
      <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-fast">Filters</h2>

      {/* First row: Date range and Status/Mode */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="animate-on-load fade-left duration-light-slow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="animate-on-load fade-up duration-normal">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="animate-on-load fade-down duration-light-slow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => onFiltersChange({ ...filters, paymentStatus: e.target.value as PaymentStatus | '' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {paymentStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className="animate-on-load fade-right duration-normal">
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
          <select
            value={filters.paymentMode}
            onChange={(e) => onFiltersChange({ ...filters, paymentMode: e.target.value as PaymentMode })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {paymentModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Second row: ID filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="animate-on-load fade-left duration-light-slow">
          <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
          <input
            type="text"
            value={filters.userId}
            onChange={(e) => onFiltersChange({ ...filters, userId: e.target.value })}
            placeholder="Filter by user ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="animate-on-load fade-up duration-normal">
          <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
          <input
            type="text"
            value={filters.merchantId}
            onChange={(e) => onFiltersChange({ ...filters, merchantId: e.target.value })}
            placeholder="Filter by merchant ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="animate-on-load fade-right duration-light-slow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Partner ID</label>
          <input
            type="text"
            value={filters.partnerId}
            onChange={(e) => onFiltersChange({ ...filters, partnerId: e.target.value })}
            placeholder="Filter by partner ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={onApplyFilters}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors animate-on-load fade-up duration-slow"
        >
          Apply Filters
        </button>
        <button
          onClick={onClearFilters}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors animate-on-load fade-up duration-very-slow"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
