export default function PersonalDataCollected() {
  return (
    <section className="animate-on-load fade-left duration-normal">
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load zoom-in duration-fast">2. Personal Data We Collect</h2>
      <p className="animate-on-load fade-up duration-light-slow">We collect the following personal information during registration:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1 animate-on-load fade-right duration-slow">
        <li>First name and last name</li>
        <li>Email address</li>
        <li>Date of birth</li>
        <li>Physical address (street, city, postal code, country, state/province)</li>
      </ul>
      <p className="mt-3 animate-on-load flip-up duration-normal">We also collect transaction data:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1 animate-on-load fade-down duration-very-slow">
        <li>Transaction history and environmental impact accumulation</li>
        <li>Wallet balances and activity</li>
        <li>Payment information (processed securely via Stripe)</li>
        <li>Gift card redemption records</li>
      </ul>
    </section>
  );
}
