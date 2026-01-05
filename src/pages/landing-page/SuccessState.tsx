// Success State Component - Shown after transaction completed
import type { CaseType } from './types';
import { AMPLIVO_THRESHOLD } from './types';
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
}

export default function SuccessState({
  caseType,
  skuName,
  partnerId,
  calculatedImpact,
  finalAmount,
}: SuccessStateProps) {
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
            threshold={AMPLIVO_THRESHOLD}
          />

          <div className="mt-6">
            <ImpactDisplay impact={calculatedImpact} />
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Redirecting to your dashboard...
          </p>
        </div>

        <FooterSection />
      </div>
    </div>
  );
}
