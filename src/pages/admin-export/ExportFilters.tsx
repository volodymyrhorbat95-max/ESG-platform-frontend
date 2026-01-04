// Export Filters Component
interface ExportFiltersProps {
  exportType: 'amplivo' | 'partner';
  filters: {
    startDate: string;
    endDate: string;
    merchantId: string;
    partnerId: string;
    userId: string;
    amplivoOnly: boolean;
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

        {exportType === 'amplivo' && (
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
                id="amplivoOnly"
                checked={filters.amplivoOnly}
                onChange={(e) => onFiltersChange({ ...filters, amplivoOnly: e.target.checked })}
                className="mr-2 animate-on-load zoom-in duration-fast"
              />
              <label htmlFor="amplivoOnly" className="text-sm text-gray-700 animate-on-load fade-left duration-normal">
                Only include transactions flagged for Amplivo
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
      </div>
    </div>
  );
}
