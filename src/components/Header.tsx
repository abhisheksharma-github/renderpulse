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
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/90 dark:border-slate-800/80 dark:bg-slate-950/90 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Left Brand Identity & Subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
              <Zap className="h-5 w-5 text-slate-950 fill-slate-950 stroke-[2.5]" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Render<span className="text-emerald-500 dark:text-emerald-400">Pulse</span>
                </span>
                <span className="hidden sm:inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Zero-Setup
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                Instant Multi-Service Awakener for Render
              </p>
            </div>
          </div>

          {/* Center Zero-Leakage Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <div 
              className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-inner"
              title="100% Client-Side Privacy: No backend or database. Data stays exclusively in your browser."
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>100% Client-Side • Zero Data Leakage</span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Add Service Master Button */}
            <button
              onClick={onOpenAddService}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-2.5 sm:px-3.5 py-2 text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Service</span>
            </button>

            {/* Import / Export JSON Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
              <button
                onClick={onExportJson}
                className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Export Services (Sanitized JSON backup)"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={onImportJsonClick}
                className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Import Services (Restore from JSON)"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-200 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 dark:hover:bg-slate-850 transition-all"
              title={settings.soundEnabled ? 'Chime Sound Enabled' : 'Chime Sound Muted'}
            >
              {settings.soundEnabled ? (
                <Volume2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 hover:bg-slate-200 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 dark:hover:bg-slate-850 transition-all"
              title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {settings.theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            {/* GitHub Profile / Repository Link */}
            <a
              href="https://github.com/abhisheksharma-github/renderpulse"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-200 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 dark:hover:bg-slate-850 transition-all"
              title="GitHub Repository & Developer Profile (Abhishek Sharma)"
              aria-label="GitHub Repository"
            >
              <svg
                className="h-4 w-4 fill-currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            {/* Docs & Architecture Guide */}
            <button
              onClick={onOpenDocs}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-200 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 dark:hover:bg-slate-850 transition-all"
              title="How Render Free-Tier Sleeping Works & FAQ"
            >
              <BookOpen className="h-4 w-4" />
            </button>

            {/* Wipe All Data Button */}
            <button
              onClick={onOpenWipeModal}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:text-rose-700 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 dark:text-rose-400 dark:hover:text-rose-300 transition-all"
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
