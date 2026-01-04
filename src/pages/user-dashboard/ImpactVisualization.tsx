// Impact Visualization Component
interface ImpactVisualizationProps {
  totalAccumulatedKg: string;
  totalAccumulated: number;
}

export default function ImpactVisualization({
  totalAccumulatedKg,
  totalAccumulated,
}: ImpactVisualizationProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-on-load fade-up duration-slow">
      <h3 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-normal">Your Environmental Impact</h3>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg text-center animate-on-load zoom-in duration-light-slow">
        <p className="text-gray-700 mb-4 animate-on-load fade-down duration-fast">
          You've offset <strong className="animate-on-load flip-up duration-normal">{totalAccumulatedKg} kg</strong> of plastic waste!
        </p>
        <p className="text-sm text-gray-600 animate-on-load fade-left duration-slow">
          This is equivalent to approximately{' '}
          <strong className="animate-on-load zoom-out duration-light-slow">{Math.floor(totalAccumulated / 25)}</strong> plastic bottles (25g each)
        </p>
      </div>
    </div>
  );
}
