// Admin Login Component
import { useState } from 'react';

interface AdminLoginProps {
  onLogin: (code: string) => void;
  loading: boolean;
  error: string | null;
}

export default function AdminLogin({ onLogin, loading, error }: AdminLoginProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onLogin(code.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6 animate-on-load fade-down duration-fast">
        <h3 className="text-xl font-bold text-gray-800 mb-2 animate-on-load zoom-in duration-normal">
          Admin Access
        </h3>
        <p className="text-gray-600 animate-on-load fade-up duration-light-slow">
          Enter your admin secret code to access the admin panel
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="animate-on-load fade-right duration-slow">
          <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-1">
            Admin Secret Code *
          </label>
          <input
            type="password"
            id="adminCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter secret code"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg font-mono"
            disabled={loading}
            required
            autoComplete="off"
          />
          {error && (
            <p className="text-sm text-red-600 mt-2 animate-on-load fade-left duration-fast">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load flip-up duration-very-slow"
        >
          {loading ? 'Authenticating...' : 'Login as Admin'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-on-load fade-left duration-slow">
        <p className="text-sm text-gray-700">
          <strong>🔒 Secure Access:</strong> This page is for authorized administrators only. After successful authentication, you'll have full access to the admin panel.
        </p>
      </div>
    </div>
  );
}
