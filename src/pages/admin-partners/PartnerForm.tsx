// Partner Form Component
interface PartnerFormProps {
  formData: {
    name: string;
    email: string;
    contactPerson: string;
    phone: string;
    billingAddress: string;
  };
  editingPartner: any | null;
  loading: boolean;
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function PartnerForm({
  formData,
  editingPartner,
  loading,
  onFormDataChange,
  onSubmit,
  onCancel,
}: PartnerFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {editingPartner ? 'Edit Partner' : 'Create New Partner'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              placeholder="e.g., Aware Growth"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              placeholder="billing@partner.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person *
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => onFormDataChange({ ...formData, contactPerson: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+39 02 1234 5678"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Address
            </label>
            <textarea
              value={formData.billingAddress}
              onChange={(e) => onFormDataChange({ ...formData, billingAddress: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={2}
              placeholder="Via Milano 100, 20100 Milan, Italy"
            />
          </div>
        </div>

        {/* URL Parameters Info */}
        {editingPartner && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Integration URL Parameter</h4>
            <p className="text-sm text-gray-600 mb-2">
              Use this parameter in checkout URLs or QR codes to attribute transactions to this partner:
            </p>
            <code className="block bg-white px-3 py-2 rounded border text-sm font-mono text-blue-700">
              ?partner={editingPartner.id}
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Example: https://yoursite.com/?sku=ALLOC-ECOM-01&amount=10&partner={editingPartner.id}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 cursor-pointer"
          >
            {loading ? 'Saving...' : editingPartner ? 'Update Partner' : 'Create Partner'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
