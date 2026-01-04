// Transaction Filters Component
interface TransactionFiltersProps {
  filters: {
    userId: string;
    merchantId: string;
    partnerId: string;
  };
  onFiltersChange: (filters: { userId: string; merchantId: string; partnerId: string }) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function TransactionFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: TransactionFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-normal">
      <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-fast">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="animate-on-load fade-left duration-light-slow">
          <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">User ID</label>
          <input
            type="text"
            value={filters.userId}
            onChange={(e) => onFiltersChange({ ...filters, userId: e.target.value })}
            placeholder="Filter by user ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load zoom-in duration-normal"
          />
        </div>
        <div className="animate-on-load fade-up duration-normal">
          <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">Merchant ID</label>
          <input
            type="text"
            value={filters.merchantId}
            onChange={(e) => onFiltersChange({ ...filters, merchantId: e.target.value })}
            placeholder="Filter by merchant ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load flip-up duration-light-slow"
          />
        </div>
        <div className="animate-on-load fade-right duration-light-slow">
          <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">Partner ID</label>
          <input
            type="text"
            value={filters.partnerId}
            onChange={(e) => onFiltersChange({ ...filters, partnerId: e.target.value })}
            placeholder="Filter by partner ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load zoom-out duration-normal"
          />
        </div>
      </div>
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
