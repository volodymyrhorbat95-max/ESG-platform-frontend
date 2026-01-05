// SKU Input Form - Shown when no SKU code in URL
import { useState } from 'react';
import { FaLeaf } from 'react-icons/fa';

interface SkuInputFormProps {
  onSubmit: (skuCode: string) => void;
}

export default function SkuInputForm({ onSubmit }: SkuInputFormProps) {
  const [skuInput, setSkuInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skuInput.trim()) {
      onSubmit(skuInput.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaLeaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">CSR26 Impact Processor</h1>
          <p className="text-gray-600">Enter your SKU code to view your environmental impact</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="skuCode" className="block text-sm font-medium text-gray-700 mb-1">
              SKU Code *
            </label>
            <input
              type="text"
              id="skuCode"
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value.toUpperCase())}
              placeholder="e.g., LOT-CONAD-01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!skuInput.trim()}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Your SKU code can be found on your receipt, product packaging, or QR code
        </p>
      </div>
    </div>
  );
}
