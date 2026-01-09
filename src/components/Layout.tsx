// Layout Component with Navigation Header
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import {
  FiHome,
  FiPackage,
  FiGift,
  FiCreditCard,
  FiDownload,
  FiShield,
  FiUser,
  FiLogOut,
  FiFileText,
  FiUsers,
  FiShoppingBag,
  FiSettings,
  FiChevronDown,
  FiGrid,
  FiShare2,
  FiCheckCircle
} from 'react-icons/fi';
import { FaLeaf, FaQrcode } from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentUser } = useAppSelector((state) => state.users);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [merchantMenuOpen, setMerchantMenuOpen] = useState(false);
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  const merchantDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
      if (merchantDropdownRef.current && !merchantDropdownRef.current.contains(event.target as Node)) {
        setMerchantMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle admin logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Detect current page context
  const isMerchantPage = location.pathname.startsWith('/merchant/');
  const isUserPage = location.pathname.startsWith('/dashboard/') || location.pathname.startsWith('/profile/');
  const isPublicPage = location.pathname.startsWith('/share/') || location.pathname.startsWith('/verify/');

  // Extract IDs from URL if on merchant/user pages
  const merchantId = isMerchantPage ? location.pathname.split('/')[2] : null;
  const userId = isUserPage ? location.pathname.split('/')[2] : currentUser?.id;

  // Admin menu items
  const adminItems = [
    { path: '/admin/skus', label: 'SKUs', icon: FiPackage },
    { path: '/admin/gift-cards', label: 'Gift Cards', icon: FiGift },
    { path: '/admin/partners', label: 'Partners', icon: FiUsers },
    { path: '/admin/merchants', label: 'Merchants', icon: FiShoppingBag },
    { path: '/admin/transactions', label: 'Transactions', icon: FiCreditCard },
    { path: '/admin/users', label: 'Users', icon: FiUser },
    { path: '/admin/export', label: 'Export', icon: FiDownload },
    { path: '/admin/config', label: 'Config', icon: FiSettings },
  ];

  // Merchant menu items (shown when on merchant pages)
  const merchantItems = merchantId
    ? [
        { path: `/merchant/${merchantId}`, label: 'Dashboard', icon: FiShoppingBag },
        { path: `/merchant/${merchantId}/qr-generator`, label: 'QR Generator', icon: FaQrcode },
      ]
    : [];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.search.includes('sku=');
    return location.pathname.startsWith(path);
  };

  const isAdminActive = () => {
    return location.pathname.startsWith('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-emerald-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                <FaLeaf className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-white leading-tight">CSR26</span>
                <span className="text-xs text-emerald-100 leading-tight">Impact Processor</span>
              </div>
            </button>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {/* Home Button */}
              <button
                onClick={() => navigate('/')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive('/')
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-emerald-100 hover:bg-white/15 hover:text-white hover:scale-105 hover:shadow-lg active:scale-95'
                }`}
              >
                <FiHome className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>

              {/* Merchant Menu - shown when on merchant pages */}
              {merchantItems.length > 0 && (
                <div className="relative" ref={merchantDropdownRef}>
                  <button
                    onClick={() => setMerchantMenuOpen(!merchantMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isMerchantPage
                        ? 'bg-white/20 text-white shadow-md'
                        : 'text-emerald-100 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <FiShoppingBag className="w-4 h-4" />
                    <span className="hidden sm:inline">Merchant</span>
                    <FiChevronDown className={`w-4 h-4 transition-transform ${merchantMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Merchant Dropdown */}
                  {merchantMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                      {merchantItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.path}
                            onClick={() => {
                              navigate(item.path);
                              setMerchantMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer ${
                              isActive(item.path)
                                ? 'bg-emerald-50 text-emerald-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* User Dashboard & Profile - shown when user has registered */}
              {userId && (
                <>
                  <button
                    onClick={() => navigate(`/dashboard/${userId}`)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      location.pathname === `/dashboard/${userId}`
                        ? 'bg-white/20 text-white shadow-md'
                        : 'text-emerald-100 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <FiUser className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                  <button
                    onClick={() => navigate(`/profile/${userId}`)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      location.pathname === `/profile/${userId}`
                        ? 'bg-white/20 text-white shadow-md'
                        : 'text-emerald-100 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <FiSettings className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </button>
                </>
              )}

              {/* Public Pages - Verify Certificate */}
              {isPublicPage && location.pathname.startsWith('/verify/') && (
                <button
                  onClick={() => navigate(`/verify/${location.pathname.split('/')[2]}`)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer bg-white/20 text-white shadow-md"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Verify Certificate</span>
                </button>
              )}

              {/* Public Pages - Shared Dashboard */}
              {isPublicPage && location.pathname.startsWith('/share/') && (
                <button
                  onClick={() => navigate(`/share/${location.pathname.split('/')[2]}`)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer bg-white/20 text-white shadow-md"
                >
                  <FiShare2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Shared Impact</span>
                </button>
              )}

              {/* Admin Dropdown - shown when admin is authenticated */}
              {isAuthenticated && (
                <div className="relative" ref={adminDropdownRef}>
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isAdminActive()
                        ? 'bg-white/20 text-white shadow-md'
                        : 'text-emerald-100 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                    <FiChevronDown className={`w-4 h-4 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Admin Dropdown Menu */}
                  {adminMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                      {adminItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.path}
                            onClick={() => {
                              navigate(item.path);
                              setAdminMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer ${
                              isActive(item.path)
                                ? 'bg-emerald-50 text-emerald-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Admin Logout - shown when admin is authenticated */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-2 text-emerald-100 hover:bg-red-500/20 hover:text-white cursor-pointer"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Global Footer */}
      <footer className="bg-black border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-white">
                <FaLeaf className="w-3 h-3" />
              </div>
              <span>© {new Date().getFullYear()} CSR26 Impact Processor</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/privacy-policy')}
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <FiShield className="w-4 h-4" />
                Privacy Policy
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => navigate('/terms-and-conditions')}
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer"
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
