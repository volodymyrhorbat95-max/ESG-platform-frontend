export default function DataSharing() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Data Sharing</h2>
      <p>Your personal data may be shared with:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li><strong>Corsair Connect:</strong> For registration of Certified Environmental Assets (transactions ≥€10)</li>
        <li><strong>Stripe:</strong> For secure payment processing (PAY-type transactions)</li>
        <li><strong>Control Union:</strong> For CPRS protocol verification and audit purposes</li>
        <li><strong>Partner Merchants:</strong> Transaction data for order reconciliation when applicable</li>
      </ul>
      <p className="mt-3">
        We do NOT sell your personal data to third parties. Data sharing is limited to
        what is necessary for service delivery and regulatory compliance.
      </p>
    </section>
  );
}
