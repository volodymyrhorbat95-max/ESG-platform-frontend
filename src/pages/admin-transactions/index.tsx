// Admin Transaction Oversight - Full transaction audit trail
// Supports real-time list, filtering by date/status/payment mode, and export for accounting
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllTransactions, type PaymentStatus } from '../../store/transactionSlice';
import StatsCards from './StatsCards';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';

export type PaymentMode = 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION' | '';

export interface TransactionFilterState {
  userId: string;
  merchantId: string;
  partnerId: string;
  paymentStatus: PaymentStatus | '';
  paymentMode: PaymentMode;
  startDate: string;
  endDate: string;
}

export default function AdminTransactions() {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector((state) => state.transactions);

  const [filters, setFilters] = useState<TransactionFilterState>({
    userId: '',
    merchantId: '',
    partnerId: '',
    paymentStatus: '',
    paymentMode: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    dispatch(fetchAllTransactions({}));
  }, [dispatch]);

  const handleApplyFilters = () => {
    // Build filter object, only including non-empty values
    const apiFilters: any = {};
    if (filters.userId) apiFilters.userId = filters.userId;
    if (filters.merchantId) apiFilters.merchantId = filters.merchantId;
    if (filters.partnerId) apiFilters.partnerId = filters.partnerId;
    if (filters.paymentStatus) apiFilters.paymentStatus = filters.paymentStatus;
    if (filters.startDate) apiFilters.startDate = filters.startDate;
    if (filters.endDate) apiFilters.endDate = filters.endDate;

    dispatch(fetchAllTransactions(apiFilters));
  };

  const handleClearFilters = () => {
    setFilters({
      userId: '',
      merchantId: '',
      partnerId: '',
      paymentStatus: '',
      paymentMode: '',
      startDate: '',
      endDate: '',
    });
    dispatch(fetchAllTransactions({}));
  };

  // Apply client-side filter for paymentMode (filtered by SKU association, not direct transaction field)
  const filteredTransactions = transactions.filter((t) => {
    // Payment mode filter (based on SKU's paymentMode)
    if (filters.paymentMode && t.sku?.paymentMode !== filters.paymentMode) {
      return false;
    }
    return true;
  });

  // Export transactions as CSV for accounting
  const handleExportCSV = () => {
    const headers = ['Date', 'User ID', 'SKU', 'Payment Mode', 'Amount (EUR)', 'Impact (g)', 'Status', 'Merchant', 'Partner'];
    const rows = filteredTransactions.map((t) => [
      new Date(t.createdAt).toISOString(),
      t.userId,
      t.sku?.code || t.skuId,
      t.sku?.paymentMode || '',
      Number(t.amount).toFixed(2),
      Number(t.calculatedImpact).toFixed(0),
      t.paymentStatus,
      t.merchantId || '',
      t.partnerId || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculate stats from filtered transactions
  const totalTransactions = filteredTransactions.length;
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalImpact = filteredTransactions.reduce((sum, t) => sum + Number(t.calculatedImpact), 0);
  const corsairConnectCount = filteredTransactions.filter((t) => t.corsairConnectFlag).length;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">Transaction Oversight</h1>
              <p className="text-gray-600 animate-on-load fade-left duration-light-slow">Full audit trail and monitoring</p>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={filteredTransactions.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load zoom-in duration-normal"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="animate-on-load zoom-in duration-light-slow">
          <StatsCards
            totalTransactions={totalTransactions}
            totalAmount={totalAmount}
            totalImpact={totalImpact}
            corsairConnectCount={corsairConnectCount}
          />
        </div>

        <div className="animate-on-load fade-up duration-normal">
          <TransactionFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-left duration-slow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-normal">
            All Transactions ({filteredTransactions.length})
          </h2>
          <div className="animate-on-load fade-up duration-light-slow">
            <TransactionTable transactions={filteredTransactions} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
