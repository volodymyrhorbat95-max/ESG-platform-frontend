export default function UserRegistration() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load fade-down duration-fast">3. User Registration and Data</h2>
      <p className="animate-on-load fade-right duration-normal">
        By registering, you agree to provide accurate personal information including name,
        date of birth, email address, and physical address. This data is required for:
      </p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-left duration-very-fast">Creating your environmental impact wallet</li>
        <li className="animate-on-load zoom-in duration-fast">Processing transactions and maintaining audit trails</li>
        <li className="animate-on-load fade-up duration-normal">Registering qualifying transactions with Corsair Connect for certified asset creation</li>
        <li className="animate-on-load flip-down duration-light-slow">Compliance with applicable regulations</li>
      </ul>
    </section>
  );
}
