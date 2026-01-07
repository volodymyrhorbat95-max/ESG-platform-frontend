// Partner Table Component
interface Partner {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
  phone?: string;
  billingAddress?: string;
  isActive: boolean;
  createdAt: string;
}

interface PartnerTableProps {
  partners: Partner[];
  loading: boolean;
  error: string | null;
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
  onCopyId: (id: string) => void;
}

export default function PartnerTable({
  partners,
  loading,
  error,
  onEdit,
  onDelete,
  onCopyId,
}: PartnerTableProps) {
  if (loading && !partners.length) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading partners...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (partners.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No partners found. Create your first partner to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Partner ID</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-800">{partner.name}</div>
                {partner.phone && (
                  <div className="text-xs text-gray-500">{partner.phone}</div>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-gray-800">{partner.contactPerson}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{partner.email}</td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    partner.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {partner.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onCopyId(partner.id)}
                  className="text-xs font-mono bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
                  title="Click to copy Partner ID"
                >
                  {partner.id.substring(0, 8)}...
                </button>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onEdit(partner)}
                  className="text-blue-600 hover:text-blue-800 mr-3 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(partner.id)}
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
