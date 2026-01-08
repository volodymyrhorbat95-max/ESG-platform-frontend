// Gift Card Table Component - Shows SKU code/name and supports bulk selection
interface GiftCardTableProps {
  codes: any[];
  loading: boolean;
  selectedCodes: string[];
  onInvalidate?: (code: string) => void;
  onSelectCode: (code: string) => void;
  onSelectAll: (selectAll: boolean) => void;
}

export default function GiftCardTable({
  codes,
  loading,
  selectedCodes,
  onInvalidate,
  onSelectCode,
  onSelectAll,
}: GiftCardTableProps) {
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

  // Get available (non-redeemed) codes for "select all" logic
  const availableCodes = codes.filter((c) => !c.isRedeemed);
  const allAvailableSelected =
    availableCodes.length > 0 && availableCodes.every((c) => selectedCodes.includes(c.code));

  return (
    <div className="overflow-x-auto animate-on-load fade-up duration-normal">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-fast">
              <input
                type="checkbox"
                checked={allAvailableSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                title="Select all available codes"
              />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-fast">
              Code
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-fast">
              SKU
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
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-slow">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50 animate-on-load fade-up duration-normal">
              <td className="py-3 px-4 animate-on-load fade-right duration-very-fast">
                <input
                  type="checkbox"
                  checked={selectedCodes.includes(code.code)}
                  onChange={() => onSelectCode(code.code)}
                  disabled={code.isRedeemed}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary disabled:opacity-50"
                />
              </td>
              <td className="py-3 px-4 text-sm font-mono text-gray-800 animate-on-load fade-right duration-fast">{code.code}</td>
              <td className="py-3 px-4 text-sm text-gray-600 animate-on-load zoom-in duration-normal">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{code.sku?.code || '-'}</span>
                  <span className="text-xs text-gray-500">{code.sku?.name || '-'}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-center animate-on-load flip-up duration-light-slow">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    code.isRedeemed
                      ? code.redeemedBy
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {code.isRedeemed ? (code.redeemedBy ? 'Redeemed' : 'Invalidated') : 'Available'}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 animate-on-load fade-left duration-slow">
                {code.redeemedAt ? new Date(code.redeemedAt).toLocaleString() : '-'}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 font-mono animate-on-load zoom-out duration-light-slow">
                {code.redeemedBy ? `${code.redeemedBy.substring(0, 8)}...` : '-'}
              </td>
              <td className="py-3 px-4 text-center animate-on-load zoom-in duration-slow">
                {!code.isRedeemed && onInvalidate ? (
                  <button
                    onClick={() => onInvalidate(code.code)}
                    className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                  >
                    Invalidate
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
