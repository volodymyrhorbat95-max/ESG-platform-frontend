// Landing Page Utility Functions
import type { CaseType } from './types';

// Determine which case (A-E) based on SKU and parameters
// REQUIREMENTS FROM requirements.md:
// Case A: Merchant Protagonist (CLAIM) - general certification path, no specific value
// Case B: Merchant Funded Accumulation (CLAIM with value) - merchant funded with value displayed
// Case C: Checkout Suggestion (PAY) - customer pays via Stripe, also ALLOCATION from partner checkout
// Case D: Gift Card (GIFT_CARD after code validation)
// Case E: General Landing (no SKU or marketing)
export function determineCaseType(
  paymentMode: string,
  merchantId: string | null,
  partnerId: string | null,
  hasGiftCard: boolean,
  amount: number = 0
): CaseType {
  // Case D - Gift Card (On-shelf Gift Card) - after code validation
  if (paymentMode === 'GIFT_CARD' || hasGiftCard) {
    return 'D';
  }

  // Case B - Merchant Funded Accumulation (CLAIM with value from merchant)
  // This is when merchant has funded the user's credits with a specific value
  if (paymentMode === 'CLAIM' && merchantId && amount > 0) {
    return 'B';
  }

  // Case A - Merchant Protagonist (CLAIM without specific value)
  // General certification path where merchant prepaid the lot
  if (paymentMode === 'CLAIM') {
    return 'A';
  }

  // Case C - Checkout Suggestion (PAY or ALLOCATION)
  // PAY: Customer pays via Stripe
  // ALLOCATION: Partner checkout with amount in URL
  if (paymentMode === 'PAY' || paymentMode === 'ALLOCATION') {
    return 'C';
  }

  // Case E - General Landing (no SKU or marketing)
  return 'E';
}
