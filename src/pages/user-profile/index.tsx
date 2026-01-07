// User Profile Page
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserById } from '../../store/userSlice';
import ProfileForm from './ProfileForm';
import DataExport from './DataExport';
import DeleteAccount from './DeleteAccount';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentUser, loading, error } = useAppSelector((state) => state.users);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [userId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Failed to load user profile'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">User Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
            <button
              onClick={() => navigate(`/user/${userId}`)}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
          <ProfileForm
            user={currentUser}
            isEditing={isEditing}
            onCancelEdit={() => setIsEditing(false)}
            onSaveSuccess={() => setIsEditing(false)}
          />
        </div>

        {/* Data Export */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <DataExport userId={currentUser.id} />
        </div>

        {/* Delete Account */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <DeleteAccount userId={currentUser.id} />
        </div>
      </div>
    </div>
  );
}
