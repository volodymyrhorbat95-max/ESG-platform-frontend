// Master ID Section Component
// Section 9.2: Global Configuration Management - MASTER_ID
interface MasterIdSectionProps {
  masterId: string | null;
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

export default function MasterIdSection({
  masterId,
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
}: MasterIdSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-very-slow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">
            Master ID
          </h2>
          <p className="text-sm text-gray-600 animate-on-load fade-left duration-normal">
            Master ID for overall network tracking and attribution. Every transaction records this ID for system-wide tracking.
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
            <p className="text-sm text-gray-600 mb-1">Current Master ID</p>
            <p className="text-2xl font-bold text-purple-600 font-mono animate-on-load zoom-in duration-fast">
              {masterId !== null ? masterId : 'Loading...'}
            </p>
            {description && (
              <p className="text-sm text-gray-500 mt-2 animate-on-load fade-left duration-light-slow">
                {description}
              </p>
            )}
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-on-load fade-right duration-slow">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Critical:</strong> This ID is included in every transaction for network-wide attribution tracking.
              Changing it will affect all future transactions.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-on-load fade-down duration-normal">
          <div>
            <label htmlFor="masterId" className="block text-sm font-medium text-gray-700 mb-1">
              Master ID *
            </label>
            <input
              type="text"
              id="masterId"
              value={newValue}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder="e.g., MARCELLO-MASTER-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
            />
            {validationError && (
              <p className="text-sm text-red-600 mt-1 animate-on-load fade-left duration-fast">
                {validationError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="masterIdDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="masterIdDescription"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={2}
              placeholder="Add context or notes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onUpdate}
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load zoom-in duration-normal"
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
