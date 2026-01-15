// Gift Card Input Component
import { useState } from 'react';

interface GiftCardInputProps {
  onValidate: (code: string) => void;
  loading: boolean;
  error?: string | null;
}

export default function GiftCardInput({ onValidate, loading, error }: GiftCardInputProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onValidate(code.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6 animate-on-load zoom-in duration-fast">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Enter Gift Card Code</h3>
        <p className="text-gray-600">Please enter your gift card secret code to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="animate-on-load fade-up duration-normal">
          <label htmlFor="giftCardCode" className="block text-sm font-medium text-gray-700 mb-1">
            Gift Card Code *
          </label>
          <input
            type="text"
            id="giftCardCode"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg font-mono"
            disabled={loading}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The code is case-insensitive and can be found on your gift card
          </p>
        </div>

        {/* Section 8.2: Display error message when validation fails */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-on-load fade-left duration-fast">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">Invalid Gift Card Code</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load zoom-in duration-slow"
        >
          {loading ? 'Validating...' : 'Validate Code'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg animate-on-load fade-up duration-very-slow">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Each gift card code can only be used once. After validation, you'll be asked to complete your registration.
        </p>
      </div>
    </div>
  );
}
