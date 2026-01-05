// Smart Landing Page - Handles all 4 SKU types + 5 Dynamic Cases
// Structure: Header > Dynamic Message > Technical Block > Action > Footer
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSKUByCode } from '../../store/skuSlice';
import { registerUser } from '../../store/userSlice';
import { createTransaction } from '../../store/transactionSlice';
import { validateGiftCard } from '../../store/giftCardSlice';
import { FaLeaf } from 'react-icons/fa';
import HeaderSection from './HeaderSection';
import DynamicMessage from './DynamicMessage';
import TechnicalBlock from './TechnicalBlock';
import FooterSection from './FooterSection';
import RegistrationForm from './RegistrationForm';
import GiftCardInput from './GiftCardInput';
import StripePayment from './StripePayment';
import ImpactDisplay from './ImpactDisplay';

// Determine which case (A-E) based on SKU and parameters
type CaseType = 'A' | 'B' | 'C' | 'D' | 'E';

function determineCaseType(
  paymentMode: string,
  merchantId: string | null,
  partnerId: string | null,
  amount: number
): CaseType {
  // Case D - Gift Card (On-shelf Gift Card)
  if (paymentMode === 'GIFT_CARD') {
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
  if ((paymentMode === 'ALLOCATION' || paymentMode === 'PAY') && (partnerId || amount > 0)) {
    return 'C';
  }

  // Case E - General Landing (Marketing/Direct)
  return 'E';
}

export default function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Local state for SKU input
  const [skuInput, setSkuInput] = useState('');

  // Extract URL parameters
  const skuCode = searchParams.get('sku');
  const urlAmount = searchParams.get('amount');
  const partnerId = searchParams.get('partner');
  const merchantId = searchParams.get('merchant');
  const orderId = searchParams.get('order');

  // Redux state
  const { currentSKU, loading: skuLoading, error: skuError } = useAppSelector((state) => state.skus);
  const { currentUser } = useAppSelector((state) => state.users);
  const { loading: transactionLoading } = useAppSelector((state) => state.transactions);
  const { validatedCode } = useAppSelector((state) => state.giftCards);

  // Local state
  const [step, setStep] = useState<'loading' | 'display' | 'register' | 'giftcard' | 'payment' | 'success'>('loading');
  const [calculatedImpact, setCalculatedImpact] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [caseType, setCaseType] = useState<CaseType>('E');

  // Amplivo threshold (10€)
  const AMPLIVO_THRESHOLD = 10;

  // Fetch SKU on mount
  useEffect(() => {
    if (skuCode) {
      dispatch(fetchSKUByCode(skuCode));
    }
  }, [skuCode, dispatch]);

  // Calculate impact, determine flow, and set case type
  useEffect(() => {
    if (currentSKU) {
      let impact = 0;
      let amount = 0;

      switch (currentSKU.paymentMode) {
        case 'CLAIM':
          // Fixed impact from gramsWeight
          impact = currentSKU.gramsWeight;
          amount = 0;
          setStep('display');
          break;

        case 'PAY':
          // Fixed price and impact
          impact = currentSKU.gramsWeight;
          amount = currentSKU.price;
          setStep('display');
          break;

        case 'GIFT_CARD':
          // Fixed impact, requires code validation
          impact = currentSKU.gramsWeight;
          amount = currentSKU.price;
          setStep('giftcard');
          break;

        case 'ALLOCATION':
          // Dynamic calculation: amount × impactMultiplier
          if (urlAmount) {
            amount = parseFloat(urlAmount);
            impact = amount * currentSKU.impactMultiplier;
            setStep('display');
          }
          break;
      }

      setCalculatedImpact(impact);
      setFinalAmount(amount);

      // Determine case type for dynamic messaging
      const detectedCase = determineCaseType(currentSKU.paymentMode, merchantId, partnerId, amount);
      setCaseType(detectedCase);
    }
  }, [currentSKU, urlAmount, merchantId, partnerId]);

  // Handle registration submission
  const handleRegister = async (userData: any) => {
    try {
      const user = await dispatch(registerUser(userData)).unwrap();

      // After registration, create transaction based on SKU type
      if (currentSKU) {
        if (currentSKU.paymentMode === 'CLAIM' || currentSKU.paymentMode === 'ALLOCATION') {
          // No payment needed - create transaction directly
          await handleCreateTransaction(user.id);
        } else if (currentSKU.paymentMode === 'PAY') {
          // Requires payment
          setStep('payment');
        } else if (currentSKU.paymentMode === 'GIFT_CARD' && validatedCode) {
          // Gift card already validated, create transaction
          await handleCreateTransaction(user.id, validatedCode.code);
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Handle gift card validation
  const handleGiftCardValidate = async (code: string, userId: string) => {
    try {
      await dispatch(validateGiftCard({ code, userId })).unwrap();
      setStep('register');
    } catch (error) {
      console.error('Gift card validation failed:', error);
    }
  };

  // Create transaction
  const handleCreateTransaction = async (userId: string, giftCardCode?: string) => {
    if (!currentSKU) return;

    try {
      const transactionData: any = {
        userId,
        skuCode: currentSKU.code,
        amount: finalAmount,
      };

      if (partnerId) transactionData.partnerId = partnerId;
      if (merchantId) transactionData.merchantId = merchantId;
      if (orderId) transactionData.orderId = orderId;
      if (giftCardCode) transactionData.giftCardCode = giftCardCode;

      await dispatch(createTransaction(transactionData)).unwrap();
      setStep('success');

      // Redirect to user dashboard after 3 seconds
      setTimeout(() => {
        navigate(`/dashboard/${userId}`);
      }, 3000);
    } catch (error) {
      console.error('Transaction creation failed:', error);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    if (currentUser) {
      await handleCreateTransaction(currentUser.id);
    }
  };

  // Handle SKU code submission
  const handleSkuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skuInput.trim()) {
      setSearchParams({ sku: skuInput.trim() });
    }
  };

  // Missing SKU code - show input form
  if (!skuCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full animate-on-load zoom-in duration-normal">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaLeaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">CSR26 Impact Processor</h1>
            <p className="text-gray-600">Enter your SKU code to start your environmental journey</p>
          </div>

          <form onSubmit={handleSkuSubmit} className="space-y-4">
            <div>
              <label htmlFor="skuCode" className="block text-sm font-medium text-gray-700 mb-1">
                SKU Code
              </label>
              <input
                type="text"
                id="skuCode"
                value={skuInput}
                onChange={(e) => setSkuInput(e.target.value)}
                placeholder="e.g., LOT-CONAD-01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!skuInput.trim()}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your SKU code can be found on your receipt or product packaging
          </p>
        </div>
      </div>
    );
  }

  // Loading state - only show when actually fetching SKU data
  if (skuLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center animate-on-load zoom-in duration-fast">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 animate-on-load fade-up duration-normal">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (skuError || !currentSKU) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center animate-on-load zoom-in duration-normal">
          <div className="text-6xl mb-4 animate-on-load flip-down duration-fast">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 animate-on-load fade-up duration-light-slow">Invalid SKU Code</h1>
          <p className="text-gray-600 animate-on-load fade-right duration-slow">{skuError || 'SKU not found'}</p>
        </div>
      </div>
    );
  }

  // Success state
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <HeaderSection partnerName={currentSKU.name || partnerId || undefined} />

          <div className="bg-white p-8 rounded-xl shadow-lg text-center animate-on-load zoom-in duration-normal">
            <div className="text-6xl mb-4 animate-on-load flip-up duration-fast">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-on-load fade-down duration-light-slow">Success!</h2>
            <p className="text-gray-600 mb-4 animate-on-load fade-left duration-normal">
              Your transaction has been recorded successfully.
            </p>

            {/* Dynamic Message for Success */}
            <div className="my-6 animate-on-load fade-up duration-light-slow">
              <DynamicMessage
                caseType={caseType}
                merchantName={currentSKU.name || undefined}
                partnerName={partnerId || undefined}
                impactGrams={calculatedImpact}
                amount={finalAmount}
                threshold={AMPLIVO_THRESHOLD}
              />
            </div>

            <div className="animate-on-load zoom-out duration-slow">
              <ImpactDisplay impact={calculatedImpact} />
            </div>

            <p className="text-sm text-gray-500 mt-4 animate-on-load fade-up duration-very-slow">
              Redirecting to your dashboard...
            </p>
          </div>

          <FooterSection />
        </div>
      </div>
    );
  }

  // Main Landing Page - New Structure
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 1. HEADER (Authority) - Universal */}
        <HeaderSection partnerName={currentSKU.name || partnerId || undefined} />

        {/* 2. DYNAMIC MESSAGE (Context) - Based on Case A-E */}
        <div className="mb-6 animate-on-load fade-up duration-normal">
          <DynamicMessage
            caseType={caseType}
            merchantName={currentSKU.name || undefined}
            partnerName={partnerId || undefined}
            impactGrams={calculatedImpact}
            amount={finalAmount}
            threshold={AMPLIVO_THRESHOLD}
          />
        </div>

        {/* 3. TECHNICAL BLOCK (The Proof) - CSR26 Industrial Model */}
        <TechnicalBlock />

        {/* 4. ACTION SECTION (Forms + Buttons) */}
        <div className="bg-white rounded-xl shadow-lg p-8 my-6 animate-on-load fade-up duration-light-slow">
          {/* SKU Information Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 animate-on-load fade-right duration-normal">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-on-load fade-left duration-fast">
              {currentSKU.name}
            </h2>
            <p className="text-gray-500 text-sm mb-4 animate-on-load fade-up duration-light-slow">
              SKU: {currentSKU.code}
            </p>

            {/* Impact Display */}
            <div className="animate-on-load zoom-in duration-slow">
              <ImpactDisplay impact={calculatedImpact} />
            </div>

            {finalAmount > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg animate-on-load flip-up duration-normal">
                <p className="text-lg font-semibold text-gray-800 animate-on-load fade-right duration-fast">
                  Amount: €{finalAmount.toFixed(2)}
                </p>
                {finalAmount >= AMPLIVO_THRESHOLD && (
                  <p className="text-sm text-emerald-600 mt-1 animate-on-load fade-up duration-light-slow">
                    Qualifies for Certified Environmental Asset
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Gift Card Input Step */}
          {step === 'giftcard' && (
            <div className="animate-on-load zoom-in duration-normal">
              <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">
                Enter Your Gift Card Code
              </h3>
              <GiftCardInput
                onValidate={handleGiftCardValidate}
                loading={false}
              />
            </div>
          )}

          {/* Registration Form Step */}
          {step === 'display' && (
            <div className="animate-on-load fade-up duration-normal">
              <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">
                {caseType === 'A' && 'Start Your Personal Journey'}
                {caseType === 'B' && 'Activate Your Environmental Credits'}
                {caseType === 'C' && 'Complete Your Contribution'}
                {caseType === 'D' && 'Redeem Your Gift Card'}
                {caseType === 'E' && 'Build Your Environmental Portfolio'}
              </h3>
              <div className="animate-on-load fade-right duration-light-slow">
                <RegistrationForm onSubmit={handleRegister} loading={transactionLoading} />
              </div>
            </div>
          )}

          {/* Registration Form Step (after gift card validation) */}
          {step === 'register' && (
            <div className="animate-on-load fade-up duration-normal">
              <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-left duration-fast">
                Complete Your Registration
              </h3>
              <div className="animate-on-load zoom-out duration-light-slow">
                <RegistrationForm onSubmit={handleRegister} loading={transactionLoading} />
              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && currentUser && (
            <div className="animate-on-load flip-up duration-normal">
              <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">
                Complete Payment
              </h3>
              <div className="animate-on-load fade-up duration-light-slow">
                <StripePayment
                  amount={finalAmount}
                  userId={currentUser.id}
                  merchantId={merchantId || undefined}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            </div>
          )}
        </div>

        {/* 5. FOOTER (Legal Guarantee) */}
        <FooterSection />
      </div>
    </div>
  );
}
