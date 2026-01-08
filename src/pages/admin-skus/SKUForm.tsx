// SKU Form Component
interface SKUFormProps {
  formData: {
    code: string;
    name: string;
    gramsWeight: number;
    price: number;
    paymentMode: 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION';
    requiresValidation: boolean;
    corsairThreshold: number;
    impactMultiplier: number;
  };
  editingSKU: any | null;
  loading: boolean;
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function SKUForm({
  formData,
  editingSKU,
  loading,
  onFormDataChange,
  onSubmit,
  onCancel,
}: SKUFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load zoom-in duration-normal">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">
        {editingSKU ? 'Edit SKU' : 'Create New SKU'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-on-load fade-right duration-fast">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">
              SKU Code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => onFormDataChange({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load zoom-in duration-normal"
              required
            />
          </div>

          <div className="animate-on-load fade-left duration-fast">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load zoom-out duration-normal"
              required
            />
          </div>

          <div className="animate-on-load fade-up duration-normal">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-right duration-fast">
              Payment Mode *
            </label>
            <select
              value={formData.paymentMode}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  paymentMode: e.target.value as any,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load flip-up duration-light-slow"
            >
              <option value="CLAIM">CLAIM (Prepaid Lot)</option>
              <option value="PAY">PAY (Pay-as-you-go)</option>
              <option value="GIFT_CARD">GIFT_CARD (Gift Voucher)</option>
              <option value="ALLOCATION">ALLOCATION (Environmental Allocation)</option>
            </select>
          </div>

          <div className="animate-on-load fade-down duration-normal">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-left duration-fast">
              Grams Weight *
            </label>
            <input
              type="number"
              value={formData.gramsWeight}
              onChange={(e) =>
                onFormDataChange({ ...formData, gramsWeight: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load flip-down duration-light-slow"
              required
            />
          </div>

          <div className="animate-on-load zoom-in duration-light-slow">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-up duration-fast">
              Price (EUR)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                onFormDataChange({ ...formData, price: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load fade-right duration-normal"
            />
          </div>

          <div className="animate-on-load zoom-out duration-light-slow">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-fast">
              Corsair Connect Threshold (EUR)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.corsairThreshold}
              onChange={(e) =>
                onFormDataChange({ ...formData, corsairThreshold: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load fade-left duration-normal"
            />
          </div>

          <div className="animate-on-load flip-up duration-slow">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-right duration-fast">
              Impact Multiplier (for ALLOCATION)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.impactMultiplier}
              onChange={(e) =>
                onFormDataChange({ ...formData, impactMultiplier: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg animate-on-load zoom-in duration-normal"
            />
          </div>

          <div className="flex items-center animate-on-load flip-down duration-slow">
            <input
              type="checkbox"
              checked={formData.requiresValidation}
              onChange={(e) =>
                onFormDataChange({ ...formData, requiresValidation: e.target.checked })
              }
              className="mr-2 animate-on-load zoom-out duration-fast"
            />
            <label className="text-sm text-gray-700 animate-on-load fade-left duration-normal">Requires Validation</label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 animate-on-load fade-up duration-slow"
          >
            {loading ? 'Saving...' : editingSKU ? 'Update SKU' : 'Create SKU'}
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
