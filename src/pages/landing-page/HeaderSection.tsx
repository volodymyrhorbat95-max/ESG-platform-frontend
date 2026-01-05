// Header Section Component - Universal Authority Header
// "Your environmental impact finally has a real value..."

interface HeaderSectionProps {
  partnerName?: string;
}

export default function HeaderSection({ partnerName }: HeaderSectionProps) {
  return (
    <header className="text-center mb-8">
      {/* Main Title - Authority */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight animate-on-load fade-down duration-normal">
        Your environmental impact finally has a real value, just like the value and weight of every choice.
        <span className="block text-emerald-600 mt-2">
          Today, that weight is plastic removed.
        </span>
      </h1>

      {/* Subtitle - CPRS Protocol Explanation */}
      <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-on-load fade-up duration-light-slow">
        Thanks to the CPRS protocol, we transform your contribution into an environmental asset
        that can reach certification. A guaranteed system that ensures the certainty of physical waste removal.
      </p>

      {/* Partner Attribution (if applicable) */}
      {partnerName && (
        <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full animate-on-load zoom-in duration-slow">
          <span className="text-sm font-medium">In partnership with</span>
          <span className="font-bold">{partnerName}</span>
        </div>
      )}
    </header>
  );
}
