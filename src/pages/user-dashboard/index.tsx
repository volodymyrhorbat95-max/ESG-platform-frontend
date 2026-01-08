// User Dashboard - Display wallet balance and transaction history
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserWallet } from '../../store/walletSlice';
import { fetchUserById } from '../../store/userSlice';
import { fetchUserLinks } from '../../store/shareableLinkSlice';
import WalletSummary from './WalletSummary';
import TransactionHistory from './TransactionHistory';
import ImpactVisualization from './ImpactVisualization';
import SocialShare from './SocialShare';
import { FiHome, FiUser, FiPieChart } from 'react-icons/fi';

export default function UserDashboard() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentUser, loading: userLoading } = useAppSelector((state) => state.users);
  const { userWallet, loading: walletLoading } = useAppSelector((state) => state.wallets);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchUserWallet(userId));
      dispatch(fetchUserLinks(userId));
    }
  }, [userId, dispatch]);

  if (userLoading || walletLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-on-load zoom-in duration-fast">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 animate-on-load fade-up duration-normal">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userWallet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-on-load fade-down duration-normal">
          <p className="text-red-600 animate-on-load zoom-out duration-fast">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const { wallet, transactions } = userWallet;
  const balanceKg = (Number(wallet.currentBalance) / 1000).toFixed(3);
  const totalAccumulatedKg = (Number(wallet.totalAccumulated) / 1000).toFixed(3);

  // Secondary navigation items for user pages
  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: `/dashboard/${userId}`, label: 'Dashboard', icon: FiPieChart },
    { path: `/profile/${userId}`, label: 'Profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen">
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <span className="text-sm font-medium text-gray-600">User Dashboard</span>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                  (item.path.includes('/dashboard/') && location.pathname.includes('/dashboard/'));
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive && !item.path.includes('/profile/')
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">
                  Welcome, {currentUser.firstName}!
                </h1>
                <p className="text-gray-600 animate-on-load fade-left duration-light-slow">{currentUser.email}</p>
              </div>
              <button
                onClick={() => navigate(`/profile/${userId}`)}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Edit Profile
              </button>
            </div>
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

          {/* Social Sharing */}
          {userId && (
            <div className="animate-on-load fade-up duration-very-slow">
              <SocialShare
                userId={userId}
                totalImpactKg={totalAccumulatedKg}
                plasticBottles={Math.floor(Number(wallet.totalAccumulated) / 25)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
