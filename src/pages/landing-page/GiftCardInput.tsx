// Gift Card Input Component
import { useState } from 'react';

interface GiftCardInputProps {
  onValidate: (code: string) => void;
  loading: boolean;
}

export default function GiftCardInput({ onValidate, loading }: GiftCardInputProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onValidate(code.trim());
    }
  };

  return (
    <div className="space-y-4 animate-on-load fade-up duration-normal">
      <div className="text-center mb-6 animate-on-load zoom-in duration-fast">
        <h3 className="text-xl font-bold text-gray-800 mb-2 animate-on-load fade-down duration-light-slow">Enter Gift Card Code</h3>
        <p className="text-gray-600 animate-on-load fade-right duration-normal">Please enter your gift card secret code to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-on-load fade-left duration-slow">
        <div className="animate-on-load flip-up duration-normal">
          <label htmlFor="giftCardCode" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-up duration-fast">
            Gift Card Code *
          </label>
          <input
            type="text"
            id="giftCardCode"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg font-mono animate-on-load zoom-out duration-light-slow"
            disabled={loading}
            required
          />
          <p className="text-xs text-gray-500 mt-1 animate-on-load fade-left duration-very-fast">
            The code is case-insensitive and can be found on your gift card
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load flip-down duration-slow"
        >
          {loading ? 'Validating...' : 'Validate Code'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg animate-on-load fade-up duration-very-slow">
        <p className="text-sm text-gray-700 animate-on-load fade-right duration-light-slow">
          <strong className="animate-on-load zoom-in duration-fast">Note:</strong> Each gift card code can only be used once. After validation, you'll be asked to complete your registration.
        </p>
      </div>
    </div>
  );
}
