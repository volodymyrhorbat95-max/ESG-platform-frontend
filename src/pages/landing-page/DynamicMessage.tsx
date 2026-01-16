// Dynamic Message Component - Handles all 5 cases (A-E)
// Based on client's EXACT messaging requirements from REQUIREMENTS.md Section 2.3
// Case A: Merchant Prepaid (CLAIM) - "This product line follows a plastic certification path..."
// Case B: Merchant Funded Accumulation (PAY/ALLOCATION with merchant payment) - merchant pays for customer
// Case C: Checkout Suggestion / Customer Payment (PAY/ALLOCATION with customer payment) - customer pays
// Case D: On-shelf Gift Card / Physical Store (GIFT_CARD) - "Code Validated..."
// Case E: General Landing (Marketing/Direct Access) - "Build your portfolio of environmental assets..."
//
// IMPORTANT from Section 2.3:
// Environmental Allocation (ALLOCATION mode) uses same dynamic messages as Case B/C depending on threshold
// Uses terminology "Environmental Allocation" or "Impact Recharge" (never "Donation")

interface DynamicMessageProps {
  caseType: 'A' | 'B' | 'C' | 'D' | 'E';
  merchantName?: string;
  partnerName?: string;
  impactGrams: number;
  amount?: number;
  threshold?: number; // Default 10€
  skuCode?: string;
  skuName?: string;
  isAllocation?: boolean; // Flag to use ALLOCATION terminology (never "Donation")
}

export default function DynamicMessage({
  caseType,
  impactGrams,
  amount = 0,
  threshold = 10,
  isAllocation = false,
}: DynamicMessageProps) {
  const isAboveThreshold = amount >= threshold;

  // Format impact display: grams if < 1000, kg if >= 1000
  const formatImpact = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)}kg`;
    }
    return `${grams}g`;
  };

  const getMessage = () => {
    switch (caseType) {
      case 'A':
        // Case A - Merchant Protagonist (CLAIM):
        // "This product line follows a plastic certification path. The Merchant has already
        // activated verified waste removal. Want to do your part? Start your personal journey too."
        return {
          title: 'Plastic Certification Path',
          message: 'This product line follows a plastic certification path. The Merchant has already activated verified waste removal. Want to do your part? Start your personal journey too.',
        };

      case 'B':
        // Case B - Merchant Funded Accumulation (PAY/ALLOCATION with merchant payment):
        // Also used for ALLOCATION when merchant is funding the contribution
        if (isAboveThreshold) {
          // If >= €10: "The Merchant has purchased real assets for the removal of [X]kg of plastic
          // for you. You now have a certified and auditable title."
          return {
            title: isAllocation ? 'Environmental Allocation Confirmed' : 'Certified Asset Acquired',
            message: `The Merchant has purchased real assets for the removal of ${formatImpact(impactGrams)} of plastic for you. You now have a certified and auditable title.`,
          };
        }
        // If < €10: "The Merchant has funded your accrual for the removal of [X]g of plastic.
        // Upon reaching €10, your credits will become a certified asset in your name."
        return {
          title: isAllocation ? 'Impact Recharge Activated' : 'Building Your Portfolio',
          message: `The Merchant has funded your accrual for the removal of ${formatImpact(impactGrams)} of plastic. Upon reaching €10, your credits will become a certified asset in your name.`,
        };

      case 'C':
        // Case C - Checkout Suggestion / Customer Payment (PAY/ALLOCATION):
        // Also used for ALLOCATION when customer is making the contribution
        // IMPORTANT: For ALLOCATION, use "Environmental Allocation" or "Impact Recharge" (never "Donation")
        if (isAboveThreshold) {
          // If >= €10: "Great choice. With your contribution of €[amount], you have purchased real
          // environmental assets for the removal of [X]kg of plastic. Your title is now auditable
          // and guaranteed by the CPRS protocol."
          const contributionTerm = isAllocation ? 'Environmental Allocation' : 'contribution';
          return {
            title: isAllocation ? 'Environmental Allocation Confirmed' : 'Certified Asset Acquired',
            message: `Great choice. With your ${contributionTerm} of €${amount.toFixed(2)}, you have purchased real environmental assets for the removal of ${formatImpact(impactGrams)} of plastic. Your title is now auditable and guaranteed by the CPRS protocol.`,
            note: 'Your Corsair Connect account will be automatically activated.',
          };
        }
        // If < €10: "Great choice. With your contribution of €[amount], you have started your accrual
        // path for the removal of [X]g of plastic. Upon reaching the €10 threshold, you will redeem
        // your first certified environmental assets."
        const contributionTermBelow = isAllocation ? 'Impact Recharge' : 'contribution';
        return {
          title: isAllocation ? 'Impact Recharge Activated' : 'Accumulation Started',
          message: `Great choice. With your ${contributionTermBelow} of €${amount.toFixed(2)}, you have started your accrual path for the removal of ${formatImpact(impactGrams)} of plastic. Upon reaching the €10 threshold, you will redeem your first certified environmental assets.`,
        };

      case 'D':
        // Case D - Gift Card (GIFT_CARD after code validation):
        // "Code Validated. You have redeemed an industrial value of [X]g of plastic removed.
        // Your credits are now in the maturation system to become a final asset."
        return {
          title: 'Code Validated',
          message: `Code Validated. You have redeemed an industrial value of ${formatImpact(impactGrams)} of plastic removed. Your credits are now in the maturation system to become a final asset.`,
        };

      case 'E':
        // Case E - General Landing (Marketing/Direct Access) per Section 2.3:
        // "Build your portfolio of environmental assets. Participate in certified plastic removal
        // and transform your impact into a real, tracked, and guaranteed value."
        // Used when user accesses landing page directly without specific SKU
        // Used for marketing campaigns, social media links, general awareness
        return {
          title: 'Build Your Environmental Portfolio',
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

      {/* Progress indicator for accumulation cases (B, C when below threshold) */}
      {/* Case E is General Landing - no progress to show */}
      {(caseType === 'B' || caseType === 'C') && !isAboveThreshold && amount > 0 && (
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
