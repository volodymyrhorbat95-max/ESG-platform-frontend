// ImpactProgressBar - Visual "growing scroll bar" showing progress toward certified asset
// Section 20.4: E-commerce Integration - Point B landing page component
//
// Client's vision: "Growing scroll bar" that shows progress toward €10 threshold
// for certified environmental asset status

import { useEffect, useState } from 'react';

interface ImpactProgressBarProps {
  currentGrams: number; // Current impact in grams
  currentAmount: number; // Current amount in euros
  thresholdAmount: number; // Threshold in euros (default €10)
  animate?: boolean; // Whether to animate the bar growth
  showLabels?: boolean; // Whether to show grams labels
}

export default function ImpactProgressBar({
  currentGrams,
  currentAmount,
  thresholdAmount = 10,
  animate = true,
  showLabels = true,
}: ImpactProgressBarProps) {
  // Calculate progress percentage (cap at 100%)
  const progressPercent = Math.min((currentAmount / thresholdAmount) * 100, 100);
  const isCertified = currentAmount >= thresholdAmount;

  // Animation state
  const [displayedPercent, setDisplayedPercent] = useState(animate ? 0 : progressPercent);

  // Animate the progress bar on mount
  useEffect(() => {
    if (!animate) {
      setDisplayedPercent(progressPercent);
      return;
    }

    // Start animation after a short delay
    const timer = setTimeout(() => {
      setDisplayedPercent(progressPercent);
    }, 300);

    return () => clearTimeout(timer);
  }, [progressPercent, animate]);

  // Format grams for display
  const formatGrams = (grams: number): string => {
    if (grams >= 1000000) {
      return `${(grams / 1000000).toFixed(2)} tonnes`;
    }
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`;
    }
    return `${grams.toFixed(0)}g`;
  };

  return (
    <div className="w-full animate-on-load fade-up duration-normal">
      {/* Header with current impact */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Your Environmental Impact
        </span>
        {showLabels && (
          <span className="text-sm font-bold text-emerald-600">
            {formatGrams(currentGrams)}
          </span>
        )}
      </div>

      {/* Progress bar container */}
      <div className="relative h-6 bg-gray-200 rounded-md overflow-hidden">
        {/* Progress fill with gradient */}
        <div
          className="absolute top-0 left-0 h-full rounded-md transition-all ease-out"
          style={{
            width: `${displayedPercent}%`,
            transitionDuration: animate ? '1500ms' : '0ms',
            background: isCertified
              ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)' // Green when certified
              : 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)', // Blue while in progress
          }}
        />

        {/* Threshold marker */}
        {!isCertified && (
          <div
            className="absolute top-0 h-full w-0.5 bg-emerald-600 opacity-60"
            style={{ left: '100%', transform: 'translateX(-1px)' }}
          />
        )}

        {/* Progress text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${displayedPercent > 50 ? 'text-white' : 'text-gray-700'}`}>
            €{currentAmount.toFixed(2)} / €{thresholdAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Status message */}
      <div className="mt-2 text-center">
        {isCertified ? (
          <p className="text-sm text-emerald-600 font-medium animate-on-load zoom-in duration-slow">
            Certified Environmental Asset Achieved!
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            €{(thresholdAmount - currentAmount).toFixed(2)} more to become a Certified Environmental Asset
          </p>
        )}
      </div>

      {/* Visual milestone markers */}
      <div className="flex justify-between mt-1 px-1">
        <span className="text-xs text-gray-400">€0</span>
        <span className="text-xs text-gray-400">€{(thresholdAmount / 2).toFixed(0)}</span>
        <span className="text-xs text-emerald-600 font-medium">€{thresholdAmount.toFixed(0)}</span>
      </div>
    </div>
  );
}
