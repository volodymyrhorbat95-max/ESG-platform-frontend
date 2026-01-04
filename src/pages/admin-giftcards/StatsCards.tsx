// Stats Cards Component
interface StatsCardsProps {
  totalCodes: number;
  availableCodes: number;
  redeemedCodes: number;
}

export default function StatsCards({ totalCodes, availableCodes, redeemedCodes }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-right duration-fast">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-down duration-very-fast">Total Codes</p>
        <p className="text-4xl font-bold animate-on-load zoom-in duration-normal">{totalCodes}</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-up duration-normal">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-left duration-very-fast">Available Codes</p>
        <p className="text-4xl font-bold animate-on-load flip-up duration-light-slow">{availableCodes}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-left duration-light-slow">
        <p className="text-sm opacity-90 mb-2 animate-on-load fade-right duration-very-fast">Redeemed Codes</p>
        <p className="text-4xl font-bold animate-on-load zoom-out duration-normal">{redeemedCodes}</p>
      </div>
    </div>
  );
}
