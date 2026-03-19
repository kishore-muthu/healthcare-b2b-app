# MediFlow — B2B Healthcare Platform

A modern, production-ready B2B Healthcare UI application built with React + TypeScript, Firebase Authentication, and Service Workers.

---

## ✨ Features

- **Authentication** — Firebase Email/Password login with friendly error messages
- **Push Notifications** — Service Worker registration with native notification support
- **Dashboard** — Live clock, KPI stat cards, Admissions trend chart, Department schedule chart, Recent admissions table
- **Analytics** — KPI pills, Area chart, Pie chart (condition mix), Bar chart (ward occupancy), Occupancy rate bar chart, Net flow chart
- **Patient Details** — 9 rich mock patients with:
  - **Grid View** — Cards with vitals, diagnosis, status, ward info
  - **List View** — Dense table with all key columns
  - **Toggle switch** between views
  - **Search** by name, condition, ID, doctor
  - **Status filter** pills (All / Critical / Stable / Improving / Admitted / Discharged)
  - **Patient drawer** — Full vitals, medical info, contact details, action buttons

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── AppLayout.tsx        # Sidebar + main content wrapper
│   ├── Sidebar.tsx          # Fixed sidebar with nav + logout
│   ├── TopBar.tsx           # Header with title, search, notification bell
│   └── ProtectedRoute.tsx   # Auth guard
├── contexts/
│   └── AuthContext.tsx      # Firebase auth context + login/logout
├── firebase/
│   └── config.ts            # Firebase initialization (reads from .env)
├── hooks/
│   └── useNotifications.ts  # Service worker + Notification API hook
├── pages/
│   ├── LoginPage.tsx        # Split-panel login with Firebase auth
│   ├── DashboardPage.tsx    # KPI cards + charts + recent patients
│   ├── AnalyticsPage.tsx    # Full analytics with 6 chart types
│   └── PatientsPage.tsx     # Grid/List toggle + search/filter + drawer
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
│   └── mockData.ts          # 9 patients + stats + chart data
├── App.tsx                  # Router + auth provider
├── main.tsx                 # React entry point
└── index.css                # Design system (CSS variables + globals)
public/
├── sw.js                    # Service Worker (install, push, click)
└── favicon.svg
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/healthcare-b2b-app.git
cd healthcare-b2b-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication → Email/Password**
4. Create a web app and copy the config
5. Create a user: **Authentication → Users → Add user**

```bash
cp .env.example .env
# Edit .env and paste your Firebase config values
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Build for production

```bash
npm run build
```

---

## ☁️ Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in the Vercel dashboard under **Settings → Environment Variables** (all `VITE_FIREBASE_*` keys).

## ☁️ Deploy to Netlify

```bash
npm run build
# Drag the `dist/` folder to Netlify Drop, or connect the repo
```

Create a `_redirects` file in `/public`:
```
/*  /index.html  200
```

Set environment variables under **Site settings → Environment variables**.

---

## 🎨 Design System

Built with a custom CSS variable design system — no UI framework dependency:

| Token | Value |
|-------|-------|
| `--teal` | `#0A6E5C` (primary brand) |
| `--font-display` | DM Serif Display |
| `--font-body` | DM Sans |
| `--bg` | `#F0F4F8` |
| `--surface` | `#FFFFFF` |

---

## 🔔 Notifications

The app registers a Service Worker (`/public/sw.js`) on load. Users can enable push notifications via the bell icon in the top bar. The Service Worker handles:

- `install` — caches the app shell
- `fetch` — serves from cache with network fallback
- `push` — shows native OS notifications
- `notificationclick` — focuses or opens the app window

---

## 📦 Tech Stack

- **React 18** + **TypeScript**
- **React Router v6** — client-side routing
- **Firebase 10** — Authentication
- **Recharts** — all charts (Area, Bar, Pie, RadialBar)
- **Lucide React** — icons
- **Vite** — build tool
- **Service Worker API** — push notifications
- **CSS Custom Properties** — design system (no Tailwind/MUI)
