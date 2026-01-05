// Terms and Conditions Page
import { Link } from 'react-router-dom';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms and Conditions</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Introduction</h2>
              <p>
                Welcome to CSR26 Impact Processor. By using our services, you agree to these terms and conditions.
                Please read them carefully before proceeding.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Service Description</h2>
              <p>
                CSR26 Impact Processor provides environmental impact tracking and certification services.
                We help businesses and individuals measure, track, and offset their plastic footprint through
                certified environmental programs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. User Responsibilities</h2>
              <p>
                Users are responsible for providing accurate information during registration and transactions.
                Any misuse of the platform or fraudulent activity may result in account termination.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Privacy and Data Protection</h2>
              <p>
                We are committed to protecting your privacy. Personal data is collected and processed in
                accordance with applicable data protection laws, including GDPR. Your data will only be used
                for the purposes described in our privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Environmental Impact Certification</h2>
              <p>
                Environmental impact calculations are based on certified methodologies. Transactions meeting
                the Amplivo threshold (€10 or more) qualify for Certified Environmental Asset registration.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Payment Terms</h2>
              <p>
                Payments are processed securely through Stripe. All transactions are final unless otherwise
                specified. Refunds may be issued at our discretion in cases of service failure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Limitation of Liability</h2>
              <p>
                CSR26 shall not be liable for any indirect, incidental, or consequential damages arising
                from the use of our services. Our total liability is limited to the amount paid for the
                specific transaction in question.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of
                significant changes. Continued use of the service constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Contact</h2>
              <p>
                For questions about these terms, please contact us at support@csr26.com.
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
