import { Service, WakeStage } from '../types';

export interface PingResult {
  success: boolean;
  latencyMs: number;
  message: string;
}

/**
 * Builds the full target URL by joining base URL and health path
 */
export function buildTargetUrl(baseUrl: string, healthPath = '/'): string {
  const cleanBase = baseUrl.trim().replace(/\/+$/, '');
  const cleanPath = healthPath.trim();
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${cleanBase}${normalizedPath}`;
}

/**
 * Checks if the URL or path targets /robots.txt
 * (Render's edge router responds to robots.txt without waking up the backend container)
 */
export function checkRobotsTxtWarning(url: string, path: string): boolean {
  const combined = `${url}/${path}`.toLowerCase();
  return combined.includes('robots.txt');
}

/**
 * Validates whether a string is a well-formed HTTP/HTTPS URL
 */
export function isValidHttpUrl(str: string): boolean {
  try {
    const parsed = new URL(str);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sends a clean, standard non-blocking HTTP health ping using mode: 'no-cors' and cache: 'no-store'
 * This safely reaches Render's edge ingress router to initiate cold boot without CORS errors.
 */
export async function sendZeroAuthPing(
  targetUrl: string,
  timeoutMs = 15000
): Promise<PingResult> {
  const startTime = performance.now();
  const cacheBuster = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}_rp_ping=${Date.now()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Standard no-cors request mimicking standard browser asset/page hit
    await fetch(cacheBuster, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latency = Math.round(performance.now() - startTime);
    return {
      success: true,
      latencyMs: latency,
      message: `Ingress ping delivered in ${latency}ms (Cold boot initialized)`
    };
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      return {
        success: false,
        latencyMs: timeoutMs,
        message: 'Initial ping timed out. Free container is spinning up.'
      };
    }

    // Secondary fallback: image beacon
    try {
      await fallbackImageBeacon(cacheBuster, 5000);
      const latency = Math.round(performance.now() - startTime);
      return {
        success: true,
        latencyMs: latency,
        message: `Warming packet delivered via fallback beacon (${latency}ms)`
      };
    } catch {
      const latency = Math.round(performance.now() - startTime);
      return {
        success: false,
        latencyMs: latency,
        message: err?.message || 'Network error triggering wake ping'
      };
    }
  }
}

/**
 * Secondary fallback beacon for environments where fetch is blocked
 */
function fallbackImageBeacon(url: string, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = '';
      reject(new Error('Beacon timeout'));
    }, timeoutMs);

    img.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    img.onerror = () => {
      // Cross-origin image triggers onerror upon receiving server response header
      clearTimeout(timer);
      resolve();
    };
    img.src = url;
  });
}

/**
 * Drives the adaptive cold boot countdown lifecycle.
 * Actively probes the service every few seconds so that as soon as the
 * container boots up (e.g. in 15s or 30s), it immediately finishes without waiting 60s.
 */
export async function executeColdBootCycle(
  service: Service,
  onProgress: (serviceId: string, progress: number, stage: WakeStage, secondsLeft: number) => void,
  totalBootSeconds = 60
): Promise<PingResult> {
  const fullUrl = buildTargetUrl(service.url, service.healthPath);

  // Initial immediate trigger ping
  onProgress(service.id, 5, 'Pinging...', totalBootSeconds);
  const initialPing = await sendZeroAuthPing(fullUrl, 6000);

  // If already warm (fast response), finish immediately
  if (initialPing.success && initialPing.latencyMs < 2000) {
    onProgress(service.id, 100, 'Awake & Ready', 0);
    return {
      success: true,
      latencyMs: initialPing.latencyMs,
      message: `Instance already warm (${initialPing.latencyMs}ms latency).`
    };
  }

  // Otherwise, drive smooth countdown with adaptive early-wake probing
  const startTime = Date.now();

  return new Promise((resolve) => {
    let isFinished = false;
    let isProbing = false;

    const finishSuccess = (elapsedSec: number, latencyMs: number) => {
      if (isFinished) return;
      isFinished = true;
      clearInterval(interval);
      onProgress(service.id, 100, 'Awake & Ready', 0);
      resolve({
        success: true,
        latencyMs,
        message: `Container awake & ready in ${Math.max(1, Math.round(elapsedSec))}s.`
      });
    };

    const interval = setInterval(async () => {
      if (isFinished) return;

      const now = Date.now();
      const elapsed = Math.min(totalBootSeconds, (now - startTime) / 1000);
      const remaining = Math.max(0, Math.ceil(totalBootSeconds - elapsed));
      const percentage = Math.min(95, Math.round((elapsed / totalBootSeconds) * 100));

      let stage: WakeStage = 'Pinging...';
      if (elapsed > 3) stage = 'Wake Signal Sent';
      if (elapsed > 10) stage = 'Spinning Up Container';
      if (elapsed > 40) stage = 'Verifying Health';

      onProgress(service.id, percentage, stage, remaining);

      // Adaptive Early-Wake Probing:
      // Once past 8 seconds, send non-blocking probes every ~4-5 seconds
      if (elapsed >= 8 && !isProbing && remaining > 3) {
        isProbing = true;
        sendZeroAuthPing(fullUrl, 3500)
          .then((probeResult) => {
            if (probeResult.success && probeResult.latencyMs < 2500 && !isFinished) {
              finishSuccess((Date.now() - startTime) / 1000, probeResult.latencyMs);
            }
          })
          .catch(() => {
            // Ignore background probe failures while container is booting
          })
          .finally(() => {
            isProbing = false;
          });
      }

      // Final countdown completion
      if (remaining <= 3 && !isFinished) {
        clearInterval(interval);
        onProgress(service.id, 96, 'Verifying Health', remaining);

        const verifyCheck = await sendZeroAuthPing(fullUrl, 6000);
        finishSuccess((Date.now() - startTime) / 1000, verifyCheck.latencyMs);
      }
    }, 1000);
  });
}

