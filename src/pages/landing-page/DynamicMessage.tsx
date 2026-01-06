// Dynamic Message Component - Handles all 5 cases (A-E)
// Based on client's messaging requirements

interface DynamicMessageProps {
  caseType: 'A' | 'B' | 'C' | 'D' | 'E';
  merchantName?: string;
  partnerName?: string;
  impactGrams: number;
  amount?: number;
  threshold?: number; // Default 10€
  skuCode?: string;
  skuName?: string;
}

export default function DynamicMessage({
  caseType,
  merchantName,
  partnerName,
  impactGrams,
  amount = 0,
  threshold = 10,
  skuCode,
  skuName,
}: DynamicMessageProps) {
  const impactKg = impactGrams / 1000;
  const isAboveThreshold = amount >= threshold;
  // Use partner name if merchant name is not available
  const displayName = merchantName || partnerName || 'The Merchant';

  // Check if this is a Gift Card SKU
  const isGiftCard = skuCode?.startsWith('GC-');
  // Check if this is specific retail/merchant SKU
  const isRetailAllocation = skuCode?.startsWith('ALLOC-MERCHANT-') || skuCode === 'LOT-CONAD-01';

  const getMessage = () => {
    switch (caseType) {
      case 'A':
        // Case A - Merchant (Merchant/Shopkeeper) Protagonist
        if (isRetailAllocation) {
          return {
            title: `${displayName} - Environmental Partner`,
            message: `${displayName} has activated certified plastic removal for this product line. Every purchase contributes to real environmental impact. Register to claim your certified credits.`,
          };
        }
        return {
          title: 'Merchant Activated',
          message: `This product line follows a plastic certification path. ${displayName} has already activated verified waste removal. Want to do your part? Start your personal journey too.`,
        };

      case 'B':
        // Case B - Merchant Funded Accumulation
        if (isAboveThreshold) {
          return {
            title: 'New Asset Added to Your Portfolio',
            message: `${displayName} has purchased real environmental assets for the removal of ${impactKg.toFixed(2)}kg of plastic for you. You have added a new certified and auditable asset to your portfolio.`,
          };
        }
        return {
          title: 'Start Building Your Portfolio',
          message: `${displayName} has funded your accrual for the removal of ${impactGrams}g of plastic. You are building your portfolio of environmental assets. Upon reaching €10, your credits will become a certified asset in your name.`,
        };

      case 'C':
        // Case C - Checkout Suggestion (1€ minimum + dropdown option)
        if (isAboveThreshold) {
          return {
            title: 'New Asset Added to Your Portfolio',
            message: `Great choice. With your contribution of €${amount.toFixed(2)}, you have added a new real environmental asset to your portfolio for the removal of ${impactKg.toFixed(2)}kg of plastic. Your certified asset is now auditable and guaranteed by the CPRS protocol.`,
            note: 'Your Amplivo Corsair Connect account will be automatically activated.',
          };
        }
        return {
          title: 'Start Building Your Portfolio',
          message: `Great choice. With your contribution of €${amount.toFixed(2)}, you have started building your portfolio of environmental assets for the removal of ${impactGrams}g of plastic. Upon reaching the €10 threshold, you will receive your first certified environmental asset.`,
        };

      case 'D':
        // Case D - On-shelf Gift Card (Physical store/cash desk)
        if (isGiftCard) {
          return {
            title: 'Gift Card Validated',
            message: `${skuName || 'Gift Card'} validated successfully. You have redeemed €${amount.toFixed(2)} worth of environmental assets (${impactKg.toFixed(2)}kg of certified plastic removal). Your credits are now in the maturation system following the 5/45/50 Rule to become final assets in your portfolio.`,
          };
        }
        return {
          title: 'Code Validated',
          message: `Code Validated. You have redeemed an industrial value of ${impactGrams}g of plastic removed. Your credits are now in the maturation system to become a final asset.`,
        };

      case 'E':
        // Case E - General Landing (Marketing/Direct)
        return {
          title: 'Build Your Portfolio',
          message: 'Build your portfolio of environmental assets. Participate in certified plastic removal and transform your impact into a real, tracked, and guaranteed value.',
        };

      default:
        return {
          title: 'Environmental Impact',
          message: 'Your contribution supports certified plastic removal.',
        };
    }
  };

  const { title, message, note } = getMessage() as { title: string; message: string; note?: string };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 animate-on-load fade-up duration-normal">
      <h3 className="text-xl font-bold text-emerald-800 mb-3 animate-on-load fade-down duration-fast">
        {title}
      </h3>
      <p className="text-gray-700 leading-relaxed animate-on-load fade-right duration-light-slow">
        {message}
      </p>
      {note && (
        <p className="text-sm text-emerald-600 mt-3 italic animate-on-load fade-up duration-slow">
          {note}
        </p>
      )}

      {/* Progress indicator for accumulation cases */}
      {(caseType === 'B' || caseType === 'C') && !isAboveThreshold && (
        <div className="mt-4 animate-on-load zoom-in duration-slow">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress to certification</span>
            <span>€{amount.toFixed(2)} / €{threshold.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((amount / threshold) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
