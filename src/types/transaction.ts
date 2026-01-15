// Transaction TypeScript interfaces - Section 10 Dashboard
// Ensures type safety across user and merchant dashboards

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'n/a';

export type PaymentMode = 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION';

export interface SKUInfo {
  id: string;
  code: string;
  name: string;
  paymentMode: PaymentMode;
}

export interface Transaction {
  id: string;
  userId: string;
  skuId: string;
  masterId: string;
  merchantId?: string;
  partnerId?: string;
  orderId?: string;
  amount: number; // Euros spent
  calculatedImpact: number; // Grams of plastic removed
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  giftCardCodeId?: string;
  corsairConnectFlag: boolean; // True if amount >= threshold
  createdAt: string;
  updatedAt: string;
  sku?: SKUInfo; // Associated SKU data
}

export interface UserInfo {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  registrationLevel: 'minimal' | 'standard' | 'full';
}

// For admin transaction display with user info
export interface TransactionWithUser extends Transaction {
  user: UserInfo;
}
