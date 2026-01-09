// Calculation Examples Section


interface CalculationExamplesProps {
  currentCSRPrice: number;
}

export default function CalculationExamples({ currentCSRPrice }: CalculationExamplesProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-on-load fade-up duration-very-slow">
      <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-left duration-fast">Calculation Examples</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-on-load fade-up duration-normal">
          <p className="text-sm text-gray-600 mb-2 animate-on-load fade-right duration-very-fast">€2.50 Transaction</p>
          <p className="text-2xl font-bold text-gray-800 animate-on-load zoom-in duration-fast">{(2.5 / currentCSRPrice).toFixed(2)} kg</p>
          <p className="text-xs text-gray-500 mt-1 animate-on-load fade-left duration-normal">2.50 / {currentCSRPrice.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-on-load fade-up duration-light-slow">
          <p className="text-sm text-gray-600 mb-2 animate-on-load fade-down duration-very-fast">€10.00 Transaction</p>
          <p className="text-2xl font-bold text-gray-800 animate-on-load flip-up duration-fast">{(10 / currentCSRPrice).toFixed(2)} kg</p>
          <p className="text-xs text-gray-500 mt-1 animate-on-load fade-up duration-normal">2.50 / {currentCSRPrice.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-on-load fade-up duration-slow">
          <p className="text-sm text-gray-600 mb-2 animate-on-load zoom-out duration-very-fast">€25.00 Transaction</p>
          <p className="text-2xl font-bold text-gray-800 animate-on-load fade-down duration-fast">{(25 / currentCSRPrice).toFixed(2)} kg</p>
          <p className="text-xs text-gray-500 mt-1 animate-on-load flip-down duration-normal">25.00 / {currentCSRPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
