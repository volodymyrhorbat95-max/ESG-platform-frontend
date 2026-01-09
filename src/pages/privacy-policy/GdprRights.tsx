export default function GdprRights() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load fade-down duration-fast">7. Your Rights Under GDPR</h2>
      <p className="animate-on-load fade-right duration-normal">You have the following rights regarding your personal data:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-left duration-very-fast"><strong>Access (Art. 15):</strong> Request a copy of your personal data</li>
        <li className="animate-on-load fade-right duration-fast"><strong>Rectification (Art. 16):</strong> Correct inaccurate or incomplete data</li>
        <li className="animate-on-load fade-up duration-normal"><strong>Erasure (Art. 17):</strong> Request deletion of your data ("right to be forgotten")</li>
        <li className="animate-on-load zoom-in duration-light-slow"><strong>Restriction (Art. 18):</strong> Limit how we process your data</li>
        <li className="animate-on-load flip-up duration-slow"><strong>Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format</li>
        <li className="animate-on-load fade-down duration-very-slow"><strong>Objection (Art. 21):</strong> Object to processing based on legitimate interest</li>
        <li className="animate-on-load zoom-out duration-fast"><strong>Withdraw Consent:</strong> Withdraw consent at any time (without affecting prior processing)</li>
      </ul>
      <p className="mt-3 animate-on-load flip-down duration-normal">
        Note: Some rights may be limited where data is required for legal compliance,
        certified environmental asset records, or ongoing contractual obligations.
      </p>
    </section>
  );
}
