export default function PersonalDataCollected() {
  return (
    <section className="animate-on-load fade-left duration-normal">
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load zoom-in duration-fast">2. Personal Data We Collect</h2>
      <p className="animate-on-load fade-up duration-light-slow">We collect the following personal information during registration:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-right duration-very-fast">First name and last name</li>
        <li className="animate-on-load fade-left duration-fast">Email address</li>
        <li className="animate-on-load zoom-in duration-normal">Date of birth</li>
        <li className="animate-on-load flip-up duration-light-slow">Physical address (street, city, postal code, country, state/province)</li>
      </ul>
      <p className="mt-3 animate-on-load flip-up duration-normal">We also collect transaction data:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-down duration-very-fast">Transaction history and environmental impact accumulation</li>
        <li className="animate-on-load fade-up duration-fast">Wallet balances and activity</li>
        <li className="animate-on-load zoom-out duration-normal">Payment information (processed securely via Stripe)</li>
        <li className="animate-on-load flip-down duration-light-slow">Gift card redemption records</li>
      </ul>
    </section>
  );
}
