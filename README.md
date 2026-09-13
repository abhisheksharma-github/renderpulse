# ⚡ RenderPulse (Render Free-Tier Awakener & API Controller)

<p align="center">
  <img src="https://img.shields.io/badge/Security-100%25%20Zero--Data--Leakage-10b981?style=for-the-badge&logo=shield" alt="Zero-Data-Leakage" />
  <img src="https://img.shields.io/badge/Render%20REST%20API-v1%20Supported-6366f1?style=for-the-badge&logo=render" alt="Render API" />
  <img src="https://img.shields.io/badge/Framework-React%20%2B%20Vite%20%2B%20Tailwind-38bdf8?style=for-the-badge&logo=vite" alt="React Vite" />
</p>

**RenderPulse** is a high-performance, responsive single-page web dashboard designed to manage and revive sleeping or spun-down Render free-tier services. 

Free instances on Render automatically spin down to zero instances after 15 minutes of inactivity. RenderPulse eliminates cold boot delays before meetings, client demonstrations, QA testing, or automated pipelines.

---

## 🚀 Dual Wake-up Workflows

### 1. Zero-Auth URL Pinger (No Credentials Needed)
- **How it works**: Sends parallel, non-blocking HTTP GET requests (`fetch(url, { mode: 'no-cors', cache: 'no-store' })`) directly to your public web service URLs.
- **Cold Boot Trigger**: Hitting Render's ingress load balancer automatically triggers the container provisioning pipeline.
- **Live 50s Radar & Progress Countdown**: Shows real-time boot stages (`Initiating` → `Waking Instance` → `Booting Runtime` → `Probing Health` → `200 Ready`).
- **Ideal for**: Rapid wake-ups without needing any API keys or account permissions.

### 2. Official Render REST API Controller
- **How it works**: Connects directly to `https://api.render.com/v1` using your Render Bearer token.
- **Actions Supported**:
  - `POST /v1/services/{id}/restart`: Hard restart a service.
  - `POST /v1/services/{id}/resume`: Resume a suspended service.
  - `POST /v1/services/{id}/deploys`: Trigger a manual deploy with cache control.
  - `GET /v1/services`: 1-Click Auto-Discovery and automatic import of all services on your Render account.

---

## 🔒 Strict Security & Zero-Data-Leakage Guarantee

1. **Zero Server Logging / Zero Central Database**:
   - There is NO backend database or telemetry tracking.
   - Private endpoints and API keys exist strictly client-side inside your browser.
2. **Flexible Storage Policies**:
   - **In-Memory Only**: Cleared immediately upon tab reload.
   - **Session Only (`sessionStorage`)**: Kept only for the active browser tab.
   - **Remember on this Device (`localStorage`)**: Persisted locally with obfuscation.
3. **1-Click Emergency Purge**:
   - The red emergency trash button instantly wipes all stored keys, session data, cache, and active JavaScript state.
4. **Sanitized JSON Exports**:
   - Backup and export your services list with 100% confidence: API keys and bearer tokens are automatically stripped during export.

---

## 🛠️ Quick Start (Running Locally)

### Prerequisites
- Node.js 18+ & npm

### Installation & Development
```bash
# 1. Clone or navigate to the repository
cd RenderPulse

# 2. Install dependencies
npm install

# 3. Start the ultra-fast Vite dev server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production
```bash
npm run build
```
The optimized static build will be generated in `dist/`.

---
Paste your worker URL in RenderPulse under **API Vault → Custom Edge Proxy**.

---

## 📄 License
MIT License • Built with ❤️ for developers deploying on Render.
