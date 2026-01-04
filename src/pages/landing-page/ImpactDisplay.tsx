// Impact Display Component
interface ImpactDisplayProps {
  impact: number; // in grams
}

export default function ImpactDisplay({ impact }: ImpactDisplayProps) {
  // Convert grams to kg for display
  const impactKg = (impact / 1000).toFixed(3);

  return (
    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-lg border-2 border-green-300 animate-on-load zoom-in duration-normal">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2 animate-on-load fade-down duration-fast">Your Plastic Impact</p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-bold text-primary animate-on-load flip-up duration-light-slow">{impactKg}</span>
          <span className="text-2xl text-gray-700 animate-on-load fade-left duration-normal">kg</span>
        </div>
        <p className="text-sm text-gray-500 mt-2 animate-on-load fade-up duration-slow">({impact.toFixed(0)} grams)</p>
        <div className="mt-4 pt-4 border-t border-green-200 animate-on-load fade-right duration-very-slow">
          <p className="text-xs text-gray-600 animate-on-load zoom-out duration-light-slow">
            This impact will be offset through our partnership with Amplivo
          </p>
        </div>
      </div>
    </div>
  );
}
