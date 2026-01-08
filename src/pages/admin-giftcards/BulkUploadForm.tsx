// Bulk Upload Form Component - Supports both auto-generate and manual codes
interface BulkUploadFormProps {
  mode: 'generate' | 'manual';
  quantity: number;
  bulkCodes: string;
  selectedSKU: string;
  skus: any[];
  loading: boolean;
  onModeChange: (mode: 'generate' | 'manual') => void;
  onQuantityChange: (quantity: number) => void;
  onBulkCodesChange: (codes: string) => void;
  onSKUChange: (skuId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function BulkUploadForm({
  mode,
  quantity,
  bulkCodes,
  selectedSKU,
  skus,
  loading,
  onModeChange,
  onQuantityChange,
  onBulkCodesChange,
  onSKUChange,
  onSubmit,
  onCancel,
}: BulkUploadFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load zoom-in duration-normal">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">
        Create Gift Card Codes
      </h2>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6 animate-on-load fade-right duration-normal">
        <button
          type="button"
          onClick={() => onModeChange('generate')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            mode === 'generate'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Auto-Generate Codes
        </button>
        <button
          type="button"
          onClick={() => onModeChange('manual')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            mode === 'manual'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Manual Codes
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="animate-on-load fade-right duration-light-slow">
          <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">
            Select SKU *
          </label>
          <select
            value={selectedSKU}
            onChange={(e) => onSKUChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load flip-up duration-normal"
            required
          >
            <option value="">-- Select SKU --</option>
            {skus
              .filter((sku) => sku.paymentMode === 'GIFT_CARD')
              .map((sku) => (
                <option key={sku.id} value={sku.id}>
                  {sku.name} ({sku.code})
                </option>
              ))}
          </select>
        </div>

        {mode === 'generate' ? (
          <div className="animate-on-load fade-left duration-slow">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-up duration-fast">
              Quantity * (1-1000)
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={quantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
              placeholder="Enter quantity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load zoom-out duration-normal"
              required
            />
            <p className="text-xs text-gray-500 mt-1 animate-on-load fade-right duration-very-fast">
              System will generate unique codes in format: SKU-TIMESTAMP-RANDOM-INDEX
            </p>
          </div>
        ) : (
          <div className="animate-on-load fade-left duration-slow">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-up duration-fast">
              Gift Card Codes * (one per line or comma-separated)
            </label>
            <textarea
              value={bulkCodes}
              onChange={(e) => onBulkCodesChange(e.target.value)}
              placeholder="GC-2024-0001&#10;GC-2024-0002&#10;GC-2024-0003"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg h-40 font-mono text-sm animate-on-load zoom-out duration-normal"
              required
            />
            <p className="text-xs text-gray-500 mt-1 animate-on-load fade-right duration-very-fast">
              Enter codes one per line or separated by commas
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 animate-on-load fade-up duration-slow"
          >
            {loading
              ? mode === 'generate'
                ? 'Generating...'
                : 'Uploading...'
              : mode === 'generate'
              ? `Generate ${quantity || 0} Codes`
              : 'Upload Codes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors animate-on-load fade-up duration-very-slow"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
