export default function DataSecurity() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load fade-down duration-fast">8. Data Security</h2>
      <p className="animate-on-load fade-left duration-normal">
        We implement appropriate technical and organizational measures to protect your data:
      </p>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-right duration-very-fast">Encrypted data transmission (HTTPS/TLS)</li>
        <li className="animate-on-load zoom-in duration-fast">Secure database storage with access controls</li>
        <li className="animate-on-load fade-up duration-normal">PCI-DSS compliant payment processing via Stripe</li>
        <li className="animate-on-load flip-up duration-light-slow">Regular security audits and monitoring</li>
        <li className="animate-on-load fade-down duration-slow">Staff training on data protection</li>
      </ul>
    </section>
  );
}
