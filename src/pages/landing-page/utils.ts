// Landing Page Utility Functions
import type { CaseType } from './types';

// Determine which case (A-E) based on SKU and parameters
// REQUIREMENTS FROM requirements.md Section 2.3:
// Case A: Merchant Prepaid (CLAIM) - "This product line follows a plastic certification path..."
// Case B: Merchant Funded Accumulation (PAY with merchant payment) - merchant pays for customer
// Case C: Checkout Suggestion / Customer Payment (PAY with customer payment) - customer pays via Stripe
// Case D: On-shelf Gift Card / Physical Store (GIFT_CARD) - "Code Validated..."
// Case E: General Landing (Marketing/Direct Access) - "Build your portfolio of environmental assets..."
//
// IMPORTANT from Section 2.3:
// Environmental Allocation (ALLOCATION mode) uses same dynamic messages as Case B/C depending on threshold
// Uses terminology "Environmental Allocation" or "Impact Recharge" (never "Donation")
export function determineCaseType(
  paymentMode: string | null,
  merchantId: string | null,
  hasGiftCard: boolean,
  _amount: number = 0
): CaseType {
  // Case E - General Landing (Marketing/Direct Access)
  // Used when user accesses landing page directly without specific SKU
  // Used for marketing campaigns, social media links, general awareness
  // "Build your portfolio of environmental assets..."
  if (!paymentMode) {
    return 'E';
  }

  // Case D - Gift Card Validation (GIFT_CARD)
  // "Code Validated. You have redeemed an industrial value..."
  if (paymentMode === 'GIFT_CARD' || hasGiftCard) {
    return 'D';
  }

  // ALLOCATION mode uses Case B/C messaging based on merchant involvement
  // Per Section 2.3: "Uses same dynamic messages as Case B/C depending on threshold"
  // Case B - Merchant Funded Accumulation (with merchant ID)
  if ((paymentMode === 'PAY' || paymentMode === 'ALLOCATION') && merchantId) {
    return 'B';
  }

  // Case C - Customer Payment (PAY or ALLOCATION with customer payment)
  // Customer pays via Stripe or contributes via ALLOCATION
  if (paymentMode === 'PAY' || paymentMode === 'ALLOCATION') {
    return 'C';
  }

  // Case A - Merchant Prepaid (CLAIM)
  // "This product line follows a plastic certification path. The Merchant has already activated..."
  if (paymentMode === 'CLAIM') {
    return 'A';
  }

  // Default fallback - Case E for general landing
  return 'E';
}
