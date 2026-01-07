// Merchant Table Component
interface Merchant {
  id: string;
  name: string;
  email: string;
  stripeAccountId: string | null;
  isActive: boolean;
  createdAt: string;
}

interface MerchantTableProps {
  merchants: Merchant[];
  loading: boolean;
  error: string | null;
  onEdit: (merchant: Merchant) => void;
  onDelete: (id: string) => void;
  onCopyId: (id: string) => void;
}

export default function MerchantTable({
  merchants,
  loading,
  error,
  onEdit,
  onDelete,
  onCopyId,
}: MerchantTableProps) {
  if (loading && !merchants.length) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading merchants...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (merchants.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No merchants found. Create your first merchant to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Stripe Account</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Merchant ID</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((merchant) => (
            <tr key={merchant.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-800">{merchant.name}</div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{merchant.email}</td>
              <td className="py-3 px-4 text-center">
                {merchant.stripeAccountId ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Not Connected
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    merchant.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {merchant.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onCopyId(merchant.id)}
                  className="text-xs font-mono bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
                  title="Click to copy Merchant ID"
                >
                  {merchant.id.substring(0, 8)}...
                </button>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onEdit(merchant)}
                  className="text-blue-600 hover:text-blue-800 mr-3 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(merchant.id)}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
