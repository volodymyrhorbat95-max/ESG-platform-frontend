// Wallet Summary Component
// Section 6.2 & 6.3: Added status tracking and progress indicator
interface WalletSummaryProps {
  balanceKg: string;
  currentBalance: number;
  totalAccumulatedKg: string;
  totalAccumulated: number;
  transactionCount: number;
  totalAmountSpent: number; // Section 6.1: Total euros spent
  certifiedAssetStatus: boolean; // Section 6.2: Certified asset status
  corsairThreshold: number; // €10 threshold from global config
}

export default function WalletSummary({
  balanceKg,
  currentBalance,
  totalAccumulatedKg,
  totalAccumulated,
  transactionCount,
  totalAmountSpent,
  certifiedAssetStatus,
  corsairThreshold = 10,
}: WalletSummaryProps) {
  // Section 6.2: Calculate progress toward threshold
  const progressPercentage = Math.min((totalAmountSpent / corsairThreshold) * 100, 100);
  const remainingAmount = Math.max(corsairThreshold - totalAmountSpent, 0);

  return (
    <div className="space-y-6 mb-6">
      {/* Section 6.3: Status Indicator - Progress toward €10 threshold */}
      {!certifiedAssetStatus && (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-down duration-fast">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800 animate-on-load fade-right duration-very-fast">
              Accumulation Phase
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 animate-on-load zoom-in duration-fast">
              {progressPercentage.toFixed(0)}% to Certified Asset
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3 animate-on-load fade-left duration-normal">
            You've spent €{totalAmountSpent.toFixed(2)} of €{corsairThreshold.toFixed(2)}.
            {remainingAmount > 0 && ` €${remainingAmount.toFixed(2)} more to unlock certified asset status!`}
          </p>
          {/* Section 6.3: Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden animate-on-load zoom-out duration-light-slow">
            <div
              className="bg-gradient-to-r from-yellow-400 to-green-500 h-3 rounded-full transition-all duration-500 animate-on-load fade-right duration-slow"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Section 6.3: Certified Asset Status Badge with Corsair Connect Link (Section 11.1) */}
      {certifiedAssetStatus && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white animate-on-load flip-up duration-normal">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 animate-on-load zoom-in duration-fast" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-xl font-bold animate-on-load fade-right duration-very-fast">Certified Asset Unlocked!</h3>
                <p className="text-sm opacity-90 animate-on-load fade-left duration-fast">
                  You've contributed €{totalAmountSpent.toFixed(2)} and now have access to Corsair Connect
                </p>
              </div>
            </div>
            {/* Section 11.1: Corsair Connect Account Link (if ≥€10) */}
            <a
              href="https://corsairconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors animate-on-load zoom-in duration-light-slow whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="font-semibold">Corsair Connect</span>
            </a>
          </div>
        </div>
      )}

      {/* Wallet Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
}
