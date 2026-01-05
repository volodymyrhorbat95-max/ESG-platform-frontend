// Layout Component with Navigation Header
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiGift,
  FiCreditCard,
  FiDownload,
  FiShield,
  FiFileText
} from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Only hide navigation on terms and privacy pages (legal pages)
  const hideNav = ['/terms-and-conditions', '/privacy-policy'].includes(location.pathname);

  if (hideNav) {
    return <>{children}</>;
  }

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/admin/skus', label: 'SKUs', icon: FiPackage },
    { path: '/admin/gift-cards', label: 'Gift Cards', icon: FiGift },
    { path: '/admin/transactions', label: 'Transactions', icon: FiCreditCard },
    { path: '/admin/export', label: 'Export', icon: FiDownload },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.search.includes('sku=');
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                <FaLeaf className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-gray-800 leading-tight">CSR26</span>
                <span className="text-xs text-gray-500 leading-tight">Impact Processor</span>
              </div>
            </button>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-white">
                <FaLeaf className="w-3 h-3" />
              </div>
              <span>© {new Date().getFullYear()} CSR26 Impact Processor</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/privacy-policy')}
                className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
              >
                <FiShield className="w-4 h-4" />
                Privacy Policy
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => navigate('/terms-and-conditions')}
                className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
              >
                <FiFileText className="w-4 h-4" />
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
