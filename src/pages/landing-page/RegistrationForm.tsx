// Registration Form Component
import { useState } from 'react';

interface RegistrationFormProps {
  onSubmit: (userData: any) => void;
  loading: boolean;
}

export default function RegistrationForm({ onSubmit, loading }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
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
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.state.trim()) newErrors.state = 'State/Province is required';
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="animate-on-load fade-right duration-fast">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load zoom-in duration-normal ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1 animate-on-load fade-up duration-very-fast">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div className="animate-on-load fade-left duration-fast">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-very-fast">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load zoom-in duration-normal ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1 animate-on-load fade-up duration-very-fast">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="animate-on-load fade-up duration-normal">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-right duration-fast">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load flip-up duration-light-slow ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1 animate-on-load fade-left duration-very-fast">{errors.email}</p>}
      </div>

      {/* Date of Birth */}
      <div className="animate-on-load fade-down duration-light-slow">
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-left duration-fast">
          Date of Birth *
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load zoom-out duration-normal ${
            errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 animate-on-load fade-right duration-very-fast">{errors.dateOfBirth}</p>}
      </div>

      {/* Street */}
      <div className="animate-on-load fade-right duration-slow">
        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-up duration-fast">
          Street Address *
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load flip-down duration-normal ${
            errors.street ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors.street && <p className="text-red-500 text-xs mt-1 animate-on-load fade-down duration-very-fast">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <div className="animate-on-load zoom-in duration-normal">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-right duration-very-fast">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load fade-up duration-fast ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1 animate-on-load zoom-in duration-very-fast">{errors.city}</p>}
        </div>

        {/* State/Province */}
        <div className="animate-on-load zoom-out duration-normal">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-left duration-very-fast">
            State/Province *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load fade-down duration-fast ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.state && <p className="text-red-500 text-xs mt-1 animate-on-load zoom-out duration-very-fast">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Postal Code */}
        <div className="animate-on-load flip-up duration-light-slow">
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-down duration-fast">
            Postal Code *
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load fade-left duration-normal ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.postalCode && <p className="text-red-500 text-xs mt-1 animate-on-load flip-up duration-very-fast">{errors.postalCode}</p>}
        </div>

        {/* Country */}
        <div className="animate-on-load flip-down duration-light-slow">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1 animate-on-load fade-up duration-fast">
            Country *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent animate-on-load fade-right duration-normal ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Select a country</option>
            <option value="Italy">Italy</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Spain">Spain</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Belgium">Belgium</option>
            <option value="Austria">Austria</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Portugal">Portugal</option>
            <option value="Greece">Greece</option>
            <option value="Poland">Poland</option>
            <option value="Sweden">Sweden</option>
            <option value="Denmark">Denmark</option>
            <option value="Norway">Norway</option>
            <option value="Finland">Finland</option>
            <option value="Ireland">Ireland</option>
            <option value="Czech Republic">Czech Republic</option>
            <option value="Hungary">Hungary</option>
            <option value="Romania">Romania</option>
            <option value="Bulgaria">Bulgaria</option>
            <option value="Croatia">Croatia</option>
            <option value="Slovenia">Slovenia</option>
            <option value="Slovakia">Slovakia</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
          {errors.country && <p className="text-red-500 text-xs mt-1 animate-on-load flip-down duration-very-fast">{errors.country}</p>}
        </div>
      </div>

      {/* Terms and Conditions - Mandatory Checkbox */}
      <div className="flex items-start animate-on-load fade-up duration-slow bg-gray-50 p-4 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          id="termsAccepted"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
          className="mt-1 mr-3 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 animate-on-load zoom-in duration-fast"
          disabled={loading}
        />
        <label htmlFor="termsAccepted" className="text-sm text-gray-700 leading-relaxed animate-on-load fade-right duration-normal">
          I accept the{' '}
          <a
            href="/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 underline font-medium"
          >
            Terms of Service
          </a>{' '}
          and confirm that I have read the{' '}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 underline font-medium"
          >
            Privacy Policy
          </a>
          . *
        </label>
      </div>
      {errors.termsAccepted && (
        <p className="text-red-500 text-xs mt-2 animate-on-load fade-left duration-very-fast">{errors.termsAccepted}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
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
        ) : 'Submit'}
      </button>
    </form>
  );
}
