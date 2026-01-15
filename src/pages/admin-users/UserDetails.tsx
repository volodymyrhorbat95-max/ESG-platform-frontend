// User Details Component - View user info, transaction history, and edit profile
// CRITICAL: Follows end-to-end data flow - NO direct API calls
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserById, updateUser } from '../../store/userSlice';
import { fetchUserTransactions } from '../../store/transactionSlice';
import { fetchUserWallet } from '../../store/walletSlice';
import WalletAdjustmentModal from './WalletAdjustmentModal';

interface UserDetailsProps {
  userId: string;
  onClose: () => void;
}

interface EditFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state: string;
}

export default function UserDetails({ userId, onClose }: UserDetailsProps) {
  const dispatch = useAppDispatch();
  const { currentUser, loading: userLoading } = useAppSelector((state) => state.users);
  const { transactions, loading: txLoading } = useAppSelector((state) => state.transactions);
  const { userWallet } = useAppSelector((state) => state.wallets);
  const [activeTab, setActiveTab] = useState<'info' | 'transactions' | 'edit'>('info');
  const [editForm, setEditForm] = useState<EditFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [walletAdjustmentModalOpen, setWalletAdjustmentModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserById(userId));
    dispatch(fetchUserTransactions(userId));
    dispatch(fetchUserWallet(userId));
  }, [dispatch, userId]);

  // Populate edit form when user data loads
  useEffect(() => {
    if (currentUser) {
      setEditForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        dateOfBirth: currentUser.dateOfBirth
          ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0]
          : '',
        street: currentUser.street || '',
        city: currentUser.city || '',
        postalCode: currentUser.postalCode || '',
        country: currentUser.country || '',
        state: currentUser.state || '',
      });
    }
  }, [currentUser]);

  const user = currentUser;
  const userTransactions = transactions.filter((t) => t.userId === userId);

  // Calculate totals
  const totalImpact = userTransactions.reduce((sum, t) => sum + Number(t.calculatedImpact || 0), 0);
  const totalAmount = userTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError(null);

    try {
      // Build updates object - only include non-empty values
      const updates: Record<string, string> = {};
      if (editForm.firstName) updates.firstName = editForm.firstName;
      if (editForm.lastName) updates.lastName = editForm.lastName;
      if (editForm.dateOfBirth) updates.dateOfBirth = editForm.dateOfBirth;
      if (editForm.street) updates.street = editForm.street;
      if (editForm.city) updates.city = editForm.city;
      if (editForm.postalCode) updates.postalCode = editForm.postalCode;
      if (editForm.country) updates.country = editForm.country;
      if (editForm.state) updates.state = editForm.state;

      const result = await dispatch(updateUser({ id: userId, updates })).unwrap();
      if (result) {
        setSaveSuccess(true);
        // Refresh user data
        dispatch(fetchUserById(userId));
      }
    } catch (err: any) {
      setSaveError(err || 'Failed to update user profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-on-load zoom-in duration-fast">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold animate-on-load fade-right duration-fast">User Details</h2>
              <p className="text-green-100 mt-1 animate-on-load fade-left duration-normal">{user?.email || 'Loading...'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'info'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              User Information
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'transactions'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Transaction History ({userTransactions.length})
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'edit'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {userLoading ? (
            <div className="text-center py-12 animate-on-load fade-up duration-normal">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading user data...</p>
            </div>
          ) : activeTab === 'info' ? (
            // User Information Tab
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 animate-on-load fade-up duration-fast">
                  <p className="text-sm text-green-600">Total Impact</p>
                  <p className="text-2xl font-bold text-green-800">{(totalImpact / 1000).toFixed(2)} kg</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 animate-on-load fade-up duration-normal">
                  <p className="text-sm text-blue-600">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-800">EUR {totalAmount.toFixed(2)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 animate-on-load fade-up duration-light-slow">
                  <p className="text-sm text-purple-600">Transactions</p>
                  <p className="text-2xl font-bold text-purple-800">{userTransactions.length}</p>
                </div>
              </div>

              {/* Wallet Section - Section 9.4 */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200 animate-on-load fade-up duration-slow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Wallet Balance</h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {userWallet?.wallet?.currentBalance ? Number(userWallet.wallet.currentBalance).toFixed(0) : '0'}g
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Current plastic impact balance
                    </p>
                  </div>
                  <button
                    onClick={() => setWalletAdjustmentModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adjust Wallet
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 animate-on-load fade-right duration-normal">
                <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">
                      {user?.firstName || user?.lastName
                        ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">
                      {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registration Level</p>
                    <p className="font-medium capitalize">{user?.registrationLevel || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 animate-on-load fade-left duration-light-slow">
                <h3 className="font-semibold text-gray-800 mb-4">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Street</p>
                    <p className="font-medium">{user?.street || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium">{user?.city || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Postal Code</p>
                    <p className="font-medium">{user?.postalCode || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium">{user?.country || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">State</p>
                    <p className="font-medium">{user?.state || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 animate-on-load fade-up duration-slow">
                <h3 className="font-semibold text-gray-800 mb-4">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-medium font-mono text-xs">{user?.id || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Corsair Connect</p>
                    <p className="font-medium">{user?.corsairConnectFlag ? 'Enabled' : 'Not Enabled'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created At</p>
                    <p className="font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Terms Accepted</p>
                    <p className="font-medium">
                      {user?.termsAcceptedAt ? new Date(user.termsAcceptedAt).toLocaleString() : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'edit' ? (
            // Edit Profile Tab
            <div className="animate-on-load fade-up duration-normal">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Success Message */}
                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-on-load zoom-in duration-fast">
                    <p className="text-green-800 font-medium">Profile updated successfully!</p>
                  </div>
                )}

                {/* Error Message */}
                {saveError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-on-load zoom-in duration-fast">
                    <p className="text-red-800 font-medium">Error: {saveError}</p>
                  </div>
                )}

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editForm.dateOfBirth}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email (read-only)</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      <input
                        type="text"
                        name="street"
                        value={editForm.street}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editForm.city}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={editForm.postalCode}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={editForm.country}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                      <input
                        type="text"
                        name="state"
                        value={editForm.state}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={userLoading}
                    className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                      userLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {userLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Transactions Tab
            <div className="animate-on-load fade-up duration-normal">
              {txLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading transactions...</p>
                </div>
              ) : userTransactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No transactions found for this user
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Payment Mode</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Impact (g)</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 font-mono">
                            {tx.sku?.code || tx.skuId?.substring(0, 8) || '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                tx.sku?.paymentMode === 'CLAIM'
                                  ? 'bg-green-100 text-green-800'
                                  : tx.sku?.paymentMode === 'PAY'
                                  ? 'bg-blue-100 text-blue-800'
                                  : tx.sku?.paymentMode === 'GIFT_CARD'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {tx.sku?.paymentMode || '-'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium">
                            EUR {Number(tx.amount).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-green-600">
                            {Number(tx.calculatedImpact).toFixed(0)}g
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                tx.paymentStatus === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : tx.paymentStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : tx.paymentStatus === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {tx.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Wallet Adjustment Modal - Section 9.4 */}
      <WalletAdjustmentModal
        userId={userId}
        userName={user?.email || 'User'}
        currentBalance={userWallet?.wallet?.currentBalance ? Number(userWallet.wallet.currentBalance) : 0}
        isOpen={walletAdjustmentModalOpen}
        onClose={() => setWalletAdjustmentModalOpen(false)}
      />
    </div>
  );
}
