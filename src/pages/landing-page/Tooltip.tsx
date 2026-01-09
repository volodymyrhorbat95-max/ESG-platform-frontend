// Tooltip Component - Reusable tooltip/popover
import { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export default function Tooltip({ children, content, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        className={`cursor-help underline decoration-dotted ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        role="button"
        tabIndex={0}
      >
        {children}
      </span>

      {isVisible && (
        <span className="absolute z-[9999] bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none animate-on-load fade-down duration-very-fast" style={{ width: '320px', maxWidth: '90vw' }}>
          <span className="bg-slate-700 text-white text-sm rounded-lg p-4 shadow-xl border border-slate-600 block relative animate-on-load zoom-in duration-fast">
            {/* Arrow pointing down */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0" style={{ borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid rgb(51 65 85)' }}></span>
            {content}
          </span>
        </span>
      )}
    </span>
  );
}
