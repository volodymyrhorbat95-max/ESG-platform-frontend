export default function DataRetention() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load fade-down duration-fast">6. Data Retention</h2>
      <p className="animate-on-load fade-left duration-normal">
        We retain your personal data for as long as necessary to provide services and
        comply with legal obligations:
      </p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-right duration-very-fast">Account data: Retained while your account is active</li>
        <li className="animate-on-load zoom-in duration-fast">Transaction records: 10 years (tax and audit requirements)</li>
        <li className="animate-on-load fade-up duration-normal">Payment records: 7 years (financial reporting obligations)</li>
        <li className="animate-on-load flip-up duration-light-slow">Environmental asset records: Indefinitely (certification permanence)</li>
      </ul>
    </section>
  );
}
