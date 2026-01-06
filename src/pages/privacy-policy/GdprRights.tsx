export default function GdprRights() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Your Rights Under GDPR</h2>
      <p>You have the following rights regarding your personal data:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li><strong>Access (Art. 15):</strong> Request a copy of your personal data</li>
        <li><strong>Rectification (Art. 16):</strong> Correct inaccurate or incomplete data</li>
        <li><strong>Erasure (Art. 17):</strong> Request deletion of your data ("right to be forgotten")</li>
        <li><strong>Restriction (Art. 18):</strong> Limit how we process your data</li>
        <li><strong>Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format</li>
        <li><strong>Objection (Art. 21):</strong> Object to processing based on legitimate interest</li>
        <li><strong>Withdraw Consent:</strong> Withdraw consent at any time (without affecting prior processing)</li>
      </ul>
      <p className="mt-3">
        Note: Some rights may be limited where data is required for legal compliance,
        certified environmental asset records, or ongoing contractual obligations.
      </p>
    </section>
  );
}
