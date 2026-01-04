// Transaction History Component
interface TransactionHistoryProps {
  transactions: any[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 animate-on-load fade-up duration-normal">
        <p className="text-gray-500 animate-on-load zoom-in duration-fast">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto animate-on-load fade-up duration-normal">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-fast">Date</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-fast">
              Transaction ID
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-normal">Amount</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-light-slow">Impact</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-slow">Status</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-slow">Amplivo</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: any) => (
            <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 animate-on-load fade-up duration-normal">
              <td className="py-3 px-4 text-sm text-gray-600 animate-on-load fade-right duration-fast">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-sm text-gray-800 font-mono animate-on-load zoom-in duration-normal">
                {transaction.id.substring(0, 8)}...
              </td>
              <td className="py-3 px-4 text-sm text-gray-800 text-right animate-on-load fade-left duration-light-slow">
                {Number(transaction.amount) > 0
                  ? `€${Number(transaction.amount).toFixed(2)}`
                  : '-'}
              </td>
              <td className="py-3 px-4 text-sm font-semibold text-primary text-right animate-on-load flip-up duration-normal">
                {(Number(transaction.calculatedImpact) / 1000).toFixed(3)} kg
              </td>
              <td className="py-3 px-4 text-center animate-on-load zoom-out duration-slow">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
              <td className="py-3 px-4 text-center animate-on-load flip-down duration-light-slow">
                {transaction.amplivoFlag ? (
                  <span className="text-green-600 font-semibold">✓</span>
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
