// Merchant Dashboard - Corporate wallet and ESG tracking
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMerchantWallet } from '../../store/walletSlice';
import OverallStats from './OverallStats';
import DateRangeFilter from './DateRangeFilter';
import TransactionHistory from './TransactionHistory';
import ESGReport from './ESGReport';
import ESGExportButton from './ESGExportButton';

export default function MerchantDashboard() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { merchantWallet, loading } = useAppSelector((state) => state.wallets);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (merchantId) {
      dispatch(fetchMerchantWallet(merchantId));
    }
  }, [merchantId, dispatch]);

  if (loading) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center animate-on-load zoom-in duration-fast">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 animate-on-load fade-up duration-normal">Loading merchant dashboard...</p>
        </div>
      </div>
    );
  }

  if (!merchantWallet) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center animate-on-load fade-down duration-normal">
          <p className="text-red-600 animate-on-load zoom-out duration-fast">Failed to load merchant data</p>
        </div>
      </div>
    );
  }

  const { wallet, transactions } = merchantWallet;
  const balanceKg = (Number(wallet.currentBalance) / 1000).toFixed(3);
  const totalAccumulatedKg = (Number(wallet.totalAccumulated) / 1000).toFixed(3);

  // Filter transactions by date range
  const filteredTransactions = transactions.filter((t: any) => {
    const transactionDate = new Date(t.createdAt).toISOString().split('T')[0];
    return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
  });

  // Calculate period totals
  const periodTotalAmount = filteredTransactions.reduce(
    (sum: number, t: any) => sum + Number(t.amount),
    0
  );
  const periodTotalImpact = filteredTransactions.reduce(
    (sum: number, t: any) => sum + Number(t.calculatedImpact),
    0
  );

  return (
    <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">Merchant Dashboard</h1>
                <p className="text-gray-600 animate-on-load fade-left duration-light-slow">Corporate ESG Impact Tracking</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/merchant/${merchantId}/qr-generator`)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Generate QR Codes
                </button>
                {merchantId && <ESGExportButton merchantId={merchantId} />}
              </div>
            </div>
          </div>

          <div className="animate-on-load zoom-in duration-light-slow">
            <OverallStats
              balanceKg={balanceKg}
              currentBalance={Number(wallet.currentBalance)}
              totalAccumulatedKg={totalAccumulatedKg}
              totalAccumulated={Number(wallet.totalAccumulated)}
              transactionCount={transactions.length}
            />
          </div>

          <div className="animate-on-load fade-up duration-normal">
            <DateRangeFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              periodStats={{
                transactionCount: filteredTransactions.length,
                totalAmount: periodTotalAmount,
                totalImpact: periodTotalImpact,
              }}
            />
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-left duration-slow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-normal">Transaction History</h2>
            <div className="animate-on-load fade-up duration-light-slow">
              <TransactionHistory transactions={filteredTransactions} />
            </div>
          </div>

        <div className="animate-on-load flip-up duration-very-slow">
          <ESGReport
            totalAccumulatedKg={totalAccumulatedKg}
            totalAccumulated={Number(wallet.totalAccumulated)}
            transactionCount={transactions.length}
          />
        </div>
      </div>
    </div>
  );
}
