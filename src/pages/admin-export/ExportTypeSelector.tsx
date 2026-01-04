// Export Type Selector Component
interface ExportTypeSelectorProps {
  exportType: 'amplivo' | 'partner';
  onTypeChange: (type: 'amplivo' | 'partner') => void;
}

export default function ExportTypeSelector({ exportType, onTypeChange }: ExportTypeSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-normal">
      <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-fast">Export Type</h2>
      <div className="flex gap-4 animate-on-load zoom-in duration-light-slow">
        <button
          onClick={() => onTypeChange('amplivo')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors animate-on-load fade-left duration-normal ${
            exportType === 'amplivo'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Amplivo Export
        </button>
        <button
          onClick={() => onTypeChange('partner')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors animate-on-load fade-right duration-light-slow ${
            exportType === 'partner'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Partner Report
        </button>
      </div>
    </div>
  );
}
