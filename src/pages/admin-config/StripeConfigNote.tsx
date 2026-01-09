// Stripe Configuration Note Section


export default function StripeConfigNote() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-on-load fade-up duration-slow">
      <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-fast">Stripe Configuration</h3>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-on-load zoom-in duration-normal">
        <p className="text-sm text-gray-700 mb-2 animate-on-load fade-down duration-fast">
          <strong>Security Note:</strong> Stripe API keys are configured via environment variables for security.
        </p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li className="animate-on-load fade-right duration-very-fast"><code className="bg-gray-200 px-1 rounded">STRIPE_SECRET_KEY</code> - Server-side API key</li>
          <li className="animate-on-load fade-left duration-fast"><code className="bg-gray-200 px-1 rounded">STRIPE_PUBLISHABLE_KEY</code> - Client-side key</li>
          <li className="animate-on-load zoom-in duration-normal"><code className="bg-gray-200 px-1 rounded">STRIPE_WEBHOOK_SECRET</code> - Webhook verification</li>
        </ul>
        <p className="text-xs text-gray-500 mt-3 animate-on-load fade-up duration-light-slow">
          Contact your system administrator to update Stripe keys in the server environment.
        </p>
      </div>
    </div>
  );
}
