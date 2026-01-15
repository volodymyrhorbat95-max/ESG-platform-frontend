// Wallet Adjustment Modal - Section 9.4
// Allows admin to manually adjust user wallet balance with audit trail
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { adjustUserWallet, fetchWalletAdjustments, fetchUserById } from '../../store/userSlice';

interface WalletAdjustmentModalProps {
  userId: string;
  userName: string;
  currentBalance: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletAdjustmentModal({
  userId,
  userName,
  currentBalance,
  isOpen,
  onClose,
}: WalletAdjustmentModalProps) {
  const dispatch = useAppDispatch();
  const { walletAdjustments, adjustmentLoading } = useAppSelector((state) => state.users);

  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'adjust' | 'history'>('adjust');

  // Load adjustment history when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchWalletAdjustments(userId));
      setAmount('');
      setReason('');
      setValidationError('');
      setSuccess(false);
    }
  }, [isOpen, userId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccess(false);

    // Validate amount
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum === 0) {
      setValidationError('Amount must be a non-zero number');
      return;
    }

    // Check for negative balance
    const newBalance = currentBalance + amountNum;
    if (newBalance < 0) {
      setValidationError(`Adjustment would result in negative balance (${newBalance.toFixed(0)}g)`);
      return;
    }

    // Validate reason
    if (!reason.trim()) {
      setValidationError('Reason is required');
      return;
    }

    try {
      await dispatch(adjustUserWallet({ userId, amount: amountNum, reason: reason.trim() })).unwrap();
      setSuccess(true);
      setAmount('');
      setReason('');
      // Refresh user data and adjustment history
      dispatch(fetchUserById(userId));
      dispatch(fetchWalletAdjustments(userId));
      // Switch to history tab to show the new adjustment
      setTimeout(() => setActiveTab('history'), 500);
    } catch (err: any) {
      setValidationError(err || 'Failed to adjust wallet');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-on-load fade-down duration-fast">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-on-load zoom-in duration-normal">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white animate-on-load fade-right duration-fast">
                Wallet Adjustment
              </h2>
              <p className="text-purple-100 text-sm mt-1 animate-on-load fade-left duration-light-slow">
                {userName} - Current Balance: {currentBalance.toFixed(0)}g
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-100 transition-colors p-2 rounded-lg hover:bg-white/10 animate-on-load zoom-in duration-light-slow"
              aria-label="Close"
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
              onClick={() => setActiveTab('adjust')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'adjust'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Adjust Wallet
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Adjustment History ({walletAdjustments.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          {activeTab === 'adjust' ? (
            // Adjustment Form Tab
            <form onSubmit={handleSubmit} className="space-y-6 animate-on-load fade-up duration-normal">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-on-load zoom-in duration-fast">
                  <p className="text-green-800 font-medium">Wallet adjusted successfully!</p>
                </div>
              )}

              {/* Validation Error */}
              {validationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-on-load zoom-in duration-fast">
                  <p className="text-red-800 font-medium">{validationError}</p>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Amount (grams) *
                </label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter amount (positive to add, negative to subtract)"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Use positive values to add grams, negative to subtract. New balance will be:{' '}
                  <span className="font-semibold">
                    {amount ? (currentBalance + Number(amount)).toFixed(0) : currentBalance.toFixed(0)}g
                  </span>
                </p>
              </div>

              {/* Reason Textarea */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Adjustment *
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Explain why this adjustment is being made (e.g., 'Manual correction for missing transaction', 'Refund for order #12345', 'Compensation for system error')"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  This will be recorded in the adjustment history for audit purposes
                </p>
              </div>

              {/* Warning Box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-semibold mb-2">Important Notice</p>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>This adjustment directly modifies the user's wallet balance</li>
                  <li>The change is permanent and tracked in the audit log</li>
                  <li>Your admin identifier and timestamp will be recorded</li>
                  <li>Ensure the reason is clear and accurate for future reference</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={adjustmentLoading}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    adjustmentLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {adjustmentLoading ? 'Adjusting...' : 'Confirm Adjustment'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={adjustmentLoading}
                  className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // History Tab
            <div className="animate-on-load fade-up duration-normal">
              {adjustmentLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading adjustment history...</p>
                </div>
              ) : walletAdjustments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No adjustment history yet</p>
                  <p className="text-gray-500 text-sm mt-2">Manual adjustments will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {walletAdjustments.map((adj, index) => (
                    <div
                      key={adj.id}
                      className={`bg-gray-50 rounded-lg p-4 border-l-4 ${
                        Number(adj.amount) > 0 ? 'border-green-500' : 'border-red-500'
                      } animate-on-load fade-up duration-normal`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              Number(adj.amount) > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {Number(adj.amount) > 0 ? '+' : ''}
                            {Number(adj.amount).toFixed(0)}g
                          </span>
                          <span className="text-gray-600 text-sm font-medium">by {adj.adjustedBy}</span>
                        </div>
                        <span className="text-gray-500 text-sm">{formatDateTime(adj.adjustedAt)}</span>
                      </div>

                      <div className="bg-white px-3 py-2 rounded border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Reason:</p>
                        <p className="text-sm text-gray-800">{adj.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
