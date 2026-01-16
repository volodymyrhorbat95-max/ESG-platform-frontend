// EcommerceLanding - Personalized landing page for e-commerce customers
// Section 20.4: E-commerce Integration - Point B (Thank You Page)
//
// Client's vision:
// - "Thank you (name)! With this purchase, you just removed 450g of plastic from the ocean"
// - Customer lands on impact page WITHOUT filling out anything (data already captured)
// - Displays "growing scroll bar" (progress visualization)
//
// This component is shown when URL has ?txn={id}&token={token} parameters

import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHeart, FaTint } from 'react-icons/fa';
import ImpactProgressBar from '../../components/ImpactProgressBar';
import HeaderSection from './HeaderSection';
import FooterSection from './FooterSection';

// Data shape from token-based API response
interface EcommerceTransactionData {
  transaction: {
    id: string;
    amount: number;
    calculatedImpact: number;
    paymentStatus: string;
    corsairConnectFlag: boolean;
    createdAt: string;
  };
  user: {
    firstName: string;
  };
  sku: {
    id: string;
    code: string;
    name: string;
    paymentMode: string;
  };
  tokenInfo: {
    accessCount: number;
    firstAccessedAt: string | null;
  };
}

interface EcommerceLandingProps {
  data: EcommerceTransactionData;
  threshold: number; // CORSAIR_THRESHOLD from config
}

export default function EcommerceLanding({ data, threshold }: EcommerceLandingProps) {
  const navigate = useNavigate();

  // Extract data for display
  const { transaction, user, sku } = data;
  const impactGrams = Number(transaction.calculatedImpact);
  const impactKg = impactGrams / 1000;
  const amount = Number(transaction.amount);
  const isCertified = transaction.corsairConnectFlag;

  // Format impact for display
  const formatImpact = (grams: number): string => {
    if (grams >= 1000000) {
      return `${(grams / 1000000).toFixed(2)} tonnes`;
    }
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`;
    }
    return `${grams.toFixed(0)}g`;
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <HeaderSection />

        {/* Main Success Card */}
        <div className="bg-white rounded-md shadow-lg p-8 my-6">
          {/* Success Icon */}
          <div className="text-center mb-6 animate-on-load zoom-in duration-normal">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
              <FaCheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
          </div>

          {/* Personalized Thank You Message */}
          <div className="text-center mb-8 animate-on-load fade-up duration-fast">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Thank you, {user.firstName || 'Valued Customer'}!
            </h1>
            <p className="text-xl text-gray-600">
              With this purchase, you just removed
            </p>
            <p className="text-4xl font-bold text-emerald-600 my-4 animate-on-load zoom-in duration-slow">
              {formatImpact(impactGrams)}
            </p>
            <p className="text-xl text-gray-600">
              of plastic from the ocean
            </p>
          </div>

          {/* Impact Visual */}
          <div className="flex justify-center gap-8 mb-8 animate-on-load fade-up duration-light-slow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-2">
                <FaTint className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Ocean Cleanup</p>
              <p className="font-bold text-blue-600">{impactKg.toFixed(2)} kg</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-2">
                <FaHeart className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-600">Your Contribution</p>
              <p className="font-bold text-emerald-600">{amount.toFixed(2)}</p>
            </div>
          </div>

          {/* Progress Bar - "Growing Scroll Bar" */}
          <div className="mb-8 animate-on-load fade-up duration-slow">
            <ImpactProgressBar
              currentGrams={impactGrams}
              currentAmount={amount}
              thresholdAmount={threshold}
              animate={true}
              showLabels={true}
            />
          </div>

          {/* Certified Asset Badge (if applicable) */}
          {isCertified && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 mb-6 animate-on-load zoom-in duration-very-slow">
              <div className="flex items-center justify-center gap-2">
                <FaCheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-emerald-700">
                  Certified Environmental Asset
                </span>
              </div>
              <p className="text-sm text-emerald-600 text-center mt-2">
                Your contribution of {amount.toFixed(2)} qualifies for blockchain-verified certification
              </p>
            </div>
          )}

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-md p-4 mb-6 animate-on-load fade-up duration-very-slow">
            <h3 className="font-semibold text-gray-700 mb-2">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Product:</span>
              <span className="text-gray-700">{sku.name}</span>
              <span className="text-gray-500">SKU:</span>
              <span className="text-gray-700">{sku.code}</span>
              <span className="text-gray-500">Date:</span>
              <span className="text-gray-700">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </span>
              <span className="text-gray-500">Status:</span>
              <span className="text-emerald-600 font-medium">
                {transaction.paymentStatus === 'completed' || transaction.paymentStatus === 'n/a'
                  ? 'Completed'
                  : transaction.paymentStatus}
              </span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center animate-on-load fade-up duration-very-slow">
            <p className="text-gray-600 mb-4">
              Want to track all your environmental contributions?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-primary text-white py-2 px-6 rounded-md font-semibold hover:bg-emerald-600 transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/')}
                className="border border-primary text-primary py-2 px-6 rounded-md font-semibold hover:bg-emerald-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
}
