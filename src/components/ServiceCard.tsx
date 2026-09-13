import React, { useState } from 'react';
import { 
  Zap, 
  RotateCw, 
  ExternalLink, 
  Copy, 
  Check, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Moon, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Tag,
  AlertTriangle
} from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onToggleSelect: (id: string) => void;
  onWakeSingle: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onToggleSelect,
  onWakeSingle,
  onEdit,
  onDelete,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isWaking = service.status === 'waking';
  const isSleeping = service.status === 'sleeping';
  const isHealthy = service.status === 'healthy';
  const isFailed = service.status === 'failed';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1500);
  };

  return (
    <div 
      className={`glass-panel rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative border ${
        service.selected 
          ? 'border-emerald-500/50 bg-emerald-50/40 dark:border-emerald-500/40 dark:bg-slate-900/85 shadow-lg shadow-emerald-500/5' 
          : 'border-slate-200/90 bg-white/80 dark:border-slate-800/80 dark:bg-slate-950/70 hover:border-slate-300 dark:hover:border-slate-700'
      } ${isWaking ? 'ring-1 ring-indigo-500/40' : ''}`}
    >
      {/* Top Header Bar */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Checkbox and Service Name */}
          <div className="flex items-start gap-2.5 min-w-0">
            <input
              type="checkbox"
              checked={Boolean(service.selected)}
              onChange={() => onToggleSelect(service.id)}
              className="mt-1 h-4 w-4 rounded bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer accent-emerald-500"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-1.5" title={service.name}>
                {service.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/90 dark:text-slate-300 dark:border-slate-700/60">
                  <Tag className="h-2.5 w-2.5 text-emerald-500 dark:text-emerald-400" />
                  {service.group || 'General'}
                </span>
                {service.healthPath && service.healthPath !== '/' && (
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {service.healthPath}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-1 z-20 w-36 rounded-xl glass-dropdown p-1 shadow-2xl">
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(service); }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Edit Service</span>
                  </button>
                  <div className="my-1 border-t border-slate-200 dark:border-slate-800"></div>
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(service.id); }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Target URL Capsule */}
        <div className="rounded-xl bg-slate-100/90 dark:bg-slate-950/80 p-2.5 border border-slate-200/90 dark:border-slate-800/80 mb-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 font-mono text-[11px] truncate flex items-center gap-1 group transition-colors"
              title={`Open ${service.url}`}
            >
              <span className="truncate">{service.url}</span>
              <ExternalLink className="h-2.5 w-2.5 text-slate-400 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400 shrink-0" />
            </a>
            <button
              onClick={() => copyToClipboard(service.url)}
              className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 p-0.5 rounded shrink-0 transition-colors"
              title="Copy URL"
            >
              {copiedUrl ? <Check className="h-3 w-3 text-emerald-500 dark:text-emerald-400" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Robots.txt warning if entered */}
        {service.hasRobotsWarning && (
          <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[10.5px] text-amber-800 dark:bg-amber-950/30 dark:border-amber-500/30 dark:text-amber-300 flex items-start gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Robots.txt Warning:</strong> Render edge router responds to /robots.txt without waking your backend container. Please use <code>/</code> or <code>/health</code>.
            </span>
          </div>
        )}
      </div>

      {/* Middle Status & Live 60s Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          {/* Status Badge */}
          {isSleeping && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20 px-2.5 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-amber-pulse"></span>
              <Moon className="h-3.5 w-3.5" />
              <span>Sleeping (Spun Down)</span>
            </div>
          )}

          {isWaking && (
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-indigo-300 dark:bg-indigo-500/15 dark:border-indigo-500/30 px-2.5 py-1 rounded-full animate-pulse">
              <RotateCw className="h-3.5 w-3.5 animate-spin text-indigo-500 dark:text-indigo-400" />
              <span>{service.wakeStage || 'Spinning Up...'}</span>
            </div>
          )}

          {isHealthy && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Awake & Ready (200 OK)</span>
            </div>
          )}

          {isFailed && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20 px-2.5 py-1 rounded-full">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Ping Failed</span>
            </div>
          )}

          {/* Metrics */}
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
            {service.lastLatency ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{service.lastLatency}ms</span>
            ) : isWaking && service.coldBootCountdown !== undefined ? (
              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~{service.coldBootCountdown}s
              </span>
            ) : null}
          </div>
        </div>

        {/* 60s Cold Boot Animated Progress Bar */}
        {isWaking && (
          <div className="space-y-1 mt-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/40">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 transition-all duration-500 shimmer-mask"
                style={{ width: `${service.wakeProgress || 10}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>Ingress Hit</span>
              <span>Container Cold Boot</span>
              <span>Ready</span>
            </div>
          </div>
        )}

        {isFailed && service.errorMsg && (
          <p className="text-[11px] text-rose-700 font-mono mt-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200 dark:text-rose-300 dark:bg-rose-950/20 dark:border-rose-900/30">
            {service.errorMsg}
          </p>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/90 dark:border-slate-800/80">
        {/* Instant Single Wake */}
        <button
          onClick={() => onWakeSingle(service)}
          disabled={isWaking}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 border border-emerald-500/30 py-2.5 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Sends non-blocking HTTP health ping to wake this container"
        >
          <Zap className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 fill-emerald-500 dark:fill-emerald-400" />
          <span>Wake This</span>
        </button>

        {/* Open Site in New Tab */}
        <a
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
            isHealthy 
              ? 'bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 dark:bg-teal-500/20 dark:hover:bg-teal-500/30 dark:text-teal-300 dark:border-teal-500/40' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-400 dark:hover:text-white dark:border-slate-800'
          }`}
          title="Open site in new browser tab"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Open Site</span>
        </a>
      </div>
    </div>
  );
};
