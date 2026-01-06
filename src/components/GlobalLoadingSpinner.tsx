// Global Loading Spinner - Shows during async operations
import { useAppSelector } from '../store/hooks';

export default function GlobalLoadingSpinner() {
  const { loading: skuLoading } = useAppSelector((state) => state.skus);
  const { loading: userLoading } = useAppSelector((state) => state.users);
  const { loading: transactionLoading } = useAppSelector((state) => state.transactions);
  const { loading: giftCardLoading } = useAppSelector((state) => state.giftCards);
  const { loading: walletLoading } = useAppSelector((state) => state.wallets);
  const { loading: paymentLoading } = useAppSelector((state) => state.payment);
  const { loading: exportLoading } = useAppSelector((state) => state.export);

  const isLoading =
    skuLoading ||
    userLoading ||
    transactionLoading ||
    giftCardLoading ||
    walletLoading ||
    paymentLoading ||
    exportLoading;

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-on-load zoom-in duration-fast">
        <div className="relative w-16 h-16">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
          {/* Inner spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin"></div>
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-lg">Processing...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
}
