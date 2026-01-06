// Main App Component - Routing handled via useNavigate in components
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/landing-page';
import UserDashboard from './pages/user-dashboard';
import MerchantDashboard from './pages/merchant-dashboard';
import AdminSKUs from './pages/admin-skus';
import AdminGiftCards from './pages/admin-giftcards';
import AdminTransactions from './pages/admin-transactions';
import AdminExport from './pages/admin-export';
import TermsAndConditions from './pages/terms-and-conditions';
import PrivacyPolicy from './pages/privacy-policy';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/:userId" element={<UserDashboard />} />
          <Route path="/merchant/:merchantId" element={<MerchantDashboard />} />
          <Route path="/admin/skus" element={<ProtectedRoute><AdminSKUs /></ProtectedRoute>} />
          <Route path="/admin/gift-cards" element={<ProtectedRoute><AdminGiftCards /></ProtectedRoute>} />
          <Route path="/admin/transactions" element={<ProtectedRoute><AdminTransactions /></ProtectedRoute>} />
          <Route path="/admin/export" element={<ProtectedRoute><AdminExport /></ProtectedRoute>} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
