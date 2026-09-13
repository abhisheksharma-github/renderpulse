import { AppSettings, Service } from '../types';

const STORAGE_KEY_SERVICES = 'renderpulse_services_v2';
const STORAGE_KEY_SETTINGS = 'renderpulse_settings_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  soundEnabled: true,
  vibrationEnabled: true,
  autoCheckHealthAfterBoot: true,
  lastWokenAt: undefined,
};

export function loadStoredServices(): Service[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to read localStorage services:', e);
  }
  return [];
}

export function saveStoredServices(services: Service[]) {
  try {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  } catch (e) {
    console.error('Failed to save services to localStorage:', e);
  }
}

export function loadStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

/**
 * Exports sanitized JSON configuration
 */
export function exportServicesJson(services: Service[]): string {
  const sanitized = services.map(({ id, name, url, group, healthPath }) => ({
    id,
    name,
    url,
    group,
    healthPath: healthPath || '/'
  }));
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    appName: 'RenderPulse',
    version: '2.0.0',
    services: sanitized
  }, null, 2);
}

/**
 * Validates and imports JSON file content
 */
export function parseImportedJson(jsonText: string): Service[] {
  const parsed = JSON.parse(jsonText);
  const list = Array.isArray(parsed) ? parsed : (parsed.services || []);
  
  return list.map((item: any, idx: number) => ({
    id: item.id || `imported-${Date.now()}-${idx}`,
    name: (item.name || `Imported Service ${idx + 1}`).trim(),
    url: (item.url || '').trim().replace(/\/+$/, ''),
    group: (item.group || 'General').trim(),
    healthPath: (item.healthPath || '/').trim(),
    status: 'sleeping' as const,
    selected: true,
  }));
}

/**
 * Wipes all RenderPulse data from localStorage
 */
export function wipeAllStoredData() {
  try {
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
}
