import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { AppSettings, Service } from './types';
import { 
  DEFAULT_SETTINGS, 
  exportServicesJson, 
  loadStoredServices, 
  loadStoredSettings, 
  parseImportedJson, 
  saveStoredServices, 
  saveStoredSettings, 
  wipeAllStoredData 
} from './services/storage';
import { executeColdBootCycle } from './services/pinger';

import { Header } from './components/Header';
import { StatsRail } from './components/StatsRail';
import { ServiceCard } from './components/ServiceCard';
import { AddEditServiceModal } from './components/AddEditServiceModal';
import { DocsModal } from './components/DocsModal';
import { PurgeConfirmModal } from './components/PurgeConfirmModal';
import { BatchActionBar } from './components/BatchActionBar';

export function App() {
  // Core State
  const [services, setServices] = useState<Service[]>(() => loadStoredServices());
  const [settings, setSettings] = useState<AppSettings>(() => loadStoredSettings());
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  
  // Execution & Progress State
  const [isWakingAll, setIsWakingAll] = useState(false);
  const [activeCountdown, setActiveCountdown] = useState<number | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Modals
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isWipeOpen, setIsWipeOpen] = useState(false);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Persist Services to LocalStorage
  useEffect(() => {
    saveStoredServices(services);
  }, [services]);

  // Persist Settings & Apply Theme dynamically
  useEffect(() => {
    saveStoredSettings(settings);
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Toast notification helper
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Completion audio chime and vibration
  const triggerSuccessFeedback = () => {
    // Sound chime
    if (settings.soundEnabled) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } catch {
        // Audio might be constrained before user gesture
      }
    }

    // Mobile vibration API
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {
        // Ignore vibration errors
      }
    }

    // Confetti
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#10b981', '#14b8a6', '#6366f1']
    });
  };

  // Extract unique available groups
  const availableGroups = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.group && s.group.trim()) set.add(s.group.trim());
    });
    return Array.from(set);
  }, [services]);

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  // Toggle select all
  const handleToggleSelectAll = () => {
    const allSelected = services.length > 0 && services.every((s) => s.selected);
    setServices((prev) => prev.map((s) => ({ ...s, selected: !allSelected })));
  };

  // Single Wake Execution
  const handleWakeSingle = async (service: Service) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === service.id
          ? {
              ...s,
              status: 'waking',
              wakeStage: 'Pinging...',
              wakeProgress: 5,
              coldBootCountdown: 60,
              errorMsg: undefined,
            }
          : s
      )
    );

    const result = await executeColdBootCycle(
      service,
      (serviceId, progress, stage, secondsLeft) => {
        setServices((prev) =>
          prev.map((s) =>
            s.id === serviceId
              ? {
                  ...s,
                  wakeProgress: progress,
                  wakeStage: stage,
                  coldBootCountdown: secondsLeft,
                }
              : s
          )
        );
      },
      60
    );

    setServices((prev) =>
      prev.map((s) =>
        s.id === service.id
          ? {
              ...s,
              status: result.success ? 'healthy' : 'failed',
              lastLatency: result.latencyMs,
              lastPingAt: Date.now(),
              wakeStage: result.success ? 'Awake & Ready' : 'Ping Failed',
              wakeProgress: result.success ? 100 : 0,
              errorMsg: result.success ? undefined : result.message,
            }
          : s
      )
    );

    if (result.success) {
      triggerSuccessFeedback();
      showToast(`"${service.name}" is awake and responding!`, 'success');
      setSettings((prev) => ({ ...prev, lastWokenAt: Date.now() }));
    } else {
      showToast(`Ping failed for "${service.name}"`, 'error');
    }
  };

  // Master Wake All Selected
  const handleWakeAllSelected = async () => {
    const targets = services.filter((s) => s.selected);
    if (targets.length === 0) {
      showToast('Select at least one service to wake', 'error');
      return;
    }

    setIsWakingAll(true);
    setActiveCountdown(60);
    showToast(`Dispatching parallel wake pings to ${targets.length} service(s)...`, 'info');

    // Global countdown timer ticker
    const startTime = Date.now();
    const ticker = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setActiveCountdown(remaining);
      if (remaining <= 0) clearInterval(ticker);
    }, 1000);

    // Parallel dispatch using Promise.allSettled
    await Promise.allSettled(
      targets.map((service) => handleWakeSingle(service))
    );

    clearInterval(ticker);
    setIsWakingAll(false);
    setActiveCountdown(undefined);
    setSettings((prev) => ({ ...prev, lastWokenAt: Date.now() }));
    showToast(`Batch wake finished for ${targets.length} service(s)!`, 'success');
  };

  // Wake Specific Group
  const handleWakeGroup = async (groupName: string) => {
    const groupTargets = services.filter((s) => s.group === groupName);
    if (groupTargets.length === 0) return;

    setIsWakingAll(true);
    showToast(`Warming all services in "${groupName}"...`, 'info');

    await Promise.allSettled(
      groupTargets.map((service) => handleWakeSingle(service))
    );

    setIsWakingAll(false);
    showToast(`Group "${groupName}" wake sequence completed!`, 'success');
  };

  // Open All Awake Sites in Browser Tabs
  const handleOpenAwakeSites = () => {
    const awakeServices = services.filter((s) => s.status === 'healthy');
    if (awakeServices.length === 0) {
      showToast('No services are currently in Awake & Ready state.', 'info');
      return;
    }

    awakeServices.forEach((service) => {
      window.open(service.url, '_blank', 'noopener,noreferrer');
    });
    showToast(`Opened ${awakeServices.length} awake site(s) in tabs!`, 'success');
  };

  // Service CRUD
  const handleSaveService = (serviceData: Partial<Service>) => {
    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, ...serviceData }
            : s
        )
      );
      showToast(`Updated "${serviceData.name}"`, 'success');
    } else {
      const newService: Service = {
        id: `svc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: serviceData.name || 'New Service',
        url: serviceData.url || '',
        group: serviceData.group || 'General',
        healthPath: serviceData.healthPath || '/',
        status: 'sleeping',
        selected: true,
        hasRobotsWarning: serviceData.hasRobotsWarning,
      };
      setServices((prev) => [newService, ...prev]);
      showToast(`Added "${newService.name}"`, 'success');
    }
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('Service deleted', 'info');
  };

  // JSON Import & Export
  const handleExportJson = () => {
    const jsonStr = exportServicesJson(services);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renderpulse-services-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Services exported successfully as JSON!', 'success');
  };

  const handleImportFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = parseImportedJson(text);
        if (imported.length === 0) {
          showToast('No valid services found in file', 'error');
          return;
        }
        setServices((prev) => [...imported, ...prev]);
        showToast(`Imported ${imported.length} services!`, 'success');
      } catch {
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Wipe All Data
  const handleConfirmWipe = () => {
    wipeAllStoredData();
    setServices([]);
    setSettings(DEFAULT_SETTINGS);
    showToast('All local storage data has been cleared.', 'info');
  };

  // Filtered Services List
  const filteredServices = services.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.group.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup = selectedGroup === 'all' || s.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-emerald-500 selection:text-slate-950 pb-20 md:pb-8 transition-colors duration-200">
      {/* Hidden File Input for JSON Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFileSelected}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Header */}
      <Header
        settings={settings}
        serviceCount={services.length}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenWipeModal={() => setIsWipeOpen(true)}
        onOpenAddService={() => {
          setEditingService(null);
          setIsAddEditOpen(true);
        }}
        onExportJson={handleExportJson}
        onImportJsonClick={() => fileInputRef.current?.click()}
        onToggleTheme={() =>
          setSettings((prev) => ({
            ...prev,
            theme: prev.theme === 'dark' ? 'light' : 'dark',
          }))
        }
        onToggleSound={() =>
          setSettings((prev) => ({
            ...prev,
            soundEnabled: !prev.soundEnabled,
          }))
        }
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-2xl glass-panel bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 px-4 py-3 text-xs font-semibold shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />}
          {toastMessage.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400" />}
          {toastMessage.type === 'info' && <Sparkles className="h-4 w-4 text-teal-500 dark:text-teal-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Rail & Master Batch Actions */}
        <StatsRail
          services={services}
          searchQuery={searchQuery}
          selectedGroup={selectedGroup}
          isWakingAll={isWakingAll}
          lastWokenAt={settings.lastWokenAt}
          availableGroups={availableGroups}
          onSearchChange={setSearchQuery}
          onGroupChange={setSelectedGroup}
          onToggleSelectAll={handleToggleSelectAll}
          onWakeAll={handleWakeAllSelected}
          onWakeGroup={handleWakeGroup}
          onOpenAwakeSites={handleOpenAwakeSites}
        />

        {/* Empty State / Onboarding View */}
        {filteredServices.length === 0 ? (
          <div className="rounded-3xl glass-panel border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto shadow-sm">
            {/* Onboarding Icon */}
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-indigo-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 shadow-xl shadow-emerald-500/10">
              <Zap className="h-8 w-8 text-emerald-500 dark:text-emerald-400 fill-emerald-500 dark:fill-emerald-400" />
            </div>

            {/* Onboarding Explanation */}
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Instant Multi-Service Awakener for Render
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Render free-tier instances automatically spin down to 0 replicas after 15 minutes of inactivity. RenderPulse lets you batch-wake all your backends and APIs simultaneously before client meetings, tests, or demos.
              </p>
            </div>

            {/* Privacy Callout */}
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 p-4 text-xs text-emerald-800 dark:text-emerald-300 text-left w-full space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Client-Side Privacy Guarantee</span>
              </div>
              <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Zero credentials required. You only input public URLs. All configurations remain strictly on this device in your browser's <code>localStorage</code>.
              </p>
            </div>

            {/* Action */}
            <div className="flex items-center justify-center pt-2">
              <button
                onClick={() => {
                  setEditingService(null);
                  setIsAddEditOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Add Your First Service</span>
              </button>
            </div>
          </div>
        ) : (
          /* Services Card Grid (2 or 3 columns on desktop) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onToggleSelect={handleToggleSelect}
                onWakeSingle={handleWakeSingle}
                onEdit={(s) => {
                  setEditingService(s);
                  setIsAddEditOpen(true);
                }}
                onDelete={handleDeleteService}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Sticky Execution Dock */}
      <BatchActionBar
        services={services}
        isWakingAll={isWakingAll}
        activeCountdown={activeCountdown}
        onToggleSelectAll={handleToggleSelectAll}
        onWakeAll={handleWakeAllSelected}
        onOpenAwakeSites={handleOpenAwakeSites}
      />

      {/* Add / Edit Service Modal */}
      <AddEditServiceModal
        isOpen={isAddEditOpen}
        editingService={editingService}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveService}
      />

      {/* Technical Docs & Guide Modal */}
      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Wipe All Data Confirmation Modal */}
      <PurgeConfirmModal
        isOpen={isWipeOpen}
        onClose={() => setIsWipeOpen(false)}
        onConfirmPurge={handleConfirmWipe}
      />
    </div>
  );
}

export default App;
