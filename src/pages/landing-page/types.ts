// Landing Page Types

// Case types for dynamic messaging (5 cases from conversation.txt)
export type CaseType = 'A' | 'B' | 'C' | 'D' | 'E';

// Step types for the user journey
export type StepType =
  | 'loading'           // Initial loading state
  | 'sku-input'         // No SKU in URL - ask user to enter
  | 'amount-input'      // ALLOCATION without amount - ask user to choose
  | 'giftcard-input'    // GIFT_CARD - ask for secret code
  | 'admin-login'       // ADMIN SKU - ask for admin secret code
  | 'registration'      // Show registration form
  | 'payment'           // PAY mode - show Stripe payment
  | 'success';          // Transaction completed

// SKU type from Redux store
export interface SKU {
  id: string;
  code: string;
  name: string;
  paymentMode: 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION';
  price: number;
  impactMultiplier: number;
  requiresValidation: boolean;
  corsairThreshold: number;
  isActive: boolean;
}

// URL parameters
export interface URLParams {
  skuCode: string | null;
  urlAmount: string | null;
  partnerId: string | null;
  merchantId: string | null;
  orderId: string | null;
}

// Corsair threshold constant (€10)
export const CORSAIR_THRESHOLD = 10;
