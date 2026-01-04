// Main App Component - Routing handled via useNavigate in components
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing-page';
import UserDashboard from './pages/user-dashboard';
import MerchantDashboard from './pages/merchant-dashboard';
import AdminSKUs from './pages/admin-skus';
import AdminGiftCards from './pages/admin-giftcards';
import AdminTransactions from './pages/admin-transactions';
import AdminExport from './pages/admin-export';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/:userId" element={<UserDashboard />} />
        <Route path="/merchant/:merchantId" element={<MerchantDashboard />} />
        <Route path="/admin/skus" element={<AdminSKUs />} />
        <Route path="/admin/gift-cards" element={<AdminGiftCards />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/export" element={<AdminExport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
