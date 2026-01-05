// Terms and Conditions Page - CSR26 Impact Processor
import { useNavigate } from 'react-router-dom';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms and Conditions of Service</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Service Provider</h2>
              <p>
                CSR26 Impact Processor ("Service") is an ESG platform operated by CSR26 that enables
                businesses and individuals to achieve "Plastic Neutral" status through certified plastic
                removal credits under the CPRS (Certified Plastic Recovery Standard) protocol, verified
                by Control Union.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Service Description</h2>
              <p>The Service provides:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Environmental impact tracking and accumulation through a personal wallet</li>
                <li>Processing of plastic neutrality transactions across multiple business models</li>
                <li>Integration with certified environmental programs (Amplivo/Corsair Connect)</li>
                <li>Generation of auditable, bankable environmental assets valid for ESG Rating improvement</li>
                <li>Compliance with EU directives on sustainability reporting (CSRD - Legislative Decree 125/2024)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. User Registration and Data</h2>
              <p>
                By registering, you agree to provide accurate personal information including name,
                date of birth, email address, and physical address. This data is required for:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Creating your environmental impact wallet</li>
                <li>Processing transactions and maintaining audit trails</li>
                <li>Registering qualifying transactions with Amplivo/Corsair Connect for certified asset creation</li>
                <li>Compliance with applicable regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Transaction Types</h2>
              <p>The Service supports four transaction models:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Prepaid Lot (CLAIM):</strong> No payment required; impact credited from pre-purchased lots</li>
                <li><strong>Pay-as-you-go (PAY):</strong> Direct payment via Stripe for immediate impact credit</li>
                <li><strong>Gift Card:</strong> Redemption of pre-purchased gift cards via secret code validation</li>
                <li><strong>Environmental Allocation:</strong> Partner-funded allocations with dynamic impact calculation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Environmental Impact Certification</h2>
              <p>
                Transactions meeting or exceeding the €10 threshold qualify for registration with
                Amplivo/Corsair Connect as Certified Environmental Assets. These assets are:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Verified under the CPRS protocol by Control Union</li>
                <li>Auditable and bankable</li>
                <li>Valid for improving corporate ESG ratings</li>
                <li>Compliant with EU CSRD sustainability reporting requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Payment Processing</h2>
              <p>
                Payments are processed securely through Stripe. For PAY-type transactions, payments
                are split between the platform and participating merchants via Stripe Connect.
                All payment data is handled in accordance with PCI-DSS standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Gift Card Terms</h2>
              <p>
                Gift cards are single-use and non-transferable. Each secret code can only be
                redeemed once. Lost or stolen codes cannot be replaced. Gift card values are
                fixed at the time of purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. User Wallet</h2>
              <p>
                Your environmental impact wallet accumulates plastic removal credits in grams.
                The wallet tracks total accumulated impact, any redeemed amounts, and current
                balance. Transaction history is maintained for audit and reporting purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Data Protection</h2>
              <p>
                Personal data is processed in accordance with GDPR and Italian data protection
                laws. Data may be shared with Amplivo/Corsair Connect for environmental asset
                registration and with payment processors for transaction completion. See our
                Privacy Policy for complete details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Limitation of Liability</h2>
              <p>
                CSR26 shall not be liable for indirect, incidental, or consequential damages.
                Our liability is limited to the transaction amount in question. Environmental
                impact calculations are based on certified methodologies; actual plastic removal
                is performed by certified third-party operators.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Modifications</h2>
              <p>
                We reserve the right to modify these terms. Significant changes will be
                communicated via email. Continued use of the Service after modifications
                constitutes acceptance of updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">12. Governing Law</h2>
              <p>
                These terms are governed by Italian law. Any disputes shall be subject to
                the exclusive jurisdiction of the courts of Italy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">13. Contact</h2>
              <p>
                For questions about these terms, please contact: support@csr26.com
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
