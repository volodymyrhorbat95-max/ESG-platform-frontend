// CSR Price Configuration Section


interface CSRPriceSectionProps {
  currentCSRPrice: number | null;
  description: string;
  editMode: boolean;
  newPrice: string;
  validationError: string;
  loading: boolean;
  onEditModeChange: (editMode: boolean) => void;
  onPriceChange: (price: string) => void;
  onDescriptionChange: (desc: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
  onViewHistory: () => void;
}

export default function CSRPriceSection({
  currentCSRPrice,
  description,
  editMode,
  newPrice,
  validationError,
  loading,
  onEditModeChange,
  onPriceChange,
  onDescriptionChange,
  onUpdate,
  onCancel,
  onViewHistory,
}: CSRPriceSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-normal">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 animate-on-load fade-right duration-fast">Current CSR Price</h2>
          <p className="text-sm text-gray-600 mt-1 animate-on-load fade-right duration-light-slow">Price per kilogram of plastic removed (in EUR)</p>
        </div>
        {!editMode && (
          <div className="flex gap-3">
            <button
              onClick={onViewHistory}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-light-slow flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View History
            </button>
            <button
              onClick={() => onEditModeChange(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-normal"
            >
              Edit Price
            </button>
          </div>
        )}
      </div>

      {!editMode ? (
        // View Mode
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg animate-on-load zoom-in duration-light-slow">
          <div className="text-center">
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-2 animate-on-load fade-down duration-fast">Current Price</p>
            <p className="text-6xl font-bold text-green-600 mb-2 animate-on-load zoom-in duration-normal">
              €{currentCSRPrice !== null ? currentCSRPrice.toFixed(2) : '0.00'}
            </p>
            <p className="text-xl text-gray-700 animate-on-load fade-up duration-light-slow">per kilogram</p>

            {description && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 animate-on-load fade-up duration-slow">
                <p className="text-sm text-gray-700">{description}</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 animate-on-load flip-up duration-slow">
              <p className="text-sm text-yellow-800 font-medium">
                This price is used for all CLAIM, PAY, and GIFT_CARD transaction calculations
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="space-y-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              New Price (EUR/kg) *
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              value={newPrice}
              onChange={(e) => onPriceChange(e.target.value)}
              className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                validationError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.11"
            />
            {validationError && <p className="text-red-500 text-sm mt-1">{validationError}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Current price per kg of plastic removed (in EUR). Used for dynamic impact calculation."
            />
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold mb-2">Critical Warning</p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>This change affects ALL FUTURE transaction calculations</li>
              <li>Existing transactions remain unchanged (already calculated)</li>
              <li>
                Impact formula: <code className="bg-red-100 px-1 rounded">kg = amount / CURRENT_CSR_PRICE</code>
              </li>
              <li>Example: €25 at €0.11/kg = 227.27kg | €25 at €0.15/kg = 166.67kg</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onUpdate}
              disabled={loading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
