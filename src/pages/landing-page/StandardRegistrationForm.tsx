// Standard Registration Form Component - Email + Name
// Used for PAY and ALLOCATION transactions under €10 threshold
import { useState } from 'react';

interface StandardRegistrationFormProps {
  onSubmit: (userData: {
    email: string;
    firstName: string;
    lastName: string;
    termsAccepted: boolean;
  }) => void;
  loading: boolean;
  amount?: number;
  threshold?: number;
}

export default function StandardRegistrationForm({
  onSubmit,
  loading,
  amount = 0,
  threshold = 10
}: StandardRegistrationFormProps) {
  // Determine button text based on €10 threshold
  const isAboveThreshold = amount >= threshold;
  const buttonText = isAboveThreshold
    ? 'Activate Account'
    : 'Start Building Your Portfolio';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-on-load fade-down duration-fast">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> If you already have an account with this email, we'll use your existing information and create a new transaction for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="animate-on-load fade-right duration-normal">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1 animate-on-load fade-up duration-fast">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div className="animate-on-load fade-left duration-normal">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1 animate-on-load fade-up duration-fast">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="animate-on-load zoom-in duration-light-slow">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1 animate-on-load fade-left duration-fast">{errors.email}</p>}
      </div>

      {/* Terms and Conditions - Mandatory Checkbox */}
      <div className="flex items-start animate-on-load flip-up duration-slow bg-gray-50 p-4 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          id="termsAccepted"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
          className="mt-1 mr-3 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          disabled={loading}
        />
        <label htmlFor="termsAccepted" className="text-sm text-gray-700 leading-relaxed">
          I accept the{' '}
          <button
            type="button"
            onClick={() => window.open('/terms-and-conditions', '_blank')}
            className="text-emerald-600 hover:text-emerald-700 underline font-medium bg-transparent border-none p-0 cursor-pointer"
          >
            Terms of Service
          </button>{' '}
          and confirm that I have read the{' '}
          <button
            type="button"
            onClick={() => window.open('/privacy-policy', '_blank')}
            className="text-emerald-600 hover:text-emerald-700 underline font-medium bg-transparent border-none p-0 cursor-pointer"
          >
            Privacy Policy
          </button>
          . *
        </label>
      </div>
      {errors.termsAccepted && (
        <p className="text-red-500 text-xs mt-2 animate-on-load fade-left duration-fast">{errors.termsAccepted}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none animate-on-load zoom-out duration-very-slow"
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
    </form>
  );
}
