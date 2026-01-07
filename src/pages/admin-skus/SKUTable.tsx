// SKU Table Component
interface SKUTableProps {
  skus: any[];
  loading: boolean;
  error: string | null;
  onEdit: (sku: any) => void;
  onDelete: (id: string) => void;
  onManageLocalizations: (sku: any) => void;
}

export default function SKUTable({ skus, loading, error, onEdit, onDelete, onManageLocalizations }: SKUTableProps) {
  if (loading && !skus.length) {
    return (
      <div className="text-center py-12 animate-on-load fade-up duration-normal">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 animate-on-load zoom-in duration-fast">Loading SKUs...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600 animate-on-load fade-down duration-normal">{error}</div>;
  }

  if (skus.length === 0) {
    return <div className="text-center py-12 text-gray-500 animate-on-load zoom-out duration-normal">No SKUs found</div>;
  }

  return (
    <div className="overflow-x-auto animate-on-load fade-up duration-normal">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-fast">
              Code
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-fast">
              Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-normal">
              Type
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-light-slow">
              Impact (g)
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-slow">
              Price
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-slow">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {skus.map((sku) => (
            <tr key={sku.id} className="border-b border-gray-100 hover:bg-gray-50 animate-on-load fade-up duration-normal">
              <td className="py-3 px-4 text-sm font-mono text-gray-800 animate-on-load fade-right duration-fast">{sku.code}</td>
              <td className="py-3 px-4 text-sm text-gray-800 animate-on-load zoom-in duration-normal">{sku.name}</td>
              <td className="py-3 px-4 text-sm animate-on-load fade-left duration-light-slow">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    sku.paymentMode === 'CLAIM'
                      ? 'bg-blue-100 text-blue-800'
                      : sku.paymentMode === 'PAY'
                      ? 'bg-green-100 text-green-800'
                      : sku.paymentMode === 'GIFT_CARD'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {sku.paymentMode}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-800 text-right animate-on-load flip-up duration-normal">
                {sku.gramsWeight}g
              </td>
              <td className="py-3 px-4 text-sm text-gray-800 text-right animate-on-load zoom-out duration-slow">
                {Number(sku.price) > 0 ? `€${Number(sku.price).toFixed(2)}` : '-'}
              </td>
              <td className="py-3 px-4 text-center animate-on-load flip-down duration-light-slow">
                <button
                  onClick={() => onEdit(sku)}
                  className="text-blue-600 hover:text-blue-800 mr-3 animate-on-load fade-right duration-fast cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onManageLocalizations(sku)}
                  className="text-purple-600 hover:text-purple-800 mr-3 animate-on-load zoom-in duration-normal cursor-pointer"
                  title="Manage market localizations"
                >
                  Markets
                </button>
                <button
                  onClick={() => onDelete(sku.id)}
                  className="text-red-600 hover:text-red-800 animate-on-load fade-left duration-fast cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
