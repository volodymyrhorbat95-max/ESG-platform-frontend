// Shared Dashboard - Public view of user impact dashboard
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSharedDashboard } from '../../store/shareableLinkSlice';

export default function SharedDashboard() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { sharedDashboard: sharedData, loading, error } = useAppSelector((state) => state.shareableLinks);

  useEffect(() => {
    if (token) {
      dispatch(fetchSharedDashboard(token));
    }
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-on-load zoom-in duration-fast">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 animate-on-load fade-up duration-normal">Loading impact data...</p>
        </div>
      </div>
    );
  }

  if (error || !sharedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-on-load fade-down duration-normal max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4\" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Link Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || 'This shared dashboard link is invalid or has expired.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { user, wallet, linkStats } = sharedData;
  const balanceKg = (Number(wallet.currentBalance) / 1000).toFixed(3);
  const totalAccumulatedKg = (Number(wallet.totalAccumulated) / 1000).toFixed(3);
  const plasticBottles = Math.floor(Number(wallet.totalAccumulated) / 25);
  const treesEquivalent = (Number(wallet.totalAccumulated) / 21000).toFixed(2);
  const oceanCleanup = (Number(wallet.totalAccumulated) / 500).toFixed(1);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">
                {user.firstName}'s Environmental Impact
              </h1>
              <p className="text-gray-600 animate-on-load fade-left duration-light-slow">
                Making a difference, one gram at a time
              </p>
            </div>
            <div className="animate-on-load zoom-in duration-normal">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white animate-on-load zoom-in duration-normal">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Total Plastic Removed</h3>
            <p className="text-4xl font-bold mb-1">{totalAccumulatedKg} kg</p>
            <p className="text-sm opacity-80">{Number(wallet.totalAccumulated).toLocaleString()} grams</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white animate-on-load zoom-in duration-normal">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Current Balance</h3>
            <p className="text-4xl font-bold mb-1">{balanceKg} kg</p>
            <p className="text-sm opacity-80">{Number(wallet.currentBalance).toLocaleString()} grams</p>
          </div>
        </div>

        {/* Impact Equivalents */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-slow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center animate-on-load fade-right duration-normal">
            Impact Equivalents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plastic Bottles */}
            <div className="text-center p-4 bg-blue-50 rounded-xl animate-on-load zoom-in duration-light-slow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-1">{plasticBottles.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Plastic Bottles</p>
            </div>

            {/* Trees */}
            <div className="text-center p-4 bg-green-50 rounded-xl animate-on-load zoom-in duration-light-slow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-1">{treesEquivalent}</p>
              <p className="text-sm text-gray-600">Trees Worth of Impact</p>
            </div>

            {/* Ocean Cleanup */}
            <div className="text-center p-4 bg-teal-50 rounded-xl animate-on-load zoom-in duration-light-slow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-teal-600 mb-1">{oceanCleanup}</p>
              <p className="text-sm text-gray-600">Ocean Cleanup Contributions</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-green-600 rounded-xl shadow-lg p-6 text-white text-center animate-on-load fade-up duration-very-slow">
          <h3 className="text-2xl font-bold mb-3">Want to make your own impact?</h3>
          <p className="mb-4 opacity-90">
            Join thousands of people making a real difference for our planet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500 animate-on-load fade-up duration-very-slow">
          <p>Shared via CSR26 Impact Processor</p>
          {linkStats.viewCount > 1 && (
            <p className="mt-1">This impact page has been viewed {linkStats.viewCount} times</p>
          )}
        </div>
      </div>
    </div>
  );
}
