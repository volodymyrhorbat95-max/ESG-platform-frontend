// Privacy Policy Page - CSR26 Impact Processor
import { useNavigate } from 'react-router-dom';
import DataController from './DataController';
import PersonalDataCollected from './PersonalDataCollected';
import ProcessingPurpose from './ProcessingPurpose';
import LegalBasis from './LegalBasis';
import DataSharing from './DataSharing';
import DataRetention from './DataRetention';
import GdprRights from './GdprRights';
import DataSecurity from './DataSecurity';
import InternationalTransfers from './InternationalTransfers';
import Cookies from './Cookies';
import PolicyChanges from './PolicyChanges';
import ContactComplaints from './ContactComplaints';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <DataController />
            <PersonalDataCollected />
            <ProcessingPurpose />
            <LegalBasis />
            <DataSharing />
            <DataRetention />
            <GdprRights />
            <DataSecurity />
            <InternationalTransfers />
            <Cookies />
            <PolicyChanges />
            <ContactComplaints />
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
