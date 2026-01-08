// Footer Section Component - Trust & Compliance
// Logos, ESG notes, and legal links
import { useNavigate } from 'react-router-dom';

export default function FooterSection() {
  const navigate = useNavigate();

  return (
    <footer className="mt-12 border-t border-gray-200 pt-8">
      {/* Trust Logos */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg animate-on-load fade-down duration-fast">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-xs">
            CSR26
          </div>
          <span className="text-sm font-medium text-gray-700">CSR26</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg animate-on-load zoom-in duration-normal">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
            CU
          </div>
          <span className="text-sm font-medium text-gray-700">Control Union</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg animate-on-load fade-up duration-light-slow">
          <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-white font-bold text-xs">
            CPRS
          </div>
          <span className="text-sm font-medium text-gray-700">CPRS Verified</span>
        </div>
      </div>

      {/* ESG Institutional Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 max-w-4xl mx-auto animate-on-load fade-right duration-slow">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-blue-800 mb-1">ESG Compliance</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              The CPRS protocol is verified by Control Union and complies with the EU directives on
              sustainability reporting (CSRD - Legislative Decree 125/2024). The generated assets are
              <strong> auditable, bankable, and valid for improving the ESG Rating</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Legal Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm animate-on-load flip-up duration-very-slow">
        <button
          onClick={() => navigate('/privacy-policy')}
          className="text-gray-600 hover:text-emerald-600 underline underline-offset-2 transition-colors"
        >
          Privacy Policy
        </button>
        <span className="hidden sm:inline text-gray-300">|</span>
        <button
          onClick={() => navigate('/terms-and-conditions')}
          className="text-gray-600 hover:text-emerald-600 underline underline-offset-2 transition-colors"
        >
          Terms and Conditions of Service
        </button>
      </div>

      {/* Data Processing Notice */}
      <p className="text-xs text-gray-500 text-center mt-4 max-w-2xl mx-auto animate-on-load fade-left duration-slow">
        By using this service, your data will be processed for the purpose of activating a Corsair Connect account.
        Please review our Privacy Policy for details on data processing and your rights.
      </p>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-400 mt-6 animate-on-load zoom-out duration-normal">
        © {new Date().getFullYear()} CSR26 Impact Processor. All rights reserved.
      </div>
    </footer>
  );
}
