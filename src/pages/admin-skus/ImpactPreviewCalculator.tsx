// Impact Preview Calculator Component - Section 9.3
// Shows preview of impact calculations for a SKU based on different amounts
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCSRPrice } from '../../store/configSlice';

interface ImpactPreviewCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  sku: {
    code: string;
    name: string;
    price: number;
    paymentMode: 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION';
    impactMultiplier: number;
  };
}

export default function ImpactPreviewCalculator({ isOpen, onClose, sku }: ImpactPreviewCalculatorProps) {
  const dispatch = useAppDispatch();
  const { csrPrice } = useAppSelector((state) => state.config);
  const [customAmount, setCustomAmount] = useState('');
  const [previewAmounts, setPreviewAmounts] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCSRPrice());
      // Set preview amounts based on SKU price
      const basePrice = Number(sku.price);
      if (basePrice > 0) {
        setPreviewAmounts([
          basePrice * 1,
          basePrice * 5,
          basePrice * 10,
          basePrice * 50,
          basePrice * 100,
        ]);
      } else {
        // For ALLOCATION or free SKUs, use standard amounts
        setPreviewAmounts([1, 5, 10, 50, 100]);
      }
      setCustomAmount('');
    }
  }, [isOpen, dispatch, sku.price]);

  const calculateImpact = (amount: number): number => {
    if (sku.paymentMode === 'ALLOCATION') {
      // ALLOCATION: amount × impactMultiplier
      return amount * sku.impactMultiplier;
    } else {
      // Standard: amount ÷ CSR_PRICE × impactMultiplier
      return (amount / csrPrice) * sku.impactMultiplier;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-on-load fade-in duration-fast">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-on-load zoom-in duration-normal">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 animate-on-load fade-down duration-fast">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Impact Preview Calculator</h2>
            <p className="text-sm text-gray-600">
              SKU: <span className="font-semibold">{sku.code}</span> - {sku.name}
            </p>
            <p className="text-sm text-gray-600">
              Type: <span className="font-semibold">{sku.paymentMode}</span> |
              Current CSR Price: <span className="font-semibold">€{csrPrice.toFixed(4)}/g</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Calculation Formula Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-on-load fade-up duration-normal">
          <h3 className="font-semibold text-blue-800 mb-2">Calculation Formula:</h3>
          {sku.paymentMode === 'ALLOCATION' ? (
            <p className="text-sm text-blue-700">
              Impact (g) = Amount × Multiplier ({sku.impactMultiplier})
            </p>
          ) : (
            <p className="text-sm text-blue-700">
              Impact (g) = (Amount ÷ CSR Price) × Multiplier ({sku.impactMultiplier})
            </p>
          )}
        </div>

        {/* Standard Preview Amounts */}
        <div className="mb-6 animate-on-load fade-right duration-light-slow">
          <h3 className="font-semibold text-gray-800 mb-3">Standard Amounts:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount (EUR)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Impact (grams)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Impact (kg)</th>
                </tr>
              </thead>
              <tbody>
                {previewAmounts.map((amount, index) => {
                  const impactGrams = calculateImpact(amount);
                  const impactKg = impactGrams / 1000;
                  return (
                    <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">€{amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 text-right font-semibold">
                        {impactGrams.toFixed(0)}g
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">
                        {impactKg.toFixed(3)}kg
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Amount Calculator */}
        <div className="animate-on-load fade-left duration-slow">
          <h3 className="font-semibold text-gray-800 mb-3">Custom Amount Calculator:</h3>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <input
                type="number"
                step="0.01"
                min="0"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter custom amount (EUR)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {customAmount && Number(customAmount) > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-on-load zoom-in duration-fast">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Amount:</p>
                  <p className="text-xl font-bold text-gray-800">€{Number(customAmount).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Calculated Impact:</p>
                  <p className="text-2xl font-bold text-green-600">
                    {calculateImpact(Number(customAmount)).toFixed(0)}g
                  </p>
                  <p className="text-sm text-gray-600">
                    ({(calculateImpact(Number(customAmount)) / 1000).toFixed(3)}kg)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end animate-on-load fade-up duration-normal">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
