// Terms and Conditions Page - CSR26 Impact Processor
import { useNavigate } from 'react-router-dom';
import ServiceProvider from './ServiceProvider';
import ServiceDescription from './ServiceDescription';
import UserRegistration from './UserRegistration';
import TransactionTypes from './TransactionTypes';
import ImpactCertification from './ImpactCertification';
import PaymentProcessing from './PaymentProcessing';
import GiftCardTerms from './GiftCardTerms';
import UserWallet from './UserWallet';
import DataProtection from './DataProtection';
import LimitationOfLiability from './LimitationOfLiability';
import Modifications from './Modifications';
import GoverningLaw from './GoverningLaw';
import Contact from './Contact';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className=" py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms and Conditions of Service</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <ServiceProvider />
            <ServiceDescription />
            <UserRegistration />
            <TransactionTypes />
            <ImpactCertification />
            <PaymentProcessing />
            <GiftCardTerms />
            <UserWallet />
            <DataProtection />
            <LimitationOfLiability />
            <Modifications />
            <GoverningLaw />
            <Contact />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:text-emerald-600 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
