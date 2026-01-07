// Success State Component - Shown after transaction completed
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CaseType } from './types';
import { CORSAIR_THRESHOLD } from './types';
import HeaderSection from './HeaderSection';
import DynamicMessage from './DynamicMessage';
import ImpactDisplay from './ImpactDisplay';
import FooterSection from './FooterSection';

interface SuccessStateProps {
  caseType: CaseType;
  skuName?: string;
  partnerId?: string;
  calculatedImpact: number;
  finalAmount: number;
  userId?: string;
  skuCode?: string;
  transactionId?: string;
}

export default function SuccessState({
  caseType,
  skuName,
  partnerId,
  calculatedImpact,
  finalAmount,
  userId,
  skuCode,
  transactionId,
}: SuccessStateProps) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Auto-redirect to dashboard after 3 seconds
  useEffect(() => {
    if (userId) {
      const timer = setTimeout(() => {
        navigate(`/dashboard/${userId}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [userId, navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <HeaderSection partnerName={partnerId} />

        <div className="bg-white p-8 rounded-xl shadow-lg text-center my-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">Your environmental impact has been registered.</p>

          <DynamicMessage
            caseType={caseType}
            merchantName={skuName}
            partnerName={partnerId}
            impactGrams={calculatedImpact}
            amount={finalAmount}
            threshold={CORSAIR_THRESHOLD}
            skuCode={skuCode}
            skuName={skuName}
          />

          <div className="mt-6">
            <ImpactDisplay impact={calculatedImpact} />
          </div>

          {userId && (
            <div className="mt-8 space-y-4">
              {/* Certificate Download - Show for CLAIM type */}
              {transactionId && caseType === 'A' && (
                <div className="mb-4">
                  <a
                    href={`${API_URL}/certificates/${transactionId}`}
                    download
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Your Certificate
                  </a>
                  <p className="text-xs text-gray-500 mt-2">
                    Your environmental impact certificate is ready to download
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate(`/dashboard/${userId}`)}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
              >
                View Your Portfolio
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Or wait 3 seconds to be redirected automatically...
              </p>
            </div>
          )}
        </div>

        <FooterSection />
      </div>
    </div>
  );
}
