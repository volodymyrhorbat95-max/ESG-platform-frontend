// Technical Block Component - Tesla Model and Certainty
// Explains CSR26 industrial generation model
import Tooltip from './Tooltip';

export default function TechnicalBlock() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl p-6 md:p-8 my-6 animate-on-load fade-up duration-light-slow overflow-visible">
      {/* Industrial Model Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center animate-on-load zoom-in duration-fast">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold animate-on-load fade-right duration-normal">Industrial Generation Model</h3>
      </div>

      {/* Main Explanation */}
      <p className="text-gray-300 leading-relaxed mb-4 animate-on-load fade-up duration-normal">
        The CSR26 system follows an industrial generation model. Corsair issues plastic credits (CSR)
        based on its pyrolysis capacity. <strong className="text-white">We don't sell promises, but digital assets
        that guarantee the certainty of physical plastic removal within the{' '}
        <Tooltip
          content={
            <div>
              <div className="font-bold mb-2 text-emerald-400">5/45/50 Rule Explained</div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">5%</span>
                  <span>Immediate - This portion has already been physically removed from the environment</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">45%</span>
                  <span>At 40 weeks - Released as the industrial processing cycle reaches this milestone</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">50%</span>
                  <span>At 80 weeks - Final release upon completion of the full processing cycle</span>
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-slate-600 text-xs text-gray-400">
                Unless pre-certified CSRs are provided that are already market-ready for immediate burning and certification.
              </div>
            </div>
          }
        >
          80-week cycle
        </Tooltip>.</strong>
      </p>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-700/50 rounded-lg p-4 animate-on-load fade-up duration-light-slow">
          <div className="text-emerald-400 font-bold text-lg mb-1">Pyrolysis Based</div>
          <p className="text-gray-400 text-sm">Physical processing capacity backs every credit</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 animate-on-load fade-up duration-slow">
          <div className="text-emerald-400 font-bold text-lg mb-1">
            <Tooltip
              content={
                <div>
                  <div className="font-bold mb-2 text-emerald-400">5/45/50 Rule</div>
                  <div className="space-y-1 text-xs">
                    <div><span className="font-bold">5%</span> - Immediate (already removed)</div>
                    <div><span className="font-bold">45%</span> - At 40 weeks</div>
                    <div><span className="font-bold">50%</span> - At 80 weeks</div>
                  </div>
                </div>
              }
            >
              80-Week Cycle
            </Tooltip>
          </div>
          <p className="text-gray-400 text-sm">Guaranteed removal timeline with auditable tracking</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 animate-on-load fade-up duration-very-slow">
          <div className="text-emerald-400 font-bold text-lg mb-1">Digital Assets</div>
          <p className="text-gray-400 text-sm">Not promises - real, trackable environmental certificates</p>
        </div>
      </div>

      {/* CPRS Badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 animate-on-load zoom-in duration-very-slow">
        <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full font-medium">
          CPRS Protocol Verified
        </span>
      </div>
    </div>
  );
}
