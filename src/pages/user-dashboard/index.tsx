// User Dashboard - Display wallet balance and transaction history
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserWallet } from '../../store/walletSlice';
import { fetchUserById } from '../../store/userSlice';
import WalletSummary from './WalletSummary';
import TransactionHistory from './TransactionHistory';
import ImpactVisualization from './ImpactVisualization';

export default function UserDashboard() {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();

  const { currentUser, loading: userLoading } = useAppSelector((state) => state.users);
  const { userWallet, loading: walletLoading } = useAppSelector((state) => state.wallets);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchUserWallet(userId));
    }
  }, [userId, dispatch]);

  if (userLoading || walletLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-on-load zoom-in duration-fast">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 animate-on-load fade-up duration-normal">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userWallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-on-load fade-down duration-normal">
          <p className="text-red-600 animate-on-load zoom-out duration-fast">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const { wallet, transactions } = userWallet;
  const balanceKg = (Number(wallet.currentBalance) / 1000).toFixed(3);
  const totalAccumulatedKg = (Number(wallet.totalAccumulated) / 1000).toFixed(3);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">
            Welcome, {currentUser.firstName}!
          </h1>
          <p className="text-gray-600 animate-on-load fade-left duration-light-slow">{currentUser.email}</p>
        </div>

        <div className="animate-on-load zoom-in duration-light-slow">
          <WalletSummary
            balanceKg={balanceKg}
            currentBalance={Number(wallet.currentBalance)}
            totalAccumulatedKg={totalAccumulatedKg}
            totalAccumulated={Number(wallet.totalAccumulated)}
            transactionCount={transactions.length}
          />
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-slow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-normal">Transaction History</h2>
          <div className="animate-on-load fade-left duration-light-slow">
            <TransactionHistory transactions={transactions} />
          </div>
        </div>

        <div className="animate-on-load flip-up duration-very-slow">
          <ImpactVisualization
            totalAccumulatedKg={totalAccumulatedKg}
            totalAccumulated={Number(wallet.totalAccumulated)}
          />
        </div>
      </div>
    </div>
  );
}
