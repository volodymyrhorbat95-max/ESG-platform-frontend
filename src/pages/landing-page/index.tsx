// Smart Landing Page - Main Entry Point
// Handles all 4 SKU types + 5 Dynamic Cases
// Structure: Header > Dynamic Message > Technical Block > Action > Footer

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSKUByCode } from '../../store/skuSlice';
import { registerUser, registerMinimalUser, registerStandardUser } from '../../store/userSlice';
import { createTransaction } from '../../store/transactionSlice';
import { validateGiftCard } from '../../store/giftCardSlice';
import { loginAdmin } from '../../store/authSlice';
import { fetchMerchantById } from '../../store/merchantSlice';
import { fetchCurrentCSRPrice, fetchAllocationMultiplier, fetchCorsairThreshold } from '../../store/configSlice';

// Types and utils
import type { CaseType, StepType } from './types';
import { CORSAIR_THRESHOLD } from './types';
import { determineCaseType } from './utils';

// Components
import SkuInputForm from './SkuInputForm';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import SuccessState from './SuccessState';
import SkuInfoCard from './SkuInfoCard';
import AmountSelector from './AmountSelector';
import HeaderSection from './HeaderSection';
import DynamicMessage from './DynamicMessage';
import TechnicalBlock from './TechnicalBlock';
import FooterSection from './FooterSection';
import RegistrationForm from './RegistrationForm';
import StandardRegistrationForm from './StandardRegistrationForm';
import MinimalRegistrationForm from './MinimalRegistrationForm';
import GiftCardInput from './GiftCardInput';
import AdminLogin from './AdminLogin';
import StripePayment from './StripePayment';

