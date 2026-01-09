// Export Type Selector Component
type ExportType = 'corsairConnect' | 'partner' | 'reconciliation' | 'impact' | 'trends' | 'skuPerformance';

interface ExportTypeSelectorProps {
  exportType: ExportType;
  onTypeChange: (type: ExportType) => void;
}

export default function ExportTypeSelector({ exportType, onTypeChange }: ExportTypeSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-normal">
      <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">Export Type</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          onClick={() => onTypeChange('corsairConnect')}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer animate-on-load fade-right duration-very-fast ${
            exportType === 'corsairConnect'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Corsair Connect Export
        </button>
        <button
          onClick={() => onTypeChange('partner')}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer animate-on-load fade-left duration-fast ${
            exportType === 'partner'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Partner Report
        </button>
        <button
          onClick={() => onTypeChange('reconciliation')}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer animate-on-load zoom-in duration-normal ${
            exportType === 'reconciliation'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Stripe Reconciliation
        </button>
        <button
          onClick={() => onTypeChange('impact')}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer animate-on-load fade-up duration-light-slow ${
            exportType === 'impact'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Impact Report
        </button>
        <button
          onClick={() => onTypeChange('trends')}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer animate-on-load flip-up duration-slow ${
            exportType === 'trends'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Trend Analysis
        </button>
        <button
          onClick={() => onTypeChange('skuPerformance')}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer animate-on-load fade-down duration-very-slow ${
            exportType === 'skuPerformance'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          SKU Performance
        </button>
      </div>
    </div>
  );
}

export type { ExportType };
