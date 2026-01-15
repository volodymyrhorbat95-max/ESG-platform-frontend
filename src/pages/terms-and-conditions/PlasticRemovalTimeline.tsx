export default function PlasticRemovalTimeline() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 animate-on-load fade-down duration-fast">
        5.1. Plastic Removal Timeline (5/45/50 Rule)
      </h2>
      <p className="animate-on-load fade-right duration-normal">
        Physical plastic removal follows an industrial processing cycle tied to Corsair's pyrolysis capacity.
        The removal timeline is structured as follows:
      </p>
      <ul className="list-disc pl-6 mt-2 space-y-2">
        <li className="animate-on-load fade-left duration-very-fast">
          <strong>5% Immediate:</strong> This portion has already been physically removed from the environment
          before credit issuance
        </li>
        <li className="animate-on-load fade-right duration-fast">
          <strong>45% at 40 Weeks:</strong> Released as the industrial processing cycle reaches the first major
          milestone
        </li>
        <li className="animate-on-load fade-up duration-normal">
          <strong>50% at 80 Weeks:</strong> Final release upon completion of the full 80-week processing cycle
        </li>
      </ul>
      <p className="mt-3 animate-on-load flip-down duration-light-slow text-sm text-gray-600">
        Exception: Pre-certified CSR credits that are already market-ready may be burned and certified immediately,
        bypassing the standard timeline. This ensures the system maintains industrial integrity while providing
        flexibility for immediate impact needs.
      </p>
    </section>
  );
}
