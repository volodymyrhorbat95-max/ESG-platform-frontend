export default function TransactionTypes() {
  return (
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
  );
}
