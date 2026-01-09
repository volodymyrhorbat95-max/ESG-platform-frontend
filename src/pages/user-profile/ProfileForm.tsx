// Profile Form Component
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateUserSelf, type User } from '../../store/userSlice';

interface ProfileFormProps {
  user: User;
  isEditing: boolean;
  onCancelEdit: () => void;
  onSaveSuccess: () => void;
}

export default function ProfileForm({ user, isEditing, onCancelEdit, onSaveSuccess }: ProfileFormProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.users);

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    street: user.street || '',
    city: user.city || '',
    postalCode: user.postalCode || '',
    country: user.country || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out unchanged fields
    const updates: any = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof typeof formData] !== user[key as keyof typeof formData]) {
        updates[key] = formData[key as keyof typeof formData];
      }
    });

    if (Object.keys(updates).length === 0) {
      alert('No changes to save');
      return;
    }

    const result = await dispatch(updateUserSelf({ id: user.id, updates }));
    if (updateUserSelf.fulfilled.match(result)) {
      onSaveSuccess();
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      street: user.street || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      country: user.country || '',
    });
    onCancelEdit();
  };

  if (!isEditing) {
    // View mode
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-on-load fade-right duration-fast">
            <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
            <p className="text-gray-900">{user.firstName}</p>
          </div>
          <div className="animate-on-load fade-left duration-fast">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
            <p className="text-gray-900">{user.lastName}</p>
          </div>
          <div className="animate-on-load zoom-in duration-normal">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div className="animate-on-load flip-up duration-light-slow">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
            <p className="text-gray-900">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
            <p className="text-xs text-gray-500 mt-1">Date of birth cannot be changed</p>
          </div>
          <div className="animate-on-load fade-up duration-slow">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Street</label>
            <p className="text-gray-900">{user.street}</p>
          </div>
          <div className="animate-on-load fade-down duration-slow">
            <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
            <p className="text-gray-900">{user.city}</p>
          </div>
          <div className="animate-on-load zoom-out duration-very-slow">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Postal Code</label>
            <p className="text-gray-900">{user.postalCode}</p>
          </div>
          <div className="animate-on-load flip-down duration-very-slow">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
            <p className="text-gray-900">{user.country}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200 animate-on-load fade-right duration-slow">
          <p className="text-sm text-gray-600">
            Account created: {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Last updated: {new Date(user.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-on-load fade-right duration-fast">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="animate-on-load fade-left duration-fast">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="animate-on-load zoom-in duration-normal">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        <div className="animate-on-load flip-up duration-light-slow">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
          <input
            type="text"
            value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Date of birth cannot be changed</p>
        </div>
        <div className="md:col-span-2 animate-on-load fade-up duration-slow">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Street <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="animate-on-load zoom-out duration-slow">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="animate-on-load flip-down duration-slow">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2 animate-on-load fade-down duration-very-slow">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-on-load fade-left duration-fast">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="flex gap-4 pt-4 animate-on-load fade-right duration-very-slow">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
