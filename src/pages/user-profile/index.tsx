// User Profile Page
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserById } from '../../store/userSlice';
import ProfileForm from './ProfileForm';
import DataExport from './DataExport';
import DeleteAccount from './DeleteAccount';
import { FiHome, FiUser, FiPieChart } from 'react-icons/fi';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Secondary navigation items for user pages
  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: `/dashboard/${userId}`, label: 'Dashboard', icon: FiPieChart },
    { path: `/profile/${userId}`, label: 'Profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen">
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <span className="text-sm font-medium text-gray-600">User Profile</span>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                  (item.path.includes('/profile/') && location.pathname.includes('/profile/'));
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive && !item.path.includes('/dashboard/')
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">User Profile</h1>
                <p className="text-gray-600">Manage your account information</p>
              </div>
              <button
                onClick={() => navigate(`/dashboard/${userId}`)}
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
    </div>
  );
}
