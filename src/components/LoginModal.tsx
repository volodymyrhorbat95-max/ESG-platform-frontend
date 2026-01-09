// Login Modal - Passwordless authentication via magic link
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { requestMagicLink, devLogin, clearMagicLinkSent, clearAuthError } from '../store/userAuthSlice';
import { FiMail, FiX, FiCheck, FiZap } from 'react-icons/fi';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error, magicLinkSent } = useAppSelector((state) => state.userAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      return;
    }

    await dispatch(requestMagicLink(email));
  };

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      return;
    }

    const result = await dispatch(devLogin(email));
    if (devLogin.fulfilled.match(result)) {
      // Close modal on successful login
      handleClose();
    }
  };

  const handleClose = () => {
    setEmail('');
    dispatch(clearMagicLinkSent());
    dispatch(clearAuthError());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-4">
            <FiMail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Your Dashboard
          </h2>
          <p className="text-gray-600 text-sm">
            Enter your email to receive a secure login link
          </p>
        </div>

        {/* Success state */}
        {magicLinkSent ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <FiCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Check Your Email
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-gray-500 text-xs mb-6">
              Click the link in your email to access your dashboard. The link will expire in 15 minutes.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                  disabled={loading}
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending magic link...
                  </span>
                ) : (
                  'Send Magic Link'
                )}
              </button>
            </form>

            {/* Info text */}
            <p className="text-center text-xs text-gray-500 mt-4">
              No password required. We'll send you a secure link to access your account.
            </p>

            {/* DEV LOGIN BUTTON */}
            {import.meta.env.DEV && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-400">OR (DEV MODE)</span>
                  </div>
                </div>
                <button
                  onClick={handleDevLogin}
                  disabled={loading || !email}
                  className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiZap className="w-4 h-4" />
                  Dev Login (Skip Email)
                </button>
                <p className="text-center text-xs text-yellow-600 mt-2">
                  ⚠️ Development only - bypasses magic link email
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
