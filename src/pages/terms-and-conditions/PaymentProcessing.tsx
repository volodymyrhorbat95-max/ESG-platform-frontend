export default function PaymentProcessing() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Payment Processing</h2>
      <p>
        Payments are processed securely through Stripe. For PAY-type transactions, payments
        are split between the platform and participating merchants via Stripe Connect.
        All payment data is handled in accordance with PCI-DSS standards.
      </p>
    </section>
  );
}
