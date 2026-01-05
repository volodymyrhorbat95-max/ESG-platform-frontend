// Error State Component - Shown when SKU not found
interface ErrorStateProps {
  error?: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid SKU Code</h1>
        <p className="text-gray-600 mb-4">{error || 'The SKU code was not found in our system.'}</p>
        <button
          onClick={onRetry}
          className="bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
        >
          Try Another Code
        </button>
      </div>
    </div>
  );
}
