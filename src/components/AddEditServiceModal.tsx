import React, { useState, useEffect } from 'react';
import { Plus, Edit3, X, Globe, Check, AlertTriangle } from 'lucide-react';
import { Service } from '../types';
import { checkRobotsTxtWarning, isValidHttpUrl } from '../services/pinger';

interface AddEditServiceModalProps {
  isOpen: boolean;
  editingService: Service | null;
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
}

const PRESET_GROUPS = ['APIs', 'Portfolio', 'Work', 'Client Demos', 'Side Projects', 'General'];

export const AddEditServiceModal: React.FC<AddEditServiceModalProps> = ({
  isOpen,
  editingService,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [group, setGroup] = useState('General');
  const [customGroup, setCustomGroup] = useState('');
  const [healthPath, setHealthPath] = useState('/');
  const [error, setError] = useState('');
  const [robotsWarning, setRobotsWarning] = useState(false);

  useEffect(() => {
    if (editingService) {
      setName(editingService.name || '');
      setUrl(editingService.url || '');
      if (PRESET_GROUPS.includes(editingService.group)) {
        setGroup(editingService.group);
        setCustomGroup('');
      } else {
        setGroup('Custom');
        setCustomGroup(editingService.group || '');
      }
      setHealthPath(editingService.healthPath || '/');
    } else {
      setName('');
      setUrl('');
      setGroup('General');
      setCustomGroup('');
      setHealthPath('/');
    }
    setError('');
  }, [editingService, isOpen]);

  // Real-time robots.txt warning check
  useEffect(() => {
    if (checkRobotsTxtWarning(url, healthPath)) {
      setRobotsWarning(true);
    } else {
      setRobotsWarning(false);
    }
  }, [url, healthPath]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Service name is required');
      return;
    }
    if (!url.trim()) {
      setError('Service target URL is required');
      return;
    }

    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    if (!isValidHttpUrl(cleanUrl)) {
      setError('Please enter a valid HTTP or HTTPS web address.');
      return;
    }

    const finalGroup = group === 'Custom' ? (customGroup.trim() || 'General') : group;

    onSave({
      name: name.trim(),
      url: cleanUrl,
      group: finalGroup,
      healthPath: healthPath.trim() || '/',
      hasRobotsWarning: checkRobotsTxtWarning(cleanUrl, healthPath),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-slate-700/80 bg-slate-950 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {editingService ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5 stroke-[2.5]" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {editingService ? 'Edit Render Service' : 'Add Render Service'}
              </h2>
              <p className="text-xs text-slate-400">Configure public endpoint for parallel health pings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Service Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Service Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. E-Commerce Backend API"
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>

          {/* Target URL */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Render Web Service URL <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://my-api.onrender.com"
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <Globe className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              The public URL of your Render free-tier web service.
            </p>
          </div>

          {/* Health Path & Robots Warning */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Health / Wake Path
            </label>
            <input
              type="text"
              value={healthPath}
              onChange={(e) => setHealthPath(e.target.value)}
              placeholder="/"
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">e.g. <code>/</code>, <code>/health</code>, <code>/healthz</code>, or <code>/api/status</code></p>
          </div>

          {/* Robots.txt Warning Callout */}
          {robotsWarning && (
            <div className="rounded-xl bg-amber-950/40 border border-amber-500/40 p-3 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200">Notice:</strong> Render free-tier edge routers respond to <code>/robots.txt</code> directly without waking your application container. We strongly recommend setting the path to <code>/</code> or <code>/health</code>.
              </div>
            </div>
          )}

          {/* Group / Tag System */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Category / Group Tag
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_GROUPS.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGroup(g)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center truncate ${
                    group === g
                      ? 'border-emerald-500/80 bg-emerald-950/30 text-emerald-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setGroup('Custom')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center truncate ${
                  group === 'Custom'
                    ? 'border-indigo-500/80 bg-indigo-950/30 text-indigo-300 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                Custom Tag...
              </button>
            </div>

            {group === 'Custom' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customGroup}
                  onChange={(e) => setCustomGroup(e.target.value)}
                  placeholder="Enter custom category name (e.g. Client X)"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>{editingService ? 'Update Service' : 'Save Service'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
