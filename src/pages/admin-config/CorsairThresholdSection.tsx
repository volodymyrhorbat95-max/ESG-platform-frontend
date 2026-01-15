// Corsair Threshold Section Component
// Section 9.2: Global Configuration Management - CORSAIR_THRESHOLD
interface CorsairThresholdSectionProps {
  corsairThreshold: number | null;
  description: string;
  editMode: boolean;
  newValue: string;
  validationError: string;
  loading: boolean;
  onEditModeChange: (value: boolean) => void;
  onValueChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
}

export default function CorsairThresholdSection({
  corsairThreshold,
  description,
  editMode,
  newValue,
  validationError,
  loading,
  onEditModeChange,
  onValueChange,
  onDescriptionChange,
  onUpdate,
  onCancel,
}: CorsairThresholdSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-left duration-slow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">
            Corsair Connect Threshold
          </h2>
          <p className="text-sm text-gray-600 animate-on-load fade-left duration-normal">
            Minimum transaction amount in euros to trigger Corsair Connect flag and certified asset status.
            Transactions ≥ this amount set corsairConnectFlag = true on user.
          </p>
        </div>
        {!editMode && (
          <button
            onClick={() => onEditModeChange(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors animate-on-load zoom-in duration-light-slow"
          >
            Edit
          </button>
        )}
      </div>

      {!editMode ? (
        <div className="animate-on-load fade-up duration-normal">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Current Threshold</p>
            <p className="text-3xl font-bold text-blue-600 animate-on-load zoom-in duration-fast">
              {corsairThreshold !== null ? `€${corsairThreshold.toFixed(2)}` : 'Loading...'}
            </p>
            {description && (
              <p className="text-sm text-gray-500 mt-2 animate-on-load fade-right duration-light-slow">
                {description}
              </p>
            )}
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-on-load fade-left duration-slow">
            <p className="text-sm text-gray-700">
              <strong>Impact:</strong> Transactions at or above this amount unlock full certified environmental assets
              and Corsair Connect account creation for users. Users below this threshold are in "accumulation" status.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-on-load fade-down duration-normal">
          <div>
            <label htmlFor="corsairThreshold" className="block text-sm font-medium text-gray-700 mb-1">
              Threshold Amount (EUR) *
            </label>
            <input
              type="number"
              id="corsairThreshold"
              value={newValue}
              onChange={(e) => onValueChange(e.target.value)}
              step="0.01"
              min="0.01"
              placeholder="e.g., 10.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {validationError && (
              <p className="text-sm text-red-600 mt-1 animate-on-load fade-left duration-fast">
                {validationError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="corsairDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="corsairDescription"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={2}
              placeholder="Add context or notes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onUpdate}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load zoom-in duration-normal"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 animate-on-load zoom-in duration-light-slow"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
