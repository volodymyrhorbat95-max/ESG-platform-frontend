// Landing Page Utility Functions
import type { CaseType } from './types';

// Determine which case (A-E) based on SKU and parameters
// REQUIREMENTS FROM requirements.md Section 1.3:
// Case A: Merchant Prepaid (CLAIM) - "This product line follows a plastic certification path..."
// Case B: Merchant Funded Accumulation (PAY with merchant payment) - merchant pays for customer
// Case C: Customer Payment (PAY with customer payment) - customer pays via Stripe
// Case D: Gift Card Validation (GIFT_CARD) - "Code Validated..."
// Case E: Environmental Allocation (ALLOCATION) - "Environmental Allocation" or "Impact Recharge" terminology
export function determineCaseType(
  paymentMode: string,
  merchantId: string | null,
  hasGiftCard: boolean,
  _amount: number = 0
): CaseType {
  // Case D - Gift Card Validation (GIFT_CARD)
  // "Code Validated. You have redeemed an industrial value..."
  if (paymentMode === 'GIFT_CARD' || hasGiftCard) {
    return 'D';
  }

  // Case E - Environmental Allocation (ALLOCATION)
  // Displays amount-based impact with "Environmental Allocation" or "Impact Recharge" terminology
  // IMPORTANT: Never use "Donation" - per Section 1.3
  if (paymentMode === 'ALLOCATION') {
    return 'E';
  }

  // Case B - Merchant Funded Accumulation (PAY with merchant payment)
  // When merchant is paying for the customer's environmental credits
  if (paymentMode === 'PAY' && merchantId) {
    return 'B';
  }

  // Case C - Customer Payment (PAY with customer payment)
  // Customer pays via Stripe for their own environmental credits
  if (paymentMode === 'PAY') {
    return 'C';
  }

  // Case A - Merchant Prepaid (CLAIM)
  // "This product line follows a plastic certification path. The Merchant has already activated..."
  if (paymentMode === 'CLAIM') {
    return 'A';
  }

  // Default fallback - should not reach here with valid SKU
  return 'A';
}
