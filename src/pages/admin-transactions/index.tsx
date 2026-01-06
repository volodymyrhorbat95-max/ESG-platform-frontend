// Admin Transaction Oversight - Full transaction audit trail
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTransactions } from '../../store/transactionSlice';
import StatsCards from './StatsCards';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';

export default function AdminTransactions() {
  const dispatch = useAppDispatch();
  const { items: transactions, loading } = useAppSelector((state) => state.transactions);

  const [filters, setFilters] = useState({
    userId: '',
    merchantId: '',
    partnerId: '',
  });

  useEffect(() => {
    dispatch(fetchTransactions(filters));
  }, [dispatch]);

  const handleApplyFilters = () => {
    dispatch(fetchTransactions(filters));
  };

  const handleClearFilters = () => {
    setFilters({ userId: '', merchantId: '', partnerId: '' });
    dispatch(fetchTransactions({}));
  };

  // Calculate stats
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalImpact = transactions.reduce((sum, t) => sum + Number(t.calculatedImpact), 0);
  const amplivoCount = transactions.filter((t) => t.amplivoFlag).length;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">Transaction Oversight</h1>
          <p className="text-gray-600 animate-on-load fade-left duration-light-slow">Full audit trail and monitoring</p>
        </div>

        <div className="animate-on-load zoom-in duration-light-slow">
          <StatsCards
            totalTransactions={totalTransactions}
            totalAmount={totalAmount}
            totalImpact={totalImpact}
            amplivoCount={amplivoCount}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-normal">All Transactions</h2>
          <div className="animate-on-load fade-up duration-light-slow">
            <TransactionTable transactions={transactions} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