export default function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
  const { validatedCode, loading: giftCardLoading, error: giftCardError } = useAppSelector((state) => state.giftCards);
  const { currentMerchant } = useAppSelector((state) => state.merchants);
  const { currentCSRPrice, allocationMultiplier, corsairThreshold } = useAppSelector((state) => state.config);

  // Local state
  const [step, setStep] = useState<StepType>('loading');
  const [calculatedImpact, setCalculatedImpact] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [caseType, setCaseType] = useState<CaseType>('E');
  const [giftCardValidated, setGiftCardValidated] = useState(false);
  const [adminError, setAdminError] = useState<string>('');
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);
  const [completedTransactionId, setCompletedTransactionId] = useState<string | null>(null);

  // Get admin SKU from environment
  const ADMIN_SKU = import.meta.env.VITE_ADMIN_SKU;

  // Fetch SKU and config on mount when skuCode is present
  useEffect(() => {
    // Always fetch global configuration for dynamic impact calculation
    dispatch(fetchCurrentCSRPrice());
    dispatch(fetchAllocationMultiplier());
    dispatch(fetchCorsairThreshold());

    if (skuCode) {
      // Check if this is admin SKU
      if (skuCode === ADMIN_SKU) {
        setStep('admin-login');
      } else {
        dispatch(fetchSKUByCode(skuCode));
      }
    } else {
      setStep('sku-input');
    }
  }, [skuCode, dispatch, ADMIN_SKU]);

  // Fetch merchant data when merchantId is present
  useEffect(() => {
    if (merchantId && !currentMerchant) {
      dispatch(fetchMerchantById(merchantId));
    }
  }, [merchantId, currentMerchant, dispatch]);

  // Process SKU data and determine flow
  useEffect(() => {
    if (!currentSKU || currentCSRPrice === null) return;

    let impact = 0;
    let amount = 0;

    // Impact formula: (amount / CURRENT_CSR_PRICE) * impactMultiplier * 1000
    const multiplier = currentSKU.impactMultiplier || 1;

    switch (currentSKU.paymentMode) {
      case 'CLAIM':
        amount = Number(currentSKU.price) || 0;
        impact = Math.round((amount / currentCSRPrice) * multiplier * 1000);
        setStep('registration');
        break;

      case 'PAY':
        amount = Number(currentSKU.price) || 0;
        impact = Math.round((amount / currentCSRPrice) * multiplier * 1000);
        setStep('registration');
        break;

      case 'GIFT_CARD':
        amount = Number(currentSKU.price) || 0;
        impact = Math.round((amount / currentCSRPrice) * multiplier * 1000);
        if (giftCardValidated || validatedCode) {
          setStep('registration');
        } else {
          setStep('giftcard-input');
        }
        break;

      case 'ALLOCATION':
        if (urlAmount) {
          amount = parseFloat(urlAmount);
          // ALLOCATION uses SPECIAL formula: amount × ALLOCATION_MULTIPLIER × 1000
          // CRITICAL: Uses global ALLOCATION_MULTIPLIER, NOT SKU's impactMultiplier
          // This does NOT use CURRENT_CSR_PRICE!
          // Example: €5 × 1.6 × 1000 = 8,000 grams (8 kg)
          // Example: €15 × 1.6 × 1000 = 24,000 grams (24 kg)
          const allocationMult = allocationMultiplier ?? 1.6; // Fallback to 1.6 if not loaded yet
          impact = Math.round(amount * allocationMult * 1000);
          setStep('registration');
        } else {
          setStep('amount-input');
        }
        break;

      default:
        amount = Number(currentSKU.price) || 0;
        impact = Math.round((amount / currentCSRPrice) * multiplier * 1000);
        setStep('registration');
    }

    setCalculatedImpact(impact);
    setFinalAmount(amount);
    setCaseType(determineCaseType(
      currentSKU.paymentMode,
      merchantId,
      currentSKU.paymentMode === 'GIFT_CARD',
      amount
    ));
  }, [currentSKU, currentCSRPrice, allocationMultiplier, urlAmount, merchantId, giftCardValidated, validatedCode]);

  // Handlers
  const handleSkuSubmit = (sku: string) => {
    setSearchParams({ sku });
  };

  const handleAmountSubmit = (amount: number) => {
    if (skuCode) {
      const newParams: Record<string, string> = { sku: skuCode, amount: amount.toString() };
      if (merchantId) newParams.merchant = merchantId;
      if (partnerId) newParams.partner = partnerId;
      if (orderId) newParams.order = orderId;
      setSearchParams(newParams);
    }
  };

  const handleGiftCardValidate = async (code: string) => {
    try {
      // Section 8.2: Validate the code with SKU verification
      // (but don't redeem yet - redemption happens during transaction creation)
      await dispatch(validateGiftCard({
        code,
        skuId: currentSKU?.id // Pass SKU ID to verify code matches expected product
      })).unwrap();
      setGiftCardValidated(true);
      setStep('registration');
    } catch (error) {
      console.error('Gift card validation failed:', error);
    }
  };

  const handleAdminLogin = async (code: string) => {
    try {
      setAdminError('');
      await dispatch(loginAdmin(code)).unwrap();
      // Redirect to admin SKUs page after successful login
      navigate('/admin/skus');
    } catch (error: any) {
      console.error('Admin login failed:', error);
      setAdminError(error || 'Invalid admin code');
    }
  };

  const handleMinimalRegister = async (email: string) => {
    try {
      console.log('🚀 Starting minimal registration with email:', email);
      // Use minimal user registration for CLAIM type (email only)
      const result = await dispatch(registerMinimalUser({ email })).unwrap();
      console.log('✅ Minimal registration SUCCESS, result:', result);
      const { user, sessionToken } = result;
      console.log('✅ User ID:', user.id);
      console.log('✅ Session Token received:', sessionToken ? 'YES' : 'NO');

      // Set user as authenticated in userAuth slice (with sessionToken)
      const { setAuthenticatedUser } = await import('../../store/userAuthSlice');
      dispatch(setAuthenticatedUser({ user, sessionToken }));

      if (currentSKU && currentSKU.paymentMode === 'CLAIM') {
        await handleCreateTransaction(user.id);
      }
    } catch (error) {
      console.error('❌ Minimal registration failed:', error);
    }
  };

  // Standard registration handler for PAY/ALLOCATION under €10 threshold
  const handleStandardRegister = async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    termsAccepted: boolean;
  }) => {
    try {
      const result = await dispatch(registerStandardUser(userData)).unwrap();
      const { user, sessionToken } = result;

      // Set user as authenticated in userAuth slice (with sessionToken)
      const { setAuthenticatedUser } = await import('../../store/userAuthSlice');
      dispatch(setAuthenticatedUser({ user, sessionToken }));

      if (currentSKU) {
        if (currentSKU.paymentMode === 'ALLOCATION') {
          await handleCreateTransaction(user.id);
        } else if (currentSKU.paymentMode === 'PAY') {
          // Create PENDING transaction FIRST for PAY mode
          const transaction = await dispatch(createTransaction({
            userId: user.id,
            skuCode: currentSKU.code,
            amount: finalAmount,
            partnerId: partnerId || undefined,
            merchantId: merchantId || undefined,
            orderId: orderId || undefined,
          })).unwrap();

          // Store transaction ID for payment step
          setPendingTransactionId(transaction.id);
          setStep('payment');
        }
      }
    } catch (error) {
      console.error('Standard registration failed:', error);
    }
  };

  // Full registration handler for transactions >= €10 threshold or GIFT_CARD
  const handleRegister = async (userData: any) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      // Backend returns { user, sessionToken }
      const { user, sessionToken } = result;

      // Set user as authenticated in userAuth slice (with sessionToken)
      const { setAuthenticatedUser } = await import('../../store/userAuthSlice');
      dispatch(setAuthenticatedUser({ user, sessionToken }));

      if (currentSKU) {
        if (currentSKU.paymentMode === 'ALLOCATION') {
          await handleCreateTransaction(user.id);
        } else if (currentSKU.paymentMode === 'PAY') {
          // Create PENDING transaction FIRST for PAY mode
          const transaction = await dispatch(createTransaction({
            userId: user.id,
            skuCode: currentSKU.code,
            amount: finalAmount,
            partnerId: partnerId || undefined,
            merchantId: merchantId || undefined,
            orderId: orderId || undefined,
          })).unwrap();

          // Store transaction ID for payment step
          setPendingTransactionId(transaction.id);
          setStep('payment');
        } else if (currentSKU.paymentMode === 'GIFT_CARD') {
          await handleCreateTransaction(user.id, validatedCode?.code);
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleCreateTransaction = async (userId: string, giftCardCode?: string) => {
    if (!currentSKU) return;

    try {
      const transaction = await dispatch(createTransaction({
        userId,
        skuCode: currentSKU.code,
        amount: finalAmount,
        partnerId: partnerId || undefined,
        merchantId: merchantId || undefined,
        orderId: orderId || undefined,
        giftCardCode: giftCardCode || undefined,
      })).unwrap();

      setCompletedTransactionId(transaction.id);
      setStep('success');
      setTimeout(() => navigate(`/dashboard/${userId}`), 3000);
    } catch (error) {
      console.error('Transaction creation failed:', error);
    }
  };

  const handlePaymentSuccess = async (_paymentIntentId: string) => {
    // Transaction already created with PENDING status
    // Webhook will update it to COMPLETED
    // Store the pending transaction ID for display
    if (pendingTransactionId) {
      setCompletedTransactionId(pendingTransactionId);
    }
    setStep('success');
    setTimeout(() => navigate(`/dashboard/${currentUser?.id}`), 3000);
  };

  const handleRetry = () => {
    setSearchParams({});
  };

  // Render based on step
  if (step === 'sku-input' || !skuCode) {
    return <SkuInputForm onSubmit={handleSkuSubmit} />;
  }

  if (skuLoading || step === 'loading') {
    return <LoadingState />;
  }

  if (skuError || !currentSKU) {
    return <ErrorState error={skuError || undefined} onRetry={handleRetry} />;
  }

  if (step === 'success') {
    return (
      <SuccessState
        caseType={caseType}
        skuName={currentSKU.name}
        partnerId={partnerId || undefined}
        calculatedImpact={calculatedImpact}
        finalAmount={finalAmount}
        userId={currentUser?.id}
        skuCode={currentSKU.code}
        transactionId={completedTransactionId || undefined}
      />
    );
  }

  // Debug logging
  console.log('🎯 Landing Page State:', {
    step,
    skuCode,
    paymentMode: currentSKU?.paymentMode,
    finalAmount,
    calculatedImpact,
    currentUserId: currentUser?.id,
    hasCurrentUser: !!currentUser,
    currentSKUCode: currentSKU?.code
  });

  // Main Landing Page
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 1. HEADER */}
        <HeaderSection partnerName={partnerId || undefined} />

        {/* 2. DYNAMIC MESSAGE */}
        <div className="mb-6">
          <DynamicMessage
            caseType={caseType}
            merchantName={currentSKU.name}
            partnerName={partnerId || undefined}
            impactGrams={calculatedImpact}
            amount={finalAmount}
            threshold={CORSAIR_THRESHOLD}
            skuCode={currentSKU.code}
            skuName={currentSKU.name}
          />
        </div>

        {/* 3. TECHNICAL BLOCK */}
        <TechnicalBlock />

        {/* 4. ACTION SECTION */}
        <div className="bg-white rounded-xl shadow-lg p-8 my-6">
          <SkuInfoCard
            skuName={currentSKU.name}
            skuCode={currentSKU.code}
            calculatedImpact={calculatedImpact}
            finalAmount={finalAmount}
          />

          {step === 'amount-input' && currentCSRPrice && (
            <AmountSelector
              impactMultiplier={currentSKU.impactMultiplier || 1}
              currentCSRPrice={currentCSRPrice}
              onSubmit={handleAmountSubmit}
            />
          )}

          {step === 'giftcard-input' && (
            <GiftCardInput
              onValidate={handleGiftCardValidate}
              loading={giftCardLoading}
              error={giftCardError}
            />
          )}

          {step === 'admin-login' && (
            <AdminLogin
              onLogin={handleAdminLogin}
              loading={false}
              error={adminError}
            />
          )}

          {step === 'registration' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {caseType === 'A' && 'Start Your Personal Journey'}
                {caseType === 'B' && 'Activate Your Environmental Credits'}
                {caseType === 'C' && 'Complete Your Contribution'}
                {caseType === 'D' && 'Complete Your Registration'}
                {caseType === 'E' && 'Build Your Environmental Portfolio'}
              </h3>

              {/* Conditional Form Rendering based on payment mode and amount threshold:
                  - CLAIM: Minimal form (email only)
                  - PAY/ALLOCATION under €10: Standard form (email + name)
                  - PAY/ALLOCATION >= €10 or GIFT_CARD: Full form (all fields)
              */}
              {currentSKU?.paymentMode === 'CLAIM' ? (
                <MinimalRegistrationForm
                  onSubmit={handleMinimalRegister}
                  loading={transactionLoading}
                  amount={finalAmount}
                  threshold={CORSAIR_THRESHOLD}
                />
              ) : currentSKU?.paymentMode === 'GIFT_CARD' ? (
                // GIFT_CARD always requires full registration
                <RegistrationForm
                  onSubmit={handleRegister}
                  loading={transactionLoading}
                  amount={finalAmount}
                  threshold={CORSAIR_THRESHOLD}
                />
              ) : finalAmount >= CORSAIR_THRESHOLD ? (
                // PAY/ALLOCATION >= €10 threshold requires full registration
                <RegistrationForm
                  onSubmit={handleRegister}
                  loading={transactionLoading}
                  amount={finalAmount}
                  threshold={CORSAIR_THRESHOLD}
                />
              ) : (
                // PAY/ALLOCATION under €10 uses standard registration (email + name)
                <StandardRegistrationForm
                  onSubmit={handleStandardRegister}
                  loading={transactionLoading}
                  amount={finalAmount}
                  threshold={CORSAIR_THRESHOLD}
                />
              )}
            </div>
          )}

          {step === 'payment' && currentUser && pendingTransactionId && currentSKU && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Payment</h3>
              <StripePayment
                amount={finalAmount}
                userId={currentUser.id}
                skuId={currentSKU.id}
                transactionId={pendingTransactionId}
                merchantId={merchantId || undefined}
                partnerId={partnerId || undefined}
                merchantStripeAccountId={currentMerchant?.stripeAccountId || undefined}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          )}
        </div>

        {/* 5. FOOTER */}
        <FooterSection />
      </div>
    </div>
  );
}
