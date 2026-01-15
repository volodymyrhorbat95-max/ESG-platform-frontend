export default function PlatformFeesAndPricing() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load fade-down duration-fast">
        6.1. Platform Fees and Pricing
      </h2>
      <p className="animate-on-load fade-right duration-normal">
        Pricing for environmental impact credits is based on a dynamic market rate for plastic removal:
      </p>
      <ul className="list-disc pl-6 mt-2 space-y-2">
        <li className="animate-on-load fade-left duration-very-fast">
          <strong>Current CSR Price:</strong> The cost per kilogram of plastic removal is set by global market conditions
          and reviewed weekly by platform administrators
        </li>
        <li className="animate-on-load fade-right duration-fast">
          <strong>Impact Calculation:</strong> For CLAIM, PAY, and GIFT_CARD transactions, the impact is calculated as:
          Amount Paid (€) ÷ Current CSR Price (€/kg) = Impact (kg)
        </li>
        <li className="animate-on-load zoom-in duration-normal">
          <strong>Allocation Multiplier:</strong> Environmental ALLOCATION transactions receive a special multiplier
          (currently 1.6x) to incentivize merchant participation: Amount (€) × 1.6 = Impact (kg)
        </li>
        <li className="animate-on-load fade-up duration-light-slow">
          <strong>Platform Fee (PAY mode):</strong> For PAY-type transactions, a platform fee is automatically deducted
          via Stripe Connect. The fee percentage is configurable and disclosed at checkout
        </li>
        <li className="animate-on-load flip-down duration-slow">
          <strong>€10 Threshold:</strong> Transactions meeting or exceeding €10 in total accumulated contributions
          unlock Certified Environmental Asset status and Corsair Connect registration
        </li>
      </ul>
      <p className="mt-3 animate-on-load fade-up duration-very-slow text-sm text-gray-600">
        All pricing is transparently displayed before transaction confirmation. Historical pricing is maintained for
        audit purposes. Merchants and partners may have custom pricing agreements that do not affect end-user impact calculations.
      </p>
    </section>
  );
}
