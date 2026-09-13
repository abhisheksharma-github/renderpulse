# ⚡ RenderPulse

> **Instant Multi-Service Awakener for Render**  
> High-performance, zero-setup, community-ready web utility to batch-wake sleeping Render free-tier services in parallel with a single tap.

<p align="center">
  <img src="https://img.shields.io/badge/Privacy-100%25%20Zero--Data--Leakage-10b981?style=for-the-badge&logo=shield" alt="Zero-Data-Leakage" />
  <img src="https://img.shields.io/badge/Storage-Browser%20localStorage-6366f1?style=for-the-badge&logo=html5" alt="localStorage" />
  <img src="https://img.shields.io/badge/Framework-React%20%2B%20Vite%20%2B%20Tailwind-38bdf8?style=for-the-badge&logo=vite" alt="React Vite" />
</p>

---

## 💡 Why RenderPulse?

Render free-tier web services automatically spin down containers to **0 replicas** after 15 minutes of inactivity. When you or a client visit the URL, it takes **~30 to 60 seconds** to cold boot.

**RenderPulse** eliminates this delay by sending non-blocking parallel health pings directly from your browser to all your services simultaneously, with a live 60-second countdown timer and real-time container status.

---

## 🏗️ System Architecture
RenderPulse is designed as a fully decentralized, client-side single-page application (SPA). It requires zero server infrastructure, backend database, or cloud tokens, ensuring total user privacy and zero maintenance cost.

```text
┌────────────────────────────────────────────────────────┐
│                      User Browser                      │
│                                                        │
│  ┌──────────────────┐         ┌─────────────────────┐  │
│  │   UI & React     │◄───────►│  localStorage (State│  │
│  │   Components     │         │   & Configuration)  │  │
│  └────────┬─────────┘         └─────────────────────┘  │
│           │                                            │
│           │ Dispatches Parallel Requests               │
│           ▼                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Execution Engine: Promise.allSettled()           │  │
│  │ fetch(url, { mode: 'no-cors', cache: 'no-store' })│  │
│  └────────┬─────────────────────────────────────────┘  │
└───────────┼────────────────────────────────────────────/
            │
            ▼ Direct HTTPS Ping
┌────────────────────────────────────────────────────────┐
│                   Render Cloud Edge                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Render Edge Router (Detects inbound traffic)     │  │
│  └────────┬─────────────────────────────────────────┘  │
│           ▼ Triggers Cold Boot                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Container Instances (Spins up replicas from 0)   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

- ⚡ **Master "Wake All Services" CTA**: Dispatches parallel requests (`Promise.allSettled()`) with a live 60-second cold-boot progress timer.
- 🏷️ **Category & Group Tagging**: Organize services into groups (e.g., *APIs*, *Portfolio*, *Work*, *Client Demos*) and wake entire groups with one click.
- ⚠️ **Smart `/robots.txt` Warning**: Detects if `/robots.txt` is entered and warns users that Render's edge router responds to robots.txt without waking backend containers.
- 🔒 **100% Client-Side / Zero Data Leakage**:
  - No backend, no central database, no analytics or telemetry tracking.
  - All data is saved exclusively in your browser's `localStorage`.
- 💾 **Data Portability**:
  - **Export Services**: Download a sanitized `.json` file backup.
  - **Import Services**: Restore or migrate configurations across devices.
  - **Wipe All Data**: One-click complete reset.
- 🚀 **Post-Wake "Open All in Browser"**: Launch all awake services in new tabs instantly once they respond.
- 🌓 **Theme & Sound Controls**: Dark/Light mode toggle, completion audio chime, and mobile vibration feedback (`navigator.vibrate`).
- 📱 **Mobile-First Responsive Design**: Includes a sticky bottom dock on mobile devices with touch-friendly 44px+ targets.

---

## 🛠️ Quick Start (Running Locally)

### Prerequisites
- Node.js 18+ & npm

```bash
# 1. Clone repository
git clone https://github.com/your-username/RenderPulse.git
cd RenderPulse

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

```bash
npm run build
```
The optimized static production bundle is generated in the `dist/` directory.

---

## 🌐 Deploying to Vercel (Step-by-Step)

### Method 1: Deploy via Vercel Web Dashboard (Recommended)
1. Push your repository to **GitHub / GitLab / Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your **RenderPulse** repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your app will be live on a `*.vercel.app` domain in under 30 seconds!

### Method 2: Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Deploy from your project root
vercel

# 3. Deploy to production
vercel --prod
```

---

## 📄 License
MIT License • Built with ❤️ for the developer community.
