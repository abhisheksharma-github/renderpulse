import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Zap, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Globe, 
  Server
} from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'how' | 'robots' | 'timeline' | 'security'>('how');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-2xl glass-panel border border-slate-700/80 bg-slate-950 p-6 shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">RenderPulse Technical Guide & FAQ</h2>
              <p className="text-xs text-slate-400">Understanding free-tier sleeping, cold-boots, and edge router rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Guide"
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pt-3 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('how')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'how'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            How Wake-Up Works
          </button>
          <button
            onClick={() => setActiveTab('robots')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'robots'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            The /robots.txt Rule
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'timeline'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            60s Boot Timeline
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'security'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Zero-Data-Leakage Privacy
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-4 text-xs text-slate-300">
          {/* TAB 1: HOW IT WORKS */}
          {activeTab === 'how' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Zap className="h-4 w-4 fill-emerald-400" />
                  <span>Why do Render Free-Tier Web Services Sleep?</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Render spins free web service containers down to <strong>0 replicas</strong> after 15 minutes of inactivity to optimize cloud resources. When an incoming HTTP GET request arrives at Render's edge load balancer, Render immediately allocates container resources and initiates a container cold boot.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-emerald-400" />
                    <span>Why Public URLs are 100% Safe</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    You only paste the public URL of your service (e.g. <code>https://my-app.onrender.com</code>). Zero API keys, passwords, or credentials are required or requested.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Server className="h-4 w-4 text-teal-400" />
                    <span>Non-Blocking Parallel Pings</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    RenderPulse uses <code>fetch(url, &#123; mode: 'no-cors', cache: 'no-store' &#125;)</code> to trigger cold boots across multiple distinct domains in parallel without failing on CORS.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROBOTS.TXT RULE */}
          {activeTab === 'robots' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>Important: Why you must NOT ping /robots.txt</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Render's edge router handles requests for <code>/robots.txt</code> directly at the CDN/proxy layer without routing them to your sleeping application container. As a result, pinging <code>/robots.txt</code> will return a 200 OK from Render's edge, but <strong>will NOT wake up your container</strong>.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-2 text-[11px]">
                <div className="font-bold text-white text-xs">Recommended Health Check Paths:</div>
                <div className="space-y-1 text-slate-300">
                  <div>• Root endpoint: <code>/</code> (default)</div>
                  <div>• Dedicated health check: <code>/health</code> or <code>/healthz</code></div>
                  <div>• API status: <code>/api/v1/status</code></div>
                  <div>• Documentation UI: <code>/docs</code> (for FastAPI/Swagger backends)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 60S TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 space-y-3">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>The 60-Second Container Boot Sequence</span>
                </div>

                <div className="space-y-3 mt-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/40">
                      0s
                    </div>
                    <div>
                      <div className="font-semibold text-white">1. Ingress Hit & Signal Trigger</div>
                      <p className="text-slate-400 text-[11px]">RenderPulse sends a non-blocking GET request. Render's edge ingress catches the hit and triggers container provisioning.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px] border border-indigo-500/40">
                      15s
                    </div>
                    <div>
                      <div className="font-semibold text-white">2. Container Sandbox Launch</div>
                      <p className="text-slate-400 text-[11px]">Render spins up the 512MB RAM Linux container sandbox and pulls the latest container image.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 font-bold text-[10px] border border-teal-500/40">
                      40s
                    </div>
                    <div>
                      <div className="font-semibold text-white">3. Runtime Startup & Database Connection</div>
                      <p className="text-slate-400 text-[11px]">Node.js / Python / Go runtime finishes starting, connects to any databases, and binds to the listening port.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                      60s
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-300">4. Awake & Ready (200 OK)</div>
                      <p className="text-slate-400 text-[11px]">Render ingress directs incoming connections to the warm container. Your app is ready with instant low latency!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ZERO-DATA-LEAKAGE */}
          {activeTab === 'security' && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>100% Client-Side Privacy Guarantee</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  RenderPulse operates with a zero-backend architecture. All URLs, service names, and categories live purely in your browser's local storage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-xs">🔒 Zero Central Database</div>
                  <p className="text-slate-400 text-[11px]">No server or database exists. Your endpoints are never sent to third parties.</p>
                </div>
                <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-xs">🚫 Zero Analytics / Telemetry</div>
                  <p className="text-slate-400 text-[11px]">No tracking cookies or analytics scripts are loaded.</p>
                </div>
                <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-xs">🧹 1-Click Wipe All Data</div>
                  <p className="text-slate-400 text-[11px]">Wipe all local storage entries and reset the application with a single tap.</p>
                </div>
                <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-xs">💾 Export & Import JSON</div>
                  <p className="text-slate-400 text-[11px]">Easily transfer and back up your service list across machines in clean JSON format.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
