// Filter Buttons Component
interface FilterButtonsProps {
  filter: 'all' | 'redeemed' | 'available';
  totalCodes: number;
  availableCodes: number;
  redeemedCodes: number;
  onFilterChange: (filter: 'all' | 'redeemed' | 'available') => void;
}

export default function FilterButtons({
  filter,
  totalCodes,
  availableCodes,
  redeemedCodes,
  onFilterChange,
}: FilterButtonsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6 animate-on-load fade-up duration-normal">
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors animate-on-load fade-right duration-fast ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({totalCodes})
        </button>
        <button
          onClick={() => onFilterChange('available')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-normal ${
            filter === 'available'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Available ({availableCodes})
        </button>
        <button
          onClick={() => onFilterChange('redeemed')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors animate-on-load fade-left duration-light-slow ${
            filter === 'redeemed'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Redeemed ({redeemedCodes})
        </button>
      </div>
    </div>
  );
}
