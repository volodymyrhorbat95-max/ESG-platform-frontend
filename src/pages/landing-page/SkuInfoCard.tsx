// SKU Info Card - Displays SKU information and impact
import ImpactDisplay from './ImpactDisplay';

interface SkuInfoCardProps {
  skuName: string;
  skuCode: string;
  calculatedImpact: number;
  finalAmount: number;
  corsairThreshold: number; // Dynamic threshold from backend config
}

export default function SkuInfoCard({
  skuName,
  skuCode,
  calculatedImpact,
  finalAmount,
  corsairThreshold,
}: SkuInfoCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6 animate-on-load fade-up duration-fast">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-normal">{skuName}</h2>
      <p className="text-gray-500 text-sm mb-4 animate-on-load fade-left duration-light-slow">SKU: {skuCode}</p>

      {/* Show Impact Display when we have calculated impact */}
      {calculatedImpact > 0 && (
        <div className="animate-on-load zoom-in duration-slow">
          <ImpactDisplay impact={calculatedImpact} />
        </div>
      )}

      {/* Show Amount if applicable */}
      {finalAmount > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg animate-on-load fade-up duration-very-slow">
          <p className="text-lg font-semibold text-gray-800">
            Amount: €{finalAmount.toFixed(2)}
          </p>
          {finalAmount >= corsairThreshold && (
            <p className="text-sm text-emerald-600 mt-1">
              ✓ Qualifies for Certified Environmental Asset
            </p>
          )}
        </div>
      )}
    </div>
  );
}
