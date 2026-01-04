// Date Range Filter Component
interface DateRangeFilterProps {
  dateRange: { start: string; end: string };
  onDateRangeChange: (dateRange: { start: string; end: string }) => void;
  periodStats: {
    transactionCount: number;
    totalAmount: number;
    totalImpact: number;
  };
}

export default function DateRangeFilter({
  dateRange,
  onDateRangeChange,
  periodStats,
}: DateRangeFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-normal">
      <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-fast">Filter by Date Range</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="animate-on-load fade-left duration-light-slow">
          <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary animate-on-load zoom-in duration-normal"
          />
        </div>
        <div className="animate-on-load fade-right duration-light-slow">
          <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary animate-on-load zoom-out duration-normal"
          />
        </div>
      </div>

      {/* Period Summary */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg animate-on-load flip-up duration-slow">
          <p className="text-sm text-gray-600 mb-1 animate-on-load fade-left duration-fast">Period Transactions</p>
          <p className="text-2xl font-bold text-gray-800 animate-on-load zoom-in duration-normal">{periodStats.transactionCount}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg animate-on-load fade-up duration-slow">
          <p className="text-sm text-gray-600 mb-1 animate-on-load fade-right duration-fast">Period Revenue</p>
          <p className="text-2xl font-bold text-gray-800 animate-on-load flip-down duration-normal">€{periodStats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg animate-on-load flip-down duration-slow">
          <p className="text-sm text-gray-600 mb-1 animate-on-load fade-up duration-fast">Period Impact</p>
          <p className="text-2xl font-bold text-gray-800 animate-on-load zoom-out duration-normal">
            {(periodStats.totalImpact / 1000).toFixed(3)} kg
          </p>
        </div>
      </div>
    </div>
  );
}
