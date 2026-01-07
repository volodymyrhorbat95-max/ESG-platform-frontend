// SKU Info Card - Displays SKU information and impact
import { CORSAIR_THRESHOLD } from './types';
import ImpactDisplay from './ImpactDisplay';

interface SkuInfoCardProps {
  skuName: string;
  skuCode: string;
  calculatedImpact: number;
  finalAmount: number;
}

export default function SkuInfoCard({
  skuName,
  skuCode,
  calculatedImpact,
  finalAmount,
}: SkuInfoCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{skuName}</h2>
      <p className="text-gray-500 text-sm mb-4">SKU: {skuCode}</p>

      {/* Show Impact Display when we have calculated impact */}
      {calculatedImpact > 0 && (
        <ImpactDisplay impact={calculatedImpact} />
      )}

      {/* Show Amount if applicable */}
      {finalAmount > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-800">
            Amount: €{finalAmount.toFixed(2)}
          </p>
          {finalAmount >= CORSAIR_THRESHOLD && (
            <p className="text-sm text-emerald-600 mt-1">
              ✓ Qualifies for Certified Environmental Asset
            </p>
          )}
        </div>
      )}
    </div>
  );
}
