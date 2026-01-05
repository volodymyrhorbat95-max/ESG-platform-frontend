// Privacy Policy Page
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Data Controller</h2>
              <p>
                CSR26 Impact Processor is the data controller responsible for your personal data.
                We are committed to protecting your privacy and ensuring the security of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Data We Collect</h2>
              <p>We collect the following personal information:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Name (first and last name)</li>
                <li>Email address</li>
                <li>Date of birth</li>
                <li>Address (street, city, postal code, country)</li>
                <li>Transaction history and environmental impact data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Purpose of Data Processing</h2>
              <p>Your data is processed for the following purposes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Creating and managing your environmental impact portfolio</li>
                <li>Processing transactions and payments</li>
                <li>Issuing environmental impact certificates</li>
                <li>Communicating important updates about your account</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Legal Basis (GDPR)</h2>
              <p>We process your data based on:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Contract:</strong> Processing necessary for service delivery</li>
                <li><strong>Consent:</strong> Your explicit consent given during registration</li>
                <li><strong>Legal Obligation:</strong> Compliance with applicable laws</li>
                <li><strong>Legitimate Interest:</strong> Improving our services and fraud prevention</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Data Sharing</h2>
              <p>
                We may share your data with:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment processors (Stripe) for transaction processing</li>
                <li>Environmental certification bodies (Amplivo) for asset registration</li>
                <li>Partner merchants when required for service delivery</li>
              </ul>
              <p className="mt-2">
                We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Data Retention</h2>
              <p>
                We retain your personal data for as long as necessary to provide our services
                and comply with legal obligations. Transaction records are kept for 7 years
                for tax and audit purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Your Rights</h2>
              <p>Under GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure of your data</li>
                <li>Restrict processing</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                data, including encryption, secure servers, and access controls.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Contact</h2>
              <p>
                For privacy-related inquiries or to exercise your rights, contact our Data Protection Officer at:
                privacy@csr26.com
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/"
              className="text-primary hover:text-emerald-600 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
