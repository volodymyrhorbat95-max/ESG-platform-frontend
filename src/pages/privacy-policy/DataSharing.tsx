export default function DataSharing() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load fade-down duration-fast">5. Data Sharing</h2>
      <p className="animate-on-load fade-right duration-normal">Your personal data may be shared with:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-left duration-very-fast"><strong>Corsair Connect:</strong> For registration of Certified Environmental Assets (transactions ≥€10)</li>
        <li className="animate-on-load fade-right duration-fast"><strong>Stripe:</strong> For secure payment processing (PAY-type transactions)</li>
        <li className="animate-on-load fade-up duration-normal"><strong>Control Union:</strong> For CPRS protocol verification and audit purposes</li>
        <li className="animate-on-load zoom-in duration-light-slow"><strong>Partner Merchants:</strong> Transaction data for order reconciliation when applicable</li>
      </ul>
      <p className="mt-3 animate-on-load flip-down duration-slow">
        We do NOT sell your personal data to third parties. Data sharing is limited to
        what is necessary for service delivery and regulatory compliance.
      </p>
    </section>
  );
}
