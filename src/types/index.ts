export type ServiceStatus = 
  | 'sleeping' 
  | 'waking' 
  | 'healthy' 
  | 'failed';

export type ServiceCategory = 'Work' | 'Portfolio' | 'Client Demos' | 'APIs' | 'Side Projects' | 'General';

export type WakeStage = 
  | 'idle'
  | 'Pinging...'
  | 'Wake Signal Sent'
  | 'Spinning Up Container'
  | 'Verifying Health'
  | 'Awake & Ready'
  | 'Ping Failed';

export interface Service {
  id: string;
  name: string;
  url: string;
  group: string; // e.g. "Work", "Portfolio", "Client Demos", "APIs"
  healthPath: string; // e.g. "/" or "/health"
  status: ServiceStatus;
  selected: boolean;
  lastPingAt?: number;
  lastLatency?: number; // in ms
  wakeProgress?: number; // 0 to 100
  wakeStage?: WakeStage;
  coldBootCountdown?: number; // 0-60s
  errorMsg?: string;
  hasRobotsWarning?: boolean;
}

export interface WakeLog {
  id: string;
  serviceId: string;
  serviceName: string;
  timestamp: number;
  type: 'ping' | 'batch_wake' | 'health_check';
  status: 'success' | 'failed' | 'info';
  message: string;
  latencyMs?: number;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoCheckHealthAfterBoot: boolean;
  lastWokenAt?: number;
}
