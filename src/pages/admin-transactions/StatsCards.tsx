// Transaction Stats Cards Component
interface StatsCardsProps {
  totalTransactions: number;
  totalAmount: number;
  totalImpact: number;
  corsairConnectCount: number;
}

export default function StatsCards({
  totalTransactions,
  totalAmount,
  totalImpact,
  corsairConnectCount,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-right duration-fast">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-down duration-very-fast">Total Transactions</p>
        <p className="text-4xl font-bold animate-on-load zoom-in duration-normal">{totalTransactions}</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-up duration-normal">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-left duration-very-fast">Total Amount</p>
        <p className="text-4xl font-bold animate-on-load flip-up duration-light-slow">€{totalAmount.toFixed(2)}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-down duration-light-slow">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-right duration-very-fast">Total Impact</p>
        <p className="text-4xl font-bold animate-on-load zoom-out duration-normal">{(totalImpact / 1000).toFixed(2)} kg</p>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-left duration-slow">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-up duration-very-fast">Corsair Connect</p>
        <p className="text-4xl font-bold animate-on-load flip-down duration-normal">{corsairConnectCount}</p>
      </div>
    </div>
  );
}
