// Auth Verify Page - Verifies magic link token and logs user in
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { verifyMagicLink } from '../../store/userAuthSlice';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';

export default function AuthVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, currentUser } = useAppSelector((state) => state.userAuth);
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setVerificationAttempted(true);
      return;
    }

    // Verify the magic link token
    const verify = async () => {
      try {
        await dispatch(verifyMagicLink(token)).unwrap();
        setVerificationAttempted(true);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          if (currentUser) {
            navigate(`/dashboard/${currentUser.id}`);
          } else {
            navigate('/');
          }
        }, 2000);
      } catch (err) {
        setVerificationAttempted(true);
      }
    };

    verify();
  }, [searchParams, dispatch, navigate, currentUser]);

  // Loading state
  if (loading || !verificationAttempted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <FiLoader className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying Your Link
          </h1>
          <p className="text-gray-600">
            Please wait while we log you in...
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full shadow-lg mb-6">
            <FiCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-2">
            You've been successfully logged in.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full shadow-lg mb-6">
          <FiX className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Verification Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {error || 'This magic link is invalid or has expired.'}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Return to Home
          </button>
          <p className="text-sm text-gray-500">
            Need help? Request a new magic link from the login page.
          </p>
        </div>
      </div>
    </div>
  );
}
