import React from 'react';
import { Trash2, ShieldAlert } from 'lucide-react';

interface PurgeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPurge: () => void;
}

export const PurgeConfirmModal: React.FC<PurgeConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmPurge,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl glass-panel border border-rose-500/40 bg-slate-950 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 text-rose-400 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/30">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Wipe All Stored Data?</h3>
            <p className="text-xs text-rose-400/80">Permanent, zero-trace local browser reset</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          This will immediately remove all your saved Render service URLs, custom tags, and local settings from this browser's <code>localStorage</code>.
        </p>

        <div className="rounded-xl bg-rose-950/30 border border-rose-900/40 p-3 text-[11px] text-rose-300 space-y-1 mb-5">
          <div className="font-semibold text-rose-200">What will be cleared:</div>
          <div>• All custom endpoints & health paths</div>
          <div>• Category tags & preferences</div>
          <div>• Browser <code>localStorage</code> records</div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmPurge();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span>Yes, Wipe Everything</span>
          </button>
        </div>
      </div>
    </div>
  );
};
