// Main App Component - Routing handled via useNavigate in components
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalLoadingSpinner from './components/GlobalLoadingSpinner';
import LandingPage from './pages/landing-page';
import UserDashboard from './pages/user-dashboard';
import UserProfile from './pages/user-profile';
import MerchantDashboard from './pages/merchant-dashboard';
import MerchantQRGenerator from './pages/merchant-qr-generator';
import AdminSKUs from './pages/admin-skus';
import AdminGiftCards from './pages/admin-giftcards';
import AdminTransactions from './pages/admin-transactions';
import AdminExport from './pages/admin-export';
import AdminPartners from './pages/admin-partners';
import AdminMerchants from './pages/admin-merchants';
import AdminConfig from './pages/admin-config';
import AdminUsers from './pages/admin-users';
import TermsAndConditions from './pages/terms-and-conditions';
import PrivacyPolicy from './pages/privacy-policy';
import SharedDashboard from './pages/shared-dashboard';
import VerifyCertificate from './pages/verify-certificate';

function App() {
  return (
    <BrowserRouter>
      <GlobalLoadingSpinner />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/:userId" element={<UserDashboard />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/merchant/:merchantId" element={<MerchantDashboard />} />
          <Route path="/merchant/:merchantId/qr-generator" element={<MerchantQRGenerator />} />
          <Route path="/admin/skus" element={<ProtectedRoute><AdminSKUs /></ProtectedRoute>} />
          <Route path="/admin/gift-cards" element={<ProtectedRoute><AdminGiftCards /></ProtectedRoute>} />
          <Route path="/admin/partners" element={<ProtectedRoute><AdminPartners /></ProtectedRoute>} />
          <Route path="/admin/merchants" element={<ProtectedRoute><AdminMerchants /></ProtectedRoute>} />
          <Route path="/admin/transactions" element={<ProtectedRoute><AdminTransactions /></ProtectedRoute>} />
          <Route path="/admin/export" element={<ProtectedRoute><AdminExport /></ProtectedRoute>} />
          <Route path="/admin/config" element={<ProtectedRoute><AdminConfig /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/share/:token" element={<SharedDashboard />} />
          <Route path="/verify/:transactionId" element={<VerifyCertificate />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
