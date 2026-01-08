// Admin User Management - View all users, search by email, view transaction history
// CRITICAL: Follows end-to-end data flow - NO direct API calls
// Flow: dispatch -> Redux -> API -> Backend -> Database -> Redux -> useSelector -> UI

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllUsers, fetchUserByEmail } from '../../store/userSlice';
import UserTable from './UserTable';
import UserDetails from './UserDetails';

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);

  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Fetch all users on mount
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Handle email search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) {
      setSearchResult(null);
      setSearchError(null);
      return;
    }

    setSearchError(null);
    try {
      const result = await dispatch(fetchUserByEmail(searchEmail.trim())).unwrap();
      setSearchResult(result);
    } catch (err: any) {
      setSearchError(err || 'User not found');
      setSearchResult(null);
    }
  };

  const clearSearch = () => {
    setSearchEmail('');
    setSearchResult(null);
    setSearchError(null);
  };

  // Stats
  const totalUsers = users.length;
  const fullUsers = users.filter((u) => u.registrationLevel === 'full').length;
  const standardUsers = users.filter((u) => u.registrationLevel === 'standard').length;
  const minimalUsers = users.filter((u) => u.registrationLevel === 'minimal').length;

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">User Management</h1>
          <p className="text-gray-600 animate-on-load fade-left duration-light-slow">View all users, search by email, and view transaction history</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-fast">
            <p className="text-sm text-gray-600 uppercase tracking-wide">Total Users</p>
            <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-normal">
            <p className="text-sm text-gray-600 uppercase tracking-wide">Full Registration</p>
            <p className="text-3xl font-bold text-green-600">{fullUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-light-slow">
            <p className="text-sm text-gray-600 uppercase tracking-wide">Standard</p>
            <p className="text-3xl font-bold text-blue-600">{standardUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-slow">
            <p className="text-sm text-gray-600 uppercase tracking-wide">Minimal (Email Only)</p>
            <p className="text-3xl font-bold text-yellow-600">{minimalUsers}</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-on-load zoom-in duration-fast">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Search by Email */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-right duration-normal">
          <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-left duration-fast">Search by Email</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Enter user email..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            {(searchResult || searchError) && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          {searchError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">{searchError}</p>
            </div>
          )}

          {searchResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">User Found:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{searchResult.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">
                    {searchResult.firstName || searchResult.lastName
                      ? `${searchResult.firstName || ''} ${searchResult.lastName || ''}`.trim()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Registration Level</p>
                  <p className="font-medium capitalize">{searchResult.registrationLevel}</p>
                </div>
                <div>
                  <p className="text-gray-600">Corsair Connect</p>
                  <p className="font-medium">{searchResult.corsairConnectFlag ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserId(searchResult.id)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                View Details & Transactions
              </button>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUserId && (
          <UserDetails userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
        )}

        {/* User List */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-light-slow">
          <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-fast">All Users ({totalUsers})</h2>
          <UserTable
            users={users}
            loading={loading}
            onViewDetails={(userId) => setSelectedUserId(userId)}
          />
        </div>
      </div>
    </div>
  );
}
