// Landing Page Utility Functions
import type { CaseType } from './types';

// Determine which case (A-E) based on SKU and parameters
export function determineCaseType(
  paymentMode: string,
  merchantId: string | null,
  partnerId: string | null,
  hasGiftCard: boolean
): CaseType {
  // Case D - Gift Card (On-shelf Gift Card)
  if (paymentMode === 'GIFT_CARD' || hasGiftCard) {
    return 'D';
  }

  // Case A - Merchant Protagonist (CLAIM with merchant)
  if (paymentMode === 'CLAIM' && merchantId) {
    return 'A';
  }

  // Case B - Merchant Funded Accumulation (ALLOCATION with merchant funding)
  if (paymentMode === 'ALLOCATION' && merchantId) {
    return 'B';
  }

  // Case C - Checkout Suggestion (ALLOCATION or PAY from partner checkout)
  if ((paymentMode === 'ALLOCATION' || paymentMode === 'PAY') && partnerId) {
    return 'C';
  }

  // Case E - General Landing (Marketing/Direct)
  return 'E';
}
