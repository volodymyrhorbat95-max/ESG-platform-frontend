// Minimal Registration Form - Email Only (CLAIM Type)
import { useState } from 'react';

interface MinimalRegistrationFormProps {
  onSubmit: (email: string) => void;
  loading: boolean;
  amount?: number;
  threshold?: number;
}

export default function MinimalRegistrationForm({
  onSubmit,
  loading,
  amount = 0,
  threshold = 10
}: MinimalRegistrationFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Determine button text based on €10 threshold
  const isAboveThreshold = amount >= threshold;
  const buttonText = isAboveThreshold
    ? 'Activate Account'
    : 'Start Building Your Portfolio';

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (validate()) {
      onSubmit(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-on-load fade-down duration-normal">
        <p className="text-sm text-green-800 animate-on-load fade-right duration-fast">
          <strong>Quick Registration:</strong> Just provide your email to receive your environmental impact certificate.
        </p>
      </div>

      {/* Email Input */}
      <div className="animate-on-load fade-up duration-fast">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-right duration-very-fast">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load zoom-in duration-normal ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
          required
        />
        {error && (
          <p className="text-sm text-red-600 mt-2 animate-on-load fade-left duration-very-fast">
            {error}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none animate-on-load zoom-in duration-slow"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : buttonText}
      </button>

      {/* Privacy Note */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg animate-on-load fade-up duration-light-slow">
        <p className="text-xs text-gray-600 animate-on-load fade-left duration-normal">
          By submitting your email, you agree to our{' '}
          <button
            type="button"
            onClick={() => window.open('/terms-and-conditions', '_blank')}
            className="text-primary hover:underline underline cursor-pointer bg-transparent border-none p-0 font-inherit"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => window.open('/privacy-policy', '_blank')}
            className="text-primary hover:underline underline cursor-pointer bg-transparent border-none p-0 font-inherit"
          >
            Privacy Policy
          </button>
          .
        </p>
      </div>
    </form>
  );
}
