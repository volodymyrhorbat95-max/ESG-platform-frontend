// Certificate Verification Page
// Section 9: Certificate Generation
// - Displays verification result when QR code is scanned
// - Shows certificate details and validity status
// CRITICAL: All API calls through Redux, routing via useNavigate only

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { verifyCertificate, downloadCertificate, clearVerificationResult } from '../../store/certificateSlice';

export default function VerifyCertificate() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { verifying, verificationResult, error, loading } = useAppSelector(
    (state) => state.certificates
  );

  // Verify certificate on mount
  useEffect(() => {
    if (transactionId) {
      dispatch(verifyCertificate(transactionId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearVerificationResult());
    };
  }, [transactionId, dispatch]);

  const handleDownload = () => {
    if (transactionId) {
      dispatch(downloadCertificate(transactionId));
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-on-load fade-up duration-normal">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Verifying Certificate...</h2>
          <p className="text-gray-500 mt-2">Please wait while we verify the authenticity</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !verificationResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center animate-on-load fade-up duration-normal">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-on-load zoom-in duration-fast">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-red-600 mb-4 animate-on-load fade-down duration-normal">
            Certificate Not Found
          </h1>

          <p className="text-gray-600 mb-6 animate-on-load fade-up duration-light-slow">
            {error || 'The certificate you are trying to verify does not exist or has been removed.'}
          </p>

          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors animate-on-load zoom-in duration-slow"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Success state - Certificate verified
  const { details } = verificationResult;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Verified Badge */}
        <div className="text-center mb-8 animate-on-load fade-down duration-fast">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-on-load zoom-in duration-normal">
            <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700 animate-on-load fade-up duration-light-slow">
            Certificate Verified
          </h1>
          <p className="text-gray-600 mt-2 animate-on-load fade-up duration-slow">
            This is an authentic CSR26 Environmental Impact Certificate
          </p>
        </div>

        {/* Certificate Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-on-load fade-up duration-normal">
          {/* Header */}
          <div className="bg-primary px-6 py-4">
            <h2 className="text-xl font-bold text-white text-center">
              Environmental Impact Certificate
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* User Name */}
            <div className="text-center animate-on-load fade-up duration-fast">
              <p className="text-sm text-gray-500 mb-1">Certified to</p>
              <p className="text-2xl font-bold text-gray-800">{details.user.name}</p>
            </div>

            {/* Impact Amount */}
            <div className="text-center py-6 bg-green-50 rounded-lg animate-on-load zoom-in duration-normal">
              <p className="text-sm text-gray-600 mb-2">Environmental Impact</p>
              <p className="text-4xl font-bold text-primary">{details.impactKg} kg</p>
              <p className="text-lg text-gray-500">({details.impactGrams.toLocaleString()} grams)</p>
              <p className="text-sm text-gray-600 mt-2">of plastic waste removed</p>
            </div>

            {/* Equivalents */}
            <div className="grid grid-cols-3 gap-4 animate-on-load fade-up duration-light-slow">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {details.equivalents.plasticBottles.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">Plastic Bottles</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {details.equivalents.trees}
                </div>
                <div className="text-xs text-gray-600 mt-1">Trees Equivalent</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="text-2xl font-bold text-teal-600">
                  {details.equivalents.oceanCleanup} kg
                </div>
                <div className="text-xs text-gray-600 mt-1">Ocean Cleanup</div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="border-t pt-4 space-y-2 text-sm animate-on-load fade-up duration-slow">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="text-gray-800 font-mono text-xs">{verificationResult.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-800">{details.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SKU:</span>
                <span className="text-gray-800">{details.sku.code} - {details.sku.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verified At:</span>
                <span className="text-gray-800">
                  {new Date(verificationResult.verifiedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 animate-on-load fade-up duration-very-slow">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              Download Certificate
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>

        {/* CPRS Protocol Note */}
        <div className="mt-6 text-center text-sm text-gray-500 animate-on-load fade-up duration-very-slow">
          <p>
            This certificate is verified through the CPRS protocol and complies with EU sustainability
            reporting directives (CSRD). The environmental asset is auditable and traceable.
          </p>
        </div>
      </div>
    </div>
  );
}
