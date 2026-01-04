// ESG Report Component
interface ESGReportProps {
  totalAccumulatedKg: string;
  totalAccumulated: number;
  transactionCount: number;
}

export default function ESGReport({
  totalAccumulatedKg,
  totalAccumulated,
  transactionCount,
}: ESGReportProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-on-load fade-up duration-slow">
      <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-normal">ESG Impact Report</h3>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg animate-on-load zoom-in duration-light-slow">
        <p className="text-gray-700 mb-4 text-center animate-on-load fade-down duration-fast">
          Your business has contributed to offsetting{' '}
          <strong className="text-2xl text-primary animate-on-load flip-up duration-normal">{totalAccumulatedKg} kg</strong> of plastic waste
          through customer transactions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="text-center animate-on-load fade-left duration-slow">
            <p className="text-sm text-gray-600 mb-1 animate-on-load fade-up duration-fast">Equivalent Plastic Bottles</p>
            <p className="text-3xl font-bold text-gray-800 animate-on-load zoom-out duration-normal">
              {Math.floor(totalAccumulated / 25)}
            </p>
            <p className="text-xs text-gray-500 animate-on-load fade-down duration-light-slow">(25g per bottle)</p>
          </div>
          <div className="text-center animate-on-load fade-right duration-slow">
            <p className="text-sm text-gray-600 mb-1 animate-on-load fade-up duration-fast">Customer Contributions</p>
            <p className="text-3xl font-bold text-gray-800 animate-on-load flip-down duration-normal">{transactionCount}</p>
            <p className="text-xs text-gray-500 animate-on-load fade-down duration-light-slow">total transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
