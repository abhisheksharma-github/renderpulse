import React from 'react';
import { Zap, CheckSquare, Square, ExternalLink, Clock } from 'lucide-react';
import { Service } from '../types';

interface BatchActionBarProps {
  services: Service[];
  isWakingAll: boolean;
  activeCountdown?: number;
  onToggleSelectAll: () => void;
  onWakeAll: () => void;
  onOpenAwakeSites: () => void;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  services,
  isWakingAll,
  activeCountdown,
  onToggleSelectAll,
  onWakeAll,
  onOpenAwakeSites,
}) => {
  const total = services.length;
  const selectedCount = services.filter((s) => s.selected).length;
  const healthyCount = services.filter((s) => s.status === 'healthy').length;
  const allSelected = total > 0 && selectedCount === total;

  if (total === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl transition-all md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
        {/* Toggle Select Checkbox Button (44px min tap target) */}
        <button
          onClick={onToggleSelectAll}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 px-3.5 text-xs font-semibold text-slate-300 active:scale-95 transition-all"
        >
          {allSelected ? (
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          ) : selectedCount > 0 ? (
            <CheckSquare className="h-4 w-4 text-indigo-400 opacity-80" />
          ) : (
            <Square className="h-4 w-4 text-slate-500" />
          )}
          <span className="font-mono text-xs font-bold">{selectedCount}/{total}</span>
        </button>

        {/* Master CTA: Wake All Services */}
        <button
          onClick={onWakeAll}
          disabled={isWakingAll || selectedCount === 0}
          className="flex-1 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all"
        >
          <Zap className={`h-4 w-4 fill-slate-950 ${isWakingAll ? 'animate-bounce' : ''}`} />
          {isWakingAll && activeCountdown !== undefined ? (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Booting (~{activeCountdown}s)</span>
            </span>
          ) : (
            <span>Wake All ({selectedCount})</span>
          )}
        </button>

        {/* Open Awake Sites Button */}
        {healthyCount > 0 && (
          <button
            onClick={onOpenAwakeSites}
            className="flex min-h-[44px] items-center justify-center gap-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 text-xs font-semibold active:scale-95 transition-all"
            title="Open all awake services in new tabs"
          >
            <ExternalLink className="h-4 w-4" />
            <span>({healthyCount})</span>
          </button>
        )}
      </div>
    </div>
  );
};
