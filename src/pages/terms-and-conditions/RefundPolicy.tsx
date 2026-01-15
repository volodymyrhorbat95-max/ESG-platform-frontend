export default function RefundPolicy() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load fade-down duration-fast">
        6.2. Refund Policy
      </h2>
      <p className="animate-on-load fade-left duration-normal">
        Due to the immediate processing nature of environmental impact transactions, refunds are handled
        as follows:
      </p>

      <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2 animate-on-load zoom-in duration-fast">
        Eligible for Refund
      </h3>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-right duration-very-fast">
          <strong>Payment Processing Errors:</strong> If a technical error results in duplicate charges or incorrect amounts
        </li>
        <li className="animate-on-load fade-up duration-fast">
          <strong>Failed Service Delivery:</strong> If the transaction fails to credit your wallet due to system malfunction
        </li>
        <li className="animate-on-load flip-up duration-normal">
          <strong>Unauthorized Transactions:</strong> If you can demonstrate the transaction was not authorized by you
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2 animate-on-load fade-down duration-normal">
        Not Eligible for Refund
      </h3>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-left duration-very-fast">
          <strong>Completed Transactions:</strong> Once environmental impact has been credited to your wallet and
          the transaction is confirmed
        </li>
        <li className="animate-on-load zoom-out duration-fast">
          <strong>Change of Mind:</strong> Voluntary purchases cannot be refunded once processing is complete
        </li>
        <li className="animate-on-load fade-right duration-normal">
          <strong>Gift Card Redemptions:</strong> Validated gift card codes cannot be refunded after redemption
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2 animate-on-load flip-down duration-light-slow">
        Refund Process
      </h3>
      <p className="animate-on-load fade-up duration-slow">
        To request a refund for eligible transactions:
      </p>
      <ol className="list-decimal pl-6 mt-2 space-y-1">
        <li className="animate-on-load fade-down duration-very-fast">
          Contact us via email with your transaction ID and detailed explanation within 14 days of the transaction
        </li>
        <li className="animate-on-load fade-right duration-fast">
          We will review your request within 5 business days
        </li>
        <li className="animate-on-load zoom-in duration-normal">
          Approved refunds will be processed to the original payment method within 10 business days
        </li>
        <li className="animate-on-load flip-up duration-light-slow">
          The corresponding environmental impact credits will be deducted from your wallet
        </li>
      </ol>

      <p className="mt-3 animate-on-load fade-left duration-very-slow text-sm text-gray-600">
        For transactions involving Certified Environmental Assets (≥€10), refunds may require coordination with
        Corsair Connect to reverse the asset registration. This process may take additional time for audit compliance.
      </p>
    </section>
  );
}
