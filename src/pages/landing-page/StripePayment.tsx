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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-on-load fade-up duration-normal">
      <div className="bg-blue-50 p-4 rounded-lg animate-on-load zoom-in duration-fast">
        <p className="text-sm text-gray-700 mb-1 animate-on-load fade-right duration-very-fast">Amount to pay:</p>
        <p className="text-3xl font-bold text-gray-800 animate-on-load flip-up duration-light-slow">€{amount.toFixed(2)}</p>
      </div>

      <div className="animate-on-load fade-left duration-normal">
        <label className="block text-sm font-medium text-gray-700 mb-2 animate-on-load fade-down duration-fast">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white animate-on-load zoom-out duration-light-slow">
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-on-load fade-right duration-fast">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing || paymentLoading || !paymentIntent}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load flip-down duration-slow"
      >
        {processing || paymentLoading ? 'Processing...' : `Pay €${amount.toFixed(2)}`}
      </button>

      <div className="text-center animate-on-load fade-up duration-very-slow">
        <p className="text-xs text-gray-500 animate-on-load zoom-in duration-light-slow">
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
