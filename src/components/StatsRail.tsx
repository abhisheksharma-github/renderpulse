import React from 'react';
import { 
  Zap, 
  RotateCw, 
  Moon, 
  CheckCircle2, 
  Search, 
  Layers, 
  CheckSquare, 
  Square,
  ExternalLink,
  Clock,
  Tag
} from 'lucide-react';
import { Service } from '../types';

interface StatsRailProps {
  services: Service[];
  searchQuery: string;
  selectedGroup: string;
  isWakingAll: boolean;
  lastWokenAt?: number;
  availableGroups: string[];
  onSearchChange: (q: string) => void;
  onGroupChange: (group: string) => void;
  onToggleSelectAll: () => void;
  onWakeAll: () => void;
  onWakeGroup: (group: string) => void;
  onOpenAwakeSites: () => void;
}

export const StatsRail: React.FC<StatsRailProps> = ({
  services,
  searchQuery,
  selectedGroup,
  isWakingAll,
  lastWokenAt,
  availableGroups,
  onSearchChange,
  onGroupChange,
  onToggleSelectAll,
  onWakeAll,
  onWakeGroup,
  onOpenAwakeSites,
}) => {
  const total = services.length;
  const sleeping = services.filter((s) => s.status === 'sleeping').length;
  const waking = services.filter((s) => s.status === 'waking').length;
  const healthy = services.filter((s) => s.status === 'healthy').length;
  const selectedCount = services.filter((s) => s.selected).length;
  const allSelected = total > 0 && selectedCount === total;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Global Metrics Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Total Services */}
        <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Services</span>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{total}</span>
            <span className="text-[11px] text-slate-400 font-medium">monitored</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700"></div>
        </div>

        {/* Sleeping */}
        <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border-slate-800 bg-slate-900/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sleeping</span>
            <Moon className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300">{sleeping}</span>
            <span className="text-[11px] text-amber-400/80 font-medium">free-tier idle</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500/60"></div>
        </div>

        {/* Waking / Booting */}
        <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border-indigo-950/40 bg-indigo-950/15 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-indigo-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cold Booting</span>
            <RotateCw className={`h-4 w-4 text-indigo-400 ${waking > 0 ? 'animate-spin' : ''}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-300">{waking}</span>
            <span className="text-[11px] text-indigo-400/80 font-medium">~30-60s boot</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
        </div>

        {/* Awake & Ready */}
        <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border-emerald-950/40 bg-emerald-950/15 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Awake & Ready</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-300">{healthy}</span>
            <span className="text-[11px] text-emerald-400/80 font-medium">responding 200 OK</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></div>
        </div>

        {/* Last Woken Timestamp */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 glass-panel rounded-xl p-3.5 flex flex-col justify-between border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Last Woken</span>
            <Clock className="h-4 w-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-1.5 truncate">
            <span className="text-base font-bold text-teal-300 truncate">
              {lastWokenAt ? new Date(lastWokenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
            </span>
            <span className="text-[10px] text-slate-400">
              {lastWokenAt ? `${Math.max(0, Math.round((Date.now() - lastWokenAt) / 60000))}m ago` : ''}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"></div>
        </div>
      </div>

      {/* 2. Controls & Actions Toolstrip */}
      <div className="glass-panel rounded-2xl p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border-slate-800">
        {/* Search, Filter & Select All */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Select All Checkbox Button */}
          <button
            onClick={onToggleSelectAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            title={allSelected ? 'Deselect all' : 'Select all services'}
          >
            {allSelected ? (
              <CheckSquare className="h-4 w-4 text-emerald-400" />
            ) : selectedCount > 0 ? (
              <CheckSquare className="h-4 w-4 text-indigo-400 opacity-70" />
            ) : (
              <Square className="h-4 w-4 text-slate-500" />
            )}
            <span className="font-mono text-xs">{selectedCount}/{total}</span>
          </button>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all font-medium"
            />
          </div>

          {/* Group Filter */}
          <div className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            <select
              value={selectedGroup}
              onChange={(e) => onGroupChange(e.target.value)}
              aria-label="Filter by Group"
              className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="all">All Groups ({total})</option>
              {availableGroups.map((g) => (
                <option key={g} value={g}>
                  Group: {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Master Execution Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Open Awake Sites in Tabs Button */}
          {healthy > 0 && (
            <button
              onClick={onOpenAwakeSites}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30 px-3 py-2 text-xs font-semibold active:scale-95 transition-all"
              title="Open all awake services in new browser tabs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-teal-400" />
              <span>Open Awake ({healthy})</span>
            </button>
          )}

          {/* Wake Group Button if specific group selected */}
          {selectedGroup !== 'all' && (
            <button
              onClick={() => onWakeGroup(selectedGroup)}
              disabled={isWakingAll}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-3.5 py-2 text-xs font-bold active:scale-95 disabled:opacity-50 transition-all"
            >
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              <span>Wake Group "{selectedGroup}"</span>
            </button>
          )}

          {/* Master CTA: Wake All Services */}
          <button
            onClick={onWakeAll}
            disabled={isWakingAll || selectedCount === 0}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black px-4 py-2 text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <Zap className={`h-4 w-4 fill-slate-950 ${isWakingAll ? 'animate-bounce' : ''}`} />
            <span>{isWakingAll ? 'Warming Containers...' : `Wake All Services (${selectedCount})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
