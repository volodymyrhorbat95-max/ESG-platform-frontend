// Transaction Table Component
interface TransactionTableProps {
  transactions: any[];
  loading: boolean;
}

export default function TransactionTable({ transactions, loading }: TransactionTableProps) {
  if (loading) {
    return (
      <div className="text-center py-12 animate-on-load fade-up duration-normal">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 animate-on-load fade-down duration-fast">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return <div className="text-center py-12 text-gray-500 animate-on-load zoom-in duration-normal">No transactions found</div>;
  }

  return (
    <div className="overflow-x-auto animate-on-load fade-up duration-normal">
      <table className="w-full text-sm animate-on-load zoom-in duration-light-slow">
        <thead className="animate-on-load fade-down duration-fast">
          <tr className="border-b border-gray-200 animate-on-load fade-right duration-normal">
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700 animate-on-load fade-down duration-very-fast">
              Date
            </th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700 animate-on-load fade-down duration-fast">
              Transaction ID
            </th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700 animate-on-load fade-down duration-normal">
              User ID
            </th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700 animate-on-load fade-down duration-light-slow">
              SKU ID
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-700 animate-on-load fade-down duration-slow">
              Amount
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-700 animate-on-load fade-down duration-very-slow">
              Impact
            </th>
            <th className="text-center py-3 px-2 text-xs font-semibold text-gray-700 animate-on-load zoom-in duration-normal">
              Status
            </th>
            <th className="text-center py-3 px-2 text-xs font-semibold text-gray-700 animate-on-load zoom-out duration-fast">
              Amplivo
            </th>
          </tr>
        </thead>
        <tbody className="animate-on-load fade-up duration-light-slow">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 animate-on-load fade-left duration-normal">
              <td className="py-3 px-2 text-xs text-gray-600 animate-on-load fade-right duration-very-fast">
                {new Date(transaction.createdAt).toLocaleString()}
              </td>
              <td className="py-3 px-2 text-xs text-gray-800 font-mono animate-on-load fade-up duration-fast">
                {transaction.id.substring(0, 8)}...
              </td>
              <td className="py-3 px-2 text-xs text-gray-600 font-mono animate-on-load zoom-in duration-normal">
                {transaction.userId.substring(0, 8)}...
              </td>
              <td className="py-3 px-2 text-xs text-gray-600 font-mono animate-on-load fade-left duration-light-slow">
                {transaction.skuId.substring(0, 8)}...
              </td>
              <td className="py-3 px-2 text-xs text-gray-800 text-right animate-on-load flip-up duration-normal">
                {Number(transaction.amount) > 0
                  ? `€${Number(transaction.amount).toFixed(2)}`
                  : '-'}
              </td>
              <td className="py-3 px-2 text-xs font-semibold text-primary text-right animate-on-load zoom-out duration-fast">
                {(Number(transaction.calculatedImpact) / 1000).toFixed(3)} kg
              </td>
              <td className="py-3 px-2 text-center animate-on-load fade-down duration-light-slow">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold animate-on-load flip-down duration-normal ${
                    transaction.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : transaction.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : transaction.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {transaction.paymentStatus}
                </span>
              </td>
              <td className="py-3 px-2 text-center animate-on-load fade-up duration-slow">
                {transaction.amplivoFlag ? (
                  <span className="text-green-600 font-bold text-lg animate-on-load zoom-in duration-fast">✓</span>
                ) : (
                  <span className="text-gray-300 animate-on-load fade-right duration-normal">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
