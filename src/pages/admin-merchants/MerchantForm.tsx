// Merchant Form Component - Includes Stripe Account linking
interface MerchantFormProps {
  formData: {
    name: string;
    email: string;
    stripeAccountId: string;
  };
  editingMerchant: any | null;
  loading: boolean;
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function MerchantForm({
  formData,
  editingMerchant,
  loading,
  onFormDataChange,
  onSubmit,
  onCancel,
}: MerchantFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-normal">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">
        {editingMerchant ? 'Edit Merchant' : 'Create New Merchant'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-on-load fade-right duration-light-slow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Merchant Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              placeholder="e.g., Conad Supermarket"
            />
          </div>

          <div className="animate-on-load fade-left duration-light-slow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              placeholder="info@merchant.com"
            />
          </div>

          <div className="md:col-span-2 animate-on-load zoom-in duration-slow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stripe Connect Account ID
            </label>
            <input
              type="text"
              value={formData.stripeAccountId}
              onChange={(e) => onFormDataChange({ ...formData, stripeAccountId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
              placeholder="acct_1234567890"
            />
            <p className="text-xs text-gray-500 mt-1">
              The Stripe Connect account ID for split payments. Leave empty if merchant doesn't receive direct payments.
            </p>
          </div>
        </div>

        {/* Stripe Connect Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 animate-on-load flip-up duration-very-slow">
          <h4 className="font-semibold text-purple-800 mb-2">Stripe Connect Setup</h4>
          <p className="text-sm text-gray-700 mb-2">
            To enable split payments, the merchant needs a Stripe Connect account:
          </p>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Merchant creates a Stripe account at stripe.com</li>
            <li>Connect their account to your platform via Stripe Connect</li>
            <li>Enter their account ID (starts with <code className="bg-white px-1 rounded">acct_</code>) above</li>
          </ol>
          <p className="text-xs text-gray-500 mt-2">
            With split payments, platform fee (10%) is automatically deducted and the rest goes to the merchant.
          </p>
        </div>

        {/* URL Parameters Info */}
        {editingMerchant && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-on-load zoom-out duration-slow">
            <h4 className="font-semibold text-blue-800 mb-2">Integration URL Parameter</h4>
            <p className="text-sm text-gray-600 mb-2">
              Use this parameter in checkout URLs or QR codes:
            </p>
            <code className="block bg-white px-3 py-2 rounded border text-sm font-mono text-blue-700">
              ?merchant={editingMerchant.id}
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Example: https://yoursite.com/?sku=ALLOC-MERCHANT-5&amount=5&merchant={editingMerchant.id}
            </p>
          </div>
        )}

        <div className="flex gap-4 animate-on-load flip-down duration-very-slow">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 cursor-pointer"
          >
            {loading ? 'Saving...' : editingMerchant ? 'Update Merchant' : 'Create Merchant'}
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
