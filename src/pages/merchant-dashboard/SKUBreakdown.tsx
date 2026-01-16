// SKU Breakdown Component - Section 11.2
// Shows breakdown by SKU and number of customers engaged
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  calculatedImpact: number;
  sku?: {
    code: string;
    name: string;
  };
}

interface SKUBreakdownProps {
  transactions: Transaction[];
}

interface SKUStats {
  code: string;
  name: string;
  transactionCount: number;
  totalAmount: number;
  totalImpact: number;
}

export default function SKUBreakdown({ transactions }: SKUBreakdownProps) {
  // Calculate SKU breakdown
  const skuBreakdown: Record<string, SKUStats> = {};

  transactions.forEach((t) => {
    const code = t.sku?.code || 'Unknown';
    const name = t.sku?.name || 'Unknown SKU';

    if (!skuBreakdown[code]) {
      skuBreakdown[code] = {
        code,
        name,
        transactionCount: 0,
        totalAmount: 0,
        totalImpact: 0,
      };
    }

    skuBreakdown[code].transactionCount += 1;
    skuBreakdown[code].totalAmount += Number(t.amount);
    skuBreakdown[code].totalImpact += Number(t.calculatedImpact);
  });

  const skuStats = Object.values(skuBreakdown).sort(
    (a, b) => b.totalImpact - a.totalImpact
  );

  // Calculate unique customers engaged
  const uniqueCustomers = new Set(transactions.map((t) => t.userId)).size;

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-on-load fade-up duration-normal">
        <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-fast">
          SKU Performance & Customer Engagement
        </h3>
        <p className="text-gray-500 text-center py-8 animate-on-load zoom-in duration-normal">
          No transaction data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-on-load fade-up duration-normal">
      <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-fast">
        SKU Performance & Customer Engagement
      </h3>

      {/* Section 11.2: Number of customers engaged */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 mb-6 text-white animate-on-load zoom-in duration-light-slow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <p className="text-sm opacity-90">Customers Engaged</p>
              <p className="text-3xl font-bold">{uniqueCustomers}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Transactions per Customer</p>
            <p className="text-2xl font-bold">
              {(transactions.length / uniqueCustomers).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Section 11.2: Breakdown by SKU */}
      <div className="overflow-x-auto animate-on-load fade-up duration-slow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-fast">
                SKU Code
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-fast">
                Name
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-normal">
                Transactions
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-light-slow">
                Revenue (€)
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-slow">
                Impact (kg)
              </th>
            </tr>
          </thead>
          <tbody>
            {skuStats.map((sku) => (
              <tr
                key={sku.code}
                className="border-b border-gray-100 hover:bg-gray-50 animate-on-load fade-up duration-normal"
              >
                <td className="py-3 px-4 text-sm font-mono text-gray-800 animate-on-load fade-right duration-fast">
                  {sku.code}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 animate-on-load zoom-in duration-normal">
                  {sku.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800 text-right animate-on-load flip-up duration-light-slow">
                  {sku.transactionCount}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800 text-right animate-on-load fade-left duration-slow">
                  €{sku.totalAmount.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-primary text-right animate-on-load zoom-out duration-very-slow">
                  {(sku.totalImpact / 1000).toFixed(3)} kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual breakdown bars */}
      <div className="mt-6 space-y-3 animate-on-load fade-up duration-very-slow">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Impact Distribution by SKU</h4>
        {skuStats.slice(0, 5).map((sku) => {
          const totalImpact = skuStats.reduce((sum, s) => sum + s.totalImpact, 0);
          const percentage = totalImpact > 0 ? (sku.totalImpact / totalImpact) * 100 : 0;

          return (
            <div key={sku.code} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-24 truncate">{sku.code}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-12 text-right">{percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
