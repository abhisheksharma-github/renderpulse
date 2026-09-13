import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Download, 
  Upload, 
  BookOpen, 
  Trash2, 
  Plus, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX
} from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  serviceCount: number;
  onOpenDocs: () => void;
  onOpenWipeModal: () => void;
  onOpenAddService: () => void;
  onExportJson: () => void;
  onImportJsonClick: () => void;
  onToggleTheme: () => void;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenDocs,
  onOpenWipeModal,
  onOpenAddService,
  onExportJson,
  onImportJsonClick,
  onToggleTheme,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Left Brand Identity & Subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
              <Zap className="h-5 w-5 text-slate-950 fill-slate-950 stroke-[2.5]" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  Render<span className="text-emerald-400">Pulse</span>
                </span>
                <span className="hidden sm:inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                  Zero-Setup
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-400 truncate">
                Instant Multi-Service Awakener for Render
              </p>
            </div>
          </div>

          {/* Center Zero-Leakage Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <div 
              className="flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-slate-300 border border-slate-800 shadow-inner"
              title="100% Client-Side Privacy: No backend or database. Data stays exclusively in your browser."
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Client-Side • Zero Data Leakage</span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Add Service Master Button */}
            <button
              onClick={onOpenAddService}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-3.5 py-2 text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span className="hidden xs:inline">Add Service</span>
            </button>

            {/* Import / Export JSON Buttons */}
            <div className="flex items-center gap-1 bg-slate-900/90 rounded-xl p-1 border border-slate-800">
              <button
                onClick={onExportJson}
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Export Services (Sanitized JSON backup)"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={onImportJsonClick}
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Import Services (Restore from JSON)"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850 transition-all"
              title={settings.soundEnabled ? 'Chime Sound Enabled' : 'Chime Sound Muted'}
            >
              {settings.soundEnabled ? (
                <Volume2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850 transition-all"
              title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {settings.theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-300" />
              )}
            </button>

            {/* Docs & Architecture Guide */}
            <button
              onClick={onOpenDocs}
              className="p-2 rounded-xl bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850 transition-all"
              title="How Render Free-Tier Sleeping Works & FAQ"
            >
              <BookOpen className="h-4 w-4" />
            </button>

            {/* Wipe All Data Button */}
            <button
              onClick={onOpenWipeModal}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all"
              title="Wipe All Stored Data & Reset"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
