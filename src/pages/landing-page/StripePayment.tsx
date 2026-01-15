// Stripe Payment Component - Using Redux for payment intent creation
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createPaymentIntent } from '../../store/paymentSlice';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface StripePaymentProps {
  amount: number;
  userId: string;
  skuId: string;
  transactionId: string;
  merchantId?: string;
  partnerId?: string;
  merchantStripeAccountId?: string;
  onSuccess: (paymentIntentId: string) => void;
}

function PaymentForm({ amount, userId, skuId, transactionId, merchantId, partnerId, merchantStripeAccountId, onSuccess }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();

  const { paymentIntent, loading: paymentLoading, error: paymentError } = useAppSelector(
    (state) => state.payment
  );

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create payment intent on mount via Redux
  useEffect(() => {
    // Validate merchant has Stripe account for PAY mode
    if (merchantId && !merchantStripeAccountId) {
      setError('Merchant payment account not configured. Please contact support.');
      return;
    }

    dispatch(
      createPaymentIntent({
        amount,
        transactionId,
        userId,
        skuId,
        partnerId,
        merchantStripeAccountId,
      })
    );
  }, [amount, transactionId, userId, skuId, partnerId, merchantId, merchantStripeAccountId, dispatch]);

  // Update error from Redux state
  useEffect(() => {
    if (paymentError) {
      setError(paymentError);
    }
  }, [paymentError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !paymentIntent?.clientSecret) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setProcessing(false);
      } else if (confirmedPaymentIntent && confirmedPaymentIntent.status === 'succeeded') {
        onSuccess(confirmedPaymentIntent.id);
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  // Section 7.4: Handle payment retry
  const handleRetry = () => {
    setError(null);
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg animate-on-load fade-down duration-fast">
        <p className="text-sm text-gray-700 mb-1">Amount to pay:</p>
        <p className="text-3xl font-bold text-gray-800 animate-on-load zoom-in duration-normal">€{amount.toFixed(2)}</p>
      </div>

      <div className="animate-on-load fade-up duration-light-slow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Section 7.4: Failed payment error message with retry option */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-on-load fade-left duration-fast">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">Payment Failed</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || processing || paymentLoading || !paymentIntent}
          className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load flip-up duration-slow"
        >
          {processing || paymentLoading ? 'Processing...' : error ? 'Retry Payment' : `Pay €${amount.toFixed(2)}`}
        </button>

        {/* Section 7.4: Clear error button when payment fails */}
        {error && (
          <button
            type="button"
            onClick={handleRetry}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors animate-on-load fade-right duration-fast"
          >
            Clear
          </button>
        )}
      </div>

      <div className="text-center animate-on-load fade-right duration-very-slow">
        <p className="text-xs text-gray-500">
          Secured by Stripe. Your payment information is encrypted and secure.
        </p>
      </div>
    </form>
  );
}

export default function StripePayment(props: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
