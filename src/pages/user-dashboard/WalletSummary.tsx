// Wallet Summary Component
interface WalletSummaryProps {
  balanceKg: string;
  currentBalance: number;
  totalAccumulatedKg: string;
  totalAccumulated: number;
  transactionCount: number;
}

export default function WalletSummary({
  balanceKg,
  currentBalance,
  totalAccumulatedKg,
  totalAccumulated,
  transactionCount,
}: WalletSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Current Balance */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-right duration-fast">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-down duration-very-fast">Current Balance</p>
        <p className="text-4xl font-bold animate-on-load zoom-in duration-normal">{balanceKg} kg</p>
        <p className="text-sm opacity-75 mt-1 animate-on-load fade-up duration-light-slow">{currentBalance.toFixed(0)} grams</p>
      </div>

      {/* Total Accumulated */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-up duration-normal">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-left duration-very-fast">Total Impact</p>
        <p className="text-4xl font-bold animate-on-load flip-up duration-light-slow">{totalAccumulatedKg} kg</p>
        <p className="text-sm opacity-75 mt-1 animate-on-load fade-right duration-slow">{totalAccumulated.toFixed(0)} grams</p>
      </div>

      {/* Total Transactions */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-left duration-light-slow">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-right duration-very-fast">Total Transactions</p>
        <p className="text-4xl font-bold animate-on-load zoom-out duration-normal">{transactionCount}</p>
        <p className="text-sm opacity-75 mt-1 animate-on-load fade-down duration-slow">contributions</p>
      </div>
    </div>
  );
}
