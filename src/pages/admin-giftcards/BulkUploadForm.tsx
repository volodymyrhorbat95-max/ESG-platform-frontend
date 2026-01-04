// Bulk Upload Form Component
interface BulkUploadFormProps {
  bulkCodes: string;
  selectedSKU: string;
  skus: any[];
  loading: boolean;
  onBulkCodesChange: (codes: string) => void;
  onSKUChange: (skuId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function BulkUploadForm({
  bulkCodes,
  selectedSKU,
  skus,
  loading,
  onBulkCodesChange,
  onSKUChange,
  onSubmit,
  onCancel,
}: BulkUploadFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load zoom-in duration-normal">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">Bulk Upload Gift Card Codes</h2>
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

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 animate-on-load fade-up duration-slow"
          >
            {loading ? 'Uploading...' : 'Upload Codes'}
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
