// Amount Selector - For ALLOCATION SKUs without amount in URL
import { useState } from 'react';
import { CORSAIR_THRESHOLD } from './types';

interface AmountSelectorProps {
  impactMultiplier: number;
  currentCSRPrice: number;
  onSubmit: (amount: number) => void;
}

// Calculate impact in grams: (amount / CURRENT_CSR_PRICE) * impactMultiplier * 1000
const calculateImpactGrams = (amount: number, csrPrice: number, multiplier: number): number => {
  return Math.round((amount / csrPrice) * multiplier * 1000);
};

export default function AmountSelector({ impactMultiplier, currentCSRPrice, onSubmit }: AmountSelectorProps) {
  const [amountInput, setAmountInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountInput);
    if (amount >= 1) {
      onSubmit(amount);
    }
  };

  const presetAmounts = [1, 5, 10, 25];

  // Calculate impact per euro for display
  const impactPerEuro = calculateImpactGrams(1, currentCSRPrice, impactMultiplier);

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Choose Your Environmental Allocation
      </h3>
      <p className="text-gray-600 mb-4">
        Select your contribution amount. Every €1 generates {impactPerEuro}g of certified plastic removal.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Preset Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmountInput(preset.toString())}
              className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                amountInput === preset.toString()
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              €{preset}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div>
          <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Or enter custom amount (min. €1) *
          </label>
          <input
            type="number"
            id="customAmount"
            min="1"
            step="0.01"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
          />
        </div>

        {/* Impact Preview */}
        {amountInput && parseFloat(amountInput) >= 1 && (
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <p className="text-emerald-800 font-medium text-lg">
              Your impact: {calculateImpactGrams(parseFloat(amountInput), currentCSRPrice, impactMultiplier)}g of plastic removed
            </p>
            {parseFloat(amountInput) >= CORSAIR_THRESHOLD ? (
              <p className="text-emerald-600 text-sm mt-1">
                ✓ Qualifies for Certified Environmental Asset
              </p>
            ) : (
              <p className="text-gray-500 text-sm mt-1">
                Reach €{CORSAIR_THRESHOLD} to unlock certified asset status
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!amountInput || parseFloat(amountInput) < 1}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Registration
        </button>
      </form>
    </div>
  );
}
