// Gift Card Table Component
interface GiftCardTableProps {
  codes: any[];
  loading: boolean;
}

export default function GiftCardTable({ codes, loading }: GiftCardTableProps) {
  if (loading && !codes.length) {
    return (
      <div className="text-center py-12 animate-on-load fade-up duration-normal">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 animate-on-load zoom-in duration-fast">Loading gift cards...</p>
      </div>
    );
  }

  if (codes.length === 0) {
    return <div className="text-center py-12 text-gray-500 animate-on-load zoom-out duration-normal">No gift cards found</div>;
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
              SKU ID
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-normal">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-light-slow">
              Redeemed At
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-slow">
              Redeemed By
            </th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50 animate-on-load fade-up duration-normal">
              <td className="py-3 px-4 text-sm font-mono text-gray-800 animate-on-load fade-right duration-fast">{code.code}</td>
              <td className="py-3 px-4 text-sm text-gray-600 font-mono animate-on-load zoom-in duration-normal">
                {code.skuId.substring(0, 8)}...
              </td>
              <td className="py-3 px-4 text-center animate-on-load flip-up duration-light-slow">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    code.isRedeemed
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {code.isRedeemed ? 'Redeemed' : 'Available'}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 animate-on-load fade-left duration-slow">
                {code.redeemedAt ? new Date(code.redeemedAt).toLocaleString() : '-'}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 font-mono animate-on-load zoom-out duration-light-slow">
                {code.redeemedBy ? `${code.redeemedBy.substring(0, 8)}...` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
