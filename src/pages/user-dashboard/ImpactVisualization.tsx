// Impact Visualization Component - Shows environmental equivalents
// CRITICAL: Uses calculatedImpact from wallet (in grams)
// Formulas from requirements.md:
// - Plastic bottles: totalGrams / 25
// - Trees: totalGrams / 21000
// - Ocean cleanup: totalGrams / 500

interface ImpactVisualizationProps {
  totalAccumulatedKg: string;
  totalAccumulated: number; // in grams
}

export default function ImpactVisualization({
  totalAccumulatedKg,
  totalAccumulated,
}: ImpactVisualizationProps) {
  // Calculate equivalents using formulas from requirements.md
  const bottles = Math.floor(totalAccumulated / 25); // totalGrams / 25
  const trees = (totalAccumulated / 21000).toFixed(2); // totalGrams / 21000
  const oceanCleanup = (totalAccumulated / 500).toFixed(1); // totalGrams / 500

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-on-load fade-up duration-slow">
      <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-normal">
        Your Environmental Impact
      </h3>

      {/* Main Impact - Shows both kg and grams */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg text-center mb-6 animate-on-load zoom-in duration-light-slow">
        <p className="text-gray-700 mb-2 animate-on-load fade-down duration-fast">
          Total Plastic Waste Removed
        </p>
        <p className="text-5xl font-bold text-green-600 mb-1 animate-on-load flip-up duration-normal">
          {totalAccumulatedKg} kg
        </p>
        <p className="text-lg text-gray-600 animate-on-load fade-up duration-light-slow">
          ({totalAccumulated.toLocaleString()} grams)
        </p>
      </div>

      {/* Equivalents Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Plastic Bottles */}
        <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200 animate-on-load fade-right duration-normal">
          <svg className="w-12 h-12 mx-auto mb-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 3h6v2h-6V3m1 3h4v1h1v11c0 .55-.45 1-1 1H10c-.55 0-1-.45-1-1V7h1V6z"/>
          </svg>
          <p className="text-2xl font-bold text-blue-800">{bottles}</p>
          <p className="text-xs text-blue-700">Plastic Bottles</p>
        </div>

        {/* Trees */}
        <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200 animate-on-load fade-up duration-light-slow">
          <svg className="w-12 h-12 mx-auto mb-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22V16H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V16H2V14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M5,16V20H19V16H5M5,14H19A5,5 0 0,0 14,9H10A5,5 0 0,0 5,14Z"/>
          </svg>
          <p className="text-2xl font-bold text-green-800">{trees}</p>
          <p className="text-xs text-green-700">Trees Worth</p>
        </div>

        {/* Ocean Cleanup */}
        <div className="bg-cyan-50 rounded-lg p-4 text-center border border-cyan-200 animate-on-load fade-left duration-slow">
          <svg className="w-12 h-12 mx-auto mb-2 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.35,11.72L17.22,13.85L15.81,12.44L17.94,10.31L19.35,11.72M15.1,13.31L13.69,11.9L11.56,14.03L12.97,15.44L15.1,13.31M11,9.75L8.9,11.85L7.5,10.45L9.6,8.35L11,9.75M6.79,14.72L8.9,12.62L10.31,14.03L8.21,16.13L6.79,14.72M2,18.9L3.41,20.31L21.31,2.41L19.9,1M13.96,12.31L15.37,13.72L13.24,15.85L11.83,14.44L13.96,12.31Z"/>
          </svg>
          <p className="text-2xl font-bold text-cyan-800">{oceanCleanup}</p>
          <p className="text-xs text-cyan-700">Ocean Cleanup</p>
        </div>
      </div>
    </div>
  );
}
