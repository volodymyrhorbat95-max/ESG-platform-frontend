// Platform Fee Configuration Section


interface PlatformFeeSectionProps {
  platformFee: number | null;
  feeDescription: string;
  editFeeMode: boolean;
  newFee: string;
  feeValidationError: string;
  loading: boolean;
  onEditModeChange: (editMode: boolean) => void;
  onFeeChange: (fee: string) => void;
  onDescriptionChange: (desc: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
}

export default function PlatformFeeSection({
  platformFee,
  feeDescription,
  editFeeMode,
  newFee,
  feeValidationError,
  loading,
  onEditModeChange,
  onFeeChange,
  onDescriptionChange,
  onUpdate,
  onCancel,
}: PlatformFeeSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-on-load fade-up duration-light-slow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 animate-on-load fade-left duration-fast">Platform Fee Percentage</h2>
          <p className="text-sm text-gray-600 mt-1 animate-on-load fade-left duration-light-slow">CSR26 platform fee for Stripe split payments</p>
        </div>
        {!editFeeMode && (
          <button
            onClick={() => onEditModeChange(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-normal"
          >
            Edit Fee
          </button>
        )}
      </div>

      {!editFeeMode ? (
        // View Mode
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg animate-on-load zoom-in duration-light-slow">
          <div className="text-center">
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-2 animate-on-load fade-down duration-fast">Current Fee</p>
            <p className="text-6xl font-bold text-blue-600 mb-2 animate-on-load zoom-in duration-normal">
              {platformFee !== null ? (platformFee * 100).toFixed(0) : '10'}%
            </p>
            <p className="text-xl text-gray-700 animate-on-load fade-up duration-light-slow">of transaction amount</p>

            {feeDescription && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 animate-on-load fade-up duration-slow">
                <p className="text-sm text-gray-700">{feeDescription}</p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-white rounded-lg border border-gray-200 animate-on-load fade-right duration-slow">
                <p className="text-sm text-gray-600">Platform (CSR26)</p>
                <p className="text-lg font-bold text-blue-600">
                  {platformFee !== null ? (platformFee * 100).toFixed(0) : '10'}%
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200 animate-on-load fade-left duration-slow">
                <p className="text-sm text-gray-600">Merchant</p>
                <p className="text-lg font-bold text-green-600">
                  {platformFee !== null ? ((1 - platformFee) * 100).toFixed(0) : '90'}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="space-y-6">
          <div>
            <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-2">
              Platform Fee (%) *
            </label>
            <input
              type="number"
              id="fee"
              step="1"
              min="0"
              max="100"
              value={newFee}
              onChange={(e) => onFeeChange(e.target.value)}
              className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                feeValidationError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="10"
            />
            {feeValidationError && <p className="text-red-500 text-sm mt-1">{feeValidationError}</p>}
          </div>

          <div>
            <label htmlFor="feeDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="feeDescription"
              value={feeDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Platform fee percentage for Stripe split payments."
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-semibold mb-2">Split Payment Info</p>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>This fee is applied to all PAY flow transactions via Stripe Connect</li>
              <li>Example: 10% fee on €100 = €10 to CSR26, €90 to merchant</li>
              <li>Changes affect all future transactions only</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onUpdate}
              disabled={loading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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
