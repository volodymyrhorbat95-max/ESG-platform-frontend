// Privacy Policy Page - CSR26 Impact Processor
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Data Controller</h2>
              <p>
                CSR26 ("we", "us", "our") is the data controller responsible for your personal data
                processed through the CSR26 Impact Processor platform. We are committed to protecting
                your privacy and ensuring compliance with the General Data Protection Regulation (GDPR)
                and Italian data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Personal Data We Collect</h2>
              <p>We collect the following personal information during registration:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>First name and last name</li>
                <li>Email address</li>
                <li>Date of birth</li>
                <li>Physical address (street, city, postal code, country, state/province)</li>
              </ul>
              <p className="mt-3">We also collect transaction data:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Transaction history and environmental impact accumulation</li>
                <li>Wallet balances and activity</li>
                <li>Payment information (processed securely via Stripe)</li>
                <li>Gift card redemption records</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Purpose of Data Processing</h2>
              <p>Your personal data is processed for the following purposes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Service Delivery:</strong> Creating and managing your environmental impact wallet</li>
                <li><strong>Transaction Processing:</strong> Recording plastic neutrality transactions and calculating impact</li>
                <li><strong>Certification:</strong> Registering qualifying transactions (€10+) with Amplivo/Corsair Connect for Certified Environmental Asset creation</li>
                <li><strong>Payment Processing:</strong> Secure payment handling via Stripe for PAY-type transactions</li>
                <li><strong>Audit Compliance:</strong> Maintaining transaction records for CSRD compliance and ESG reporting</li>
                <li><strong>Communication:</strong> Sending important updates about your account and transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Legal Basis for Processing (GDPR Art. 6)</h2>
              <p>We process your personal data based on:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Contract Performance (Art. 6(1)(b)):</strong> Processing necessary to provide the environmental impact tracking service you requested</li>
                <li><strong>Consent (Art. 6(1)(a)):</strong> Your explicit consent given during registration by accepting Terms and Conditions</li>
                <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> Compliance with tax, audit, and sustainability reporting requirements</li>
                <li><strong>Legitimate Interest (Art. 6(1)(f)):</strong> Fraud prevention and service improvement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Data Sharing</h2>
              <p>Your personal data may be shared with:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Amplivo/Corsair Connect:</strong> For registration of Certified Environmental Assets (transactions ≥€10)</li>
                <li><strong>Stripe:</strong> For secure payment processing (PAY-type transactions)</li>
                <li><strong>Control Union:</strong> For CPRS protocol verification and audit purposes</li>
                <li><strong>Partner Merchants:</strong> Transaction data for order reconciliation when applicable</li>
              </ul>
              <p className="mt-3">
                We do NOT sell your personal data to third parties. Data sharing is limited to
                what is necessary for service delivery and regulatory compliance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Data Retention</h2>
              <p>
                We retain your personal data for as long as necessary to provide services and
                comply with legal obligations:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Account data: Retained while your account is active</li>
                <li>Transaction records: 10 years (tax and audit requirements)</li>
                <li>Payment records: 7 years (financial reporting obligations)</li>
                <li>Environmental asset records: Indefinitely (certification permanence)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Your Rights Under GDPR</h2>
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Access (Art. 15):</strong> Request a copy of your personal data</li>
                <li><strong>Rectification (Art. 16):</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure (Art. 17):</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Restriction (Art. 18):</strong> Limit how we process your data</li>
                <li><strong>Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Objection (Art. 21):</strong> Object to processing based on legitimate interest</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time (without affecting prior processing)</li>
              </ul>
              <p className="mt-3">
                Note: Some rights may be limited where data is required for legal compliance,
                certified environmental asset records, or ongoing contractual obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your data:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure database storage with access controls</li>
                <li>PCI-DSS compliant payment processing via Stripe</li>
                <li>Regular security audits and monitoring</li>
                <li>Staff training on data protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. International Transfers</h2>
              <p>
                Your data may be transferred to service providers outside the EU/EEA (e.g., Stripe
                for payment processing). Such transfers are protected by appropriate safeguards
                including Standard Contractual Clauses approved by the European Commission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Cookies</h2>
              <p>
                This platform uses essential cookies for session management and authentication.
                We do not use tracking or advertising cookies. Third-party services (Stripe)
                may use their own cookies for payment processing security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. Significant changes will be
                communicated via email. The latest version is always available on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">12. Contact & Complaints</h2>
              <p>
                For privacy inquiries or to exercise your rights, contact our Data Protection Officer:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@csr26.com
              </p>
              <p className="mt-3">
                You also have the right to lodge a complaint with the Italian Data Protection
                Authority (Garante per la protezione dei dati personali) if you believe your
                data protection rights have been violated.
              </p>
            </section>
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
