// Delete Account Component
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteUser } from '../../store/userSlice';

interface DeleteAccountProps {
  userId: string;
}

export default function DeleteAccount({ userId }: DeleteAccountProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.users);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const handleDelete = async () => {
    if (confirmationText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    const result = await dispatch(deleteUser(userId));
    if (deleteUser.fulfilled.match(result)) {
      // Redirect to home page after successful deletion
      navigate('/');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
      <p className="text-gray-600 mb-6">
        Permanently delete your account and anonymize all your data. This action cannot be undone.
        Your transaction history will be preserved but your personal information will be removed.
      </p>

      {!showConfirmation ? (
        <button
          onClick={() => setShowConfirmation(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Delete My Account
        </button>
      ) : (
        <div className="border border-red-300 rounded-lg p-6 bg-red-50">
          <h3 className="text-lg font-bold text-red-800 mb-4">Confirm Account Deletion</h3>
          <p className="text-red-700 mb-4">
            This will permanently delete your account and anonymize your data. Your transaction
            history will remain for compliance purposes, but your personal information will be removed.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-red-800 mb-2">
              Type "DELETE" to confirm:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Type DELETE"
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-900">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={loading || confirmationText !== 'DELETE'}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button
              onClick={() => {
                setShowConfirmation(false);
                setConfirmationText('');
              }}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Warning:</strong> Deleting your account will anonymize all your personal data.
          This action is irreversible and you will not be able to recover your account.
        </p>
      </div>
    </div>
  );
}
