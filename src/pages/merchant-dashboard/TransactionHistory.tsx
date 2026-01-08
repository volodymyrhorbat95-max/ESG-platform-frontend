// Transaction History Component for Merchant Dashboard
// Shows transactions from SKUs belonging to this merchant
// Section 9: Certificate download available for completed transactions

import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { downloadCertificate } from '../../store/certificateSlice';

interface TransactionHistoryProps {
  transactions: any[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const dispatch = useAppDispatch();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadCertificate = async (transactionId: string) => {
    setDownloadingId(transactionId);
    try {
      await dispatch(downloadCertificate(transactionId));
    } finally {
      setDownloadingId(null);
    }
  };

  // Check if transaction is completed (eligible for certificate download)
  const isCompleted = (paymentStatus: string) => {
    return paymentStatus === 'completed' || paymentStatus === 'COMPLETED' || paymentStatus === 'n/a';
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 animate-on-load fade-up duration-normal">
        <p className="text-gray-500 animate-on-load zoom-in duration-fast">No transactions in selected date range</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto animate-on-load fade-up duration-normal">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-fast">Date</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-fast">
              SKU
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-normal">Amount (€)</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-light-slow">Impact (g)</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-slow">Status</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-slow">Certificate</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: any) => (
            <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 animate-on-load fade-up duration-normal">
              <td className="py-3 px-4 text-sm text-gray-600 animate-on-load fade-right duration-fast">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-sm text-gray-800 font-mono animate-on-load zoom-in duration-normal">
                {transaction.sku?.code || transaction.sku?.name || '-'}
              </td>
              <td className="py-3 px-4 text-sm text-gray-800 text-right animate-on-load flip-up duration-normal">
                {Number(transaction.amount) > 0
                  ? `€${Number(transaction.amount).toFixed(2)}`
                  : '-'}
              </td>
              <td className="py-3 px-4 text-sm font-semibold text-primary text-right animate-on-load zoom-out duration-slow">
                {Number(transaction.calculatedImpact).toLocaleString()} g
              </td>
              <td className="py-3 px-4 text-center animate-on-load flip-down duration-light-slow">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    isCompleted(transaction.paymentStatus)
                      ? 'bg-green-100 text-green-800'
                      : transaction.paymentStatus === 'PENDING' || transaction.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : transaction.paymentStatus === 'FAILED' || transaction.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {transaction.paymentStatus}
                </span>
              </td>
              <td className="py-3 px-4 text-center animate-on-load flip-down duration-light-slow">
                {isCompleted(transaction.paymentStatus) ? (
                  <button
                    onClick={() => handleDownloadCertificate(transaction.id)}
                    disabled={downloadingId === transaction.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Download Certificate"
                  >
                    {downloadingId === transaction.id ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    PDF
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs" title="Certificate available after payment completes">
                    -
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
