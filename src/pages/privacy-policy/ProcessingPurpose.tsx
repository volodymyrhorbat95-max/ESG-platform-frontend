export default function ProcessingPurpose() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load fade-down duration-fast">3. Purpose of Data Processing</h2>
      <p className="animate-on-load fade-right duration-normal">Your personal data is processed for the following purposes:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-left duration-very-fast"><strong>Service Delivery:</strong> Creating and managing your environmental impact wallet</li>
        <li className="animate-on-load fade-right duration-fast"><strong>Transaction Processing:</strong> Recording plastic neutrality transactions and calculating impact</li>
        <li className="animate-on-load fade-left duration-normal"><strong>Certification:</strong> Registering qualifying transactions (€10+) with Corsair Connect for Certified Environmental Asset creation</li>
        <li className="animate-on-load fade-right duration-light-slow"><strong>Payment Processing:</strong> Secure payment handling via Stripe for PAY-type transactions</li>
        <li className="animate-on-load fade-up duration-slow"><strong>Audit Compliance:</strong> Maintaining transaction records for CSRD compliance and ESG reporting</li>
        <li className="animate-on-load zoom-in duration-very-slow"><strong>Communication:</strong> Sending important updates about your account and transactions</li>
      </ul>
    </section>
  );
}
