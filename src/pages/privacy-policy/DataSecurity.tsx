export default function DataSecurity() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your data:
      </p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li>Encrypted data transmission (HTTPS/TLS)</li>
        <li>Secure database storage with access controls</li>
        <li>PCI-DSS compliant payment processing via Stripe</li>
        <li>Regular security audits and monitoring</li>
        <li>Staff training on data protection</li>
      </ul>
    </section>
  );
}
