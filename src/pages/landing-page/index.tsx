// Smart Landing Page - Handles all 4 SKU types
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSKUByCode } from '../../store/skuSlice';
import { registerUser } from '../../store/userSlice';
import { createTransaction } from '../../store/transactionSlice';
import { validateGiftCard } from '../../store/giftCardSlice';
import RegistrationForm from './RegistrationForm';
import GiftCardInput from './GiftCardInput';
import StripePayment from './StripePayment';
import ImpactDisplay from './ImpactDisplay';

export default function LandingPage() {
  const [searchParams] = useSearchParams();
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
  const { validatedCode } = useAppSelector((state) => state.giftCards);

  // Local state
  const [step, setStep] = useState<'loading' | 'display' | 'register' | 'giftcard' | 'payment' | 'success'>('loading');
  const [calculatedImpact, setCalculatedImpact] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);

  // Fetch SKU on mount
  useEffect(() => {
    if (skuCode) {
      dispatch(fetchSKUByCode(skuCode));
    }
  }, [skuCode, dispatch]);

  // Calculate impact and determine flow
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
    }
  }, [currentSKU, urlAmount]);

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

  // Missing SKU code - show error immediately
  if (!skuCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center animate-on-load zoom-in duration-normal">
          <div className="text-6xl mb-4 animate-on-load fade-down duration-fast">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 animate-on-load fade-up duration-normal">SKU Code Required</h1>
          <p className="text-gray-600 animate-on-load fade-right duration-light-slow">Please provide a SKU code in the URL.</p>
          <p className="text-sm text-gray-500 mt-4 animate-on-load fade-left duration-slow">Example: ?sku=LOT-01</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (skuLoading || step === 'loading') {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center animate-on-load zoom-in duration-normal">
          <div className="text-6xl mb-4 animate-on-load flip-up duration-fast">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 animate-on-load fade-down duration-light-slow">Success!</h1>
          <p className="text-gray-600 mb-4 animate-on-load fade-left duration-normal">
            Your transaction has been recorded successfully.
          </p>
          <div className="animate-on-load zoom-out duration-slow">
            <ImpactDisplay impact={calculatedImpact} />
          </div>
          <p className="text-sm text-gray-500 mt-4 animate-on-load fade-up duration-very-slow">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-on-load fade-down duration-normal">CSR26 Impact Processor</h1>
          <p className="text-gray-600 animate-on-load fade-up duration-light-slow">Plastic Neutral Transaction Platform</p>
        </div>

        {/* SKU Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 animate-on-load fade-right duration-normal">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-left duration-fast">{currentSKU.name}</h2>
          <p className="text-gray-600 mb-4 animate-on-load fade-up duration-light-slow">SKU Code: {currentSKU.code}</p>

          {/* Impact Display */}
          <div className="animate-on-load zoom-in duration-slow">
            <ImpactDisplay impact={calculatedImpact} />
          </div>

          {finalAmount > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg animate-on-load flip-up duration-normal">
              <p className="text-lg font-semibold text-gray-800 animate-on-load fade-right duration-fast">
                Amount: €{finalAmount.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Conditional Forms */}
        <div className="bg-white rounded-xl shadow-lg p-8 animate-on-load fade-left duration-light-slow">
          {step === 'giftcard' && (
            <div className="animate-on-load zoom-in duration-normal">
              <GiftCardInput
                onValidate={handleGiftCardValidate}
                loading={false}
              />
            </div>
          )}

          {step === 'display' && (
            <div className="animate-on-load fade-up duration-normal">
              <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">
                {currentSKU.paymentMode === 'CLAIM' && 'Claim Your Impact'}
                {currentSKU.paymentMode === 'PAY' && 'Register and Pay'}
                {currentSKU.paymentMode === 'ALLOCATION' && 'Register Your Environmental Allocation'}
              </h3>
              <div className="animate-on-load fade-right duration-light-slow">
                <RegistrationForm onSubmit={handleRegister} loading={transactionLoading} />
              </div>
            </div>
          )}

          {step === 'register' && (
            <div className="animate-on-load fade-up duration-normal">
              <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-left duration-fast">Complete Registration</h3>
              <div className="animate-on-load zoom-out duration-light-slow">
                <RegistrationForm onSubmit={handleRegister} loading={transactionLoading} />
              </div>
            </div>
          )}

          {step === 'payment' && currentUser && (
            <div className="animate-on-load flip-up duration-normal">
              <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">Complete Payment</h3>
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
      </div>
    </div>
  );
}
