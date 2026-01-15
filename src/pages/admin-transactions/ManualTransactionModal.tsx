// Manual Transaction Creation Modal - Section 9.5
// Allows admin to create transactions directly without payment processing
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createManualTransaction } from '../../store/transactionSlice';
import { fetchAllUsers } from '../../store/userSlice';
import { fetchAllSKUs } from '../../store/skuSlice';

interface ManualTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ManualTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: ManualTransactionModalProps) {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const { skus } = useAppSelector((state) => state.skus);
  const { loading } = useAppSelector((state) => state.transactions);

  const [userId, setUserId] = useState('');
  const [skuCode, setSkuCode] = useState('');
  const [amount, setAmount] = useState('');
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load users and SKUs when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllUsers());
      dispatch(fetchAllSKUs());
      // Reset form
      setUserId('');
      setSkuCode('');
      setAmount('');
      setOrderId('');
      setReason('');
      setValidationError('');
      setSuccess(false);
    }
  }, [isOpen, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccess(false);

    // Validate required fields
    if (!userId) {
      setValidationError('Please select a user');
      return;
    }

    if (!skuCode) {
      setValidationError('Please select a SKU');
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      setValidationError('Amount must be a positive number');
      return;
    }

    if (!reason.trim()) {
      setValidationError('Reason is required');
      return;
    }

    try {
      await dispatch(createManualTransaction({
        userId,
        skuCode,
        amount: amountNum,
        orderId: orderId.trim() || undefined,
        reason: reason.trim(),
      })).unwrap();

      setSuccess(true);
      // Reset form
      setUserId('');
      setSkuCode('');
      setAmount('');
      setOrderId('');
      setReason('');

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setValidationError(err || 'Failed to create manual transaction');
    }
  };

  if (!isOpen) return null;

  // Get selected SKU details for preview
  const selectedSKU = skus.find((s) => s.code === skuCode);
  const selectedUser = users.find((u) => u.id === userId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-on-load fade-down duration-fast">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-on-load zoom-in duration-normal">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white animate-on-load fade-right duration-fast">
                Create Manual Transaction
              </h2>
              <p className="text-indigo-100 text-sm mt-1 animate-on-load fade-left duration-light-slow">
                Bypass payment processing and create transaction directly
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-indigo-100 transition-colors p-2 rounded-lg hover:bg-white/10 animate-on-load zoom-in duration-light-slow"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-on-load zoom-in duration-fast">
                <p className="text-green-800 font-medium">Manual transaction created successfully!</p>
              </div>
            )}

            {/* Validation Error */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-on-load zoom-in duration-fast">
                <p className="text-red-800 font-medium">{validationError}</p>
              </div>
            )}

            {/* User Selection */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                Select User *
              </label>
              <select
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">-- Select a user --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email} {user.firstName && `(${user.firstName} ${user.lastName})`}
                  </option>
                ))}
              </select>
              {selectedUser && (
                <p className="text-sm text-gray-600 mt-1">
                  User ID: {selectedUser.id}
                </p>
              )}
            </div>

            {/* SKU Selection */}
            <div>
              <label htmlFor="skuCode" className="block text-sm font-medium text-gray-700 mb-2">
                Select SKU *
              </label>
              <select
                id="skuCode"
                value={skuCode}
                onChange={(e) => setSkuCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">-- Select a SKU --</option>
                {skus.filter((s) => s.isActive).map((sku) => (
                  <option key={sku.id} value={sku.code}>
                    {sku.code} - {sku.name} ({sku.paymentMode})
                  </option>
                ))}
              </select>
              {selectedSKU && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Payment Mode:</span> {selectedSKU.paymentMode}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Base Price:</span> €{selectedSKU.price.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Amount (EUR) *
              </label>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter the euro amount for this transaction
              </p>
            </div>

            {/* Order ID Input */}
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                Order ID (Optional)
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="MANUAL-2026-001 or leave blank for auto-generation"
              />
            </div>

            {/* Reason Textarea */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Manual Transaction *
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Explain why this manual transaction is being created (e.g., 'Refund for cancelled order #12345', 'Compensation for system error', 'Manual correction for missing payment')"
                required
              />
            </div>

            {/* Warning Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold mb-2">Important Notice</p>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                <li>This transaction will bypass Stripe payment processing</li>
                <li>Transaction status will be set to <strong>COMPLETED</strong> automatically</li>
                <li>User wallet will be updated immediately with calculated impact</li>
                <li>Impact is calculated using current CSR price and SKU multiplier</li>
                <li>Corsair Connect flag may be triggered if amount ≥ threshold</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Creating...' : 'Create Manual Transaction'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
