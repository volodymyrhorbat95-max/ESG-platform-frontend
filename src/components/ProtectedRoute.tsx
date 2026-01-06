// Protected Route Component - Require admin authentication
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user has admin token
    if (!token && !isAuthenticated) {
      // Get admin SKU from environment
      const adminSKU = import.meta.env.VITE_ADMIN_SKU;
      // Redirect to landing page with admin SKU to login
      navigate(`/?sku=${adminSKU}`);
    }
  }, [token, isAuthenticated, navigate]);

  // If not authenticated, don't render anything (will redirect)
  if (!token && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Render protected content if authenticated
  return <>{children}</>;
}
