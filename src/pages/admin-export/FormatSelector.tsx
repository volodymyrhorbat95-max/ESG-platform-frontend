// Format Selector Component
interface FormatSelectorProps {
  format: 'xlsx' | 'csv';
  onFormatChange: (format: 'xlsx' | 'csv') => void;
}

export default function FormatSelector({ format, onFormatChange }: FormatSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
      <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-left duration-fast">File Format</h2>
      <div className="flex gap-4 animate-on-load flip-up duration-light-slow">
        <button
          onClick={() => onFormatChange('xlsx')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-normal ${
            format === 'xlsx'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Excel (.xlsx)
        </button>
        <button
          onClick={() => onFormatChange('csv')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors animate-on-load zoom-out duration-light-slow ${
            format === 'csv'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          CSV (.csv)
        </button>
      </div>
    </div>
  );
}
