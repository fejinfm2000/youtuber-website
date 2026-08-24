# 🎬 CreatorHub — YouTuber & Creator Personal Platform

> A modern, responsive web application built with **Angular 18**, **TypeScript**, and **Vanilla CSS Design Tokens** for YouTube creators, tech influencers, and digital educators.

[![Netlify Status](https://api.netlify.com/api/v1/badges/deploy-status)](https://app.netlify.com)

---

## ✨ Features

### 🌐 Public Front-End
- **🏠 Cinematic Hero Section** — Channel highlights, animated badges, dynamic subscriber counts, and quick-action video CTAs.
- **🎥 Video Hub (`/videos`)** — YouTube video showcase with real-time category filtering (AI & ML, Web Dev, Creator Gear, Productivity), search, and metadata.
- **▶️ Video Detail View (`/videos/:slug`)** — Responsive 16:9 YouTube video player embed, rich descriptions, tags, sponsor callouts, mentioned affiliate products, and related video cards.
- **🛒 Curated Recommendations (`/products`)** — Product catalog (Hardware, Software, Books, Courses) with member perk discount badges and direct store links.
- **🔍 Product Detail View (`/products/:slug`)** — Creator personal verdict quote, specifications, one-click promo coupon copy, and multi-retailer purchase links (Amazon, Official, Partner).
- **💬 Community Hub (`/community`)** — Community feed with creator & member posts, likes, replies, perks grid, rules, and live activity metrics.
- **👤 About Channel (`/about`)** — Creator bio, channel journey timeline, content pillars, and social links.
- **📬 Inbound Sponsorships (`/contact`)** — Brand collaboration and sponsorship enquiry form with budget tiers and FAQ accordion.
- **🔎 Global Unified Search (`/search`)** — Search across all videos and recommendations simultaneously with URL query state.
- **🌓 Theme Engine** — Dark and Light mode switcher with automatic OS preference detection and `localStorage` persistence.
- **🤖 Floating Interactive FABs** — Quick Community Chat and AI Assistant sliding glass panels.

### 🛡️ Member & Admin Portal
- **🔐 Auth Flow (`/login`, `/register`)** — Email authentication and **one-click Creator Demo login**.
- **📊 Creator Studio Dashboard (`/admin/dashboard`)** — Real-time KPI cards (Site Visitors, Video Views, Affiliate Conversions, Active Members) and quick action CRUD tables.
- **📹 Video Manager (`/admin/videos`)** — Video listing and YouTube URL auto-parser (extracts Video ID and HD thumbnail automatically).
- **🛍️ Recommendation Manager (`/admin/products`)** — Live visual card preview, pricing, affiliate tracking URL, and member discount settings.
- **📈 Telemetry & Logs (`/admin/analytics`)** — Activity stream log with category filters (Auth, Video, Product, Affiliate, Admin) and CSV export.
- **⚙️ Settings (`/admin/settings`)** — Creator branding, bio, YouTube channel ID, and social channel URLs.

---

## 🛠️ Tech Stack

- **Framework**: Angular 18 (Standalone Components, Signals, View Transitions)
- **Styling**: Vanilla CSS / SCSS Design System (Dark/Light mode tokens, Glassmorphism, Micro-animations)
- **Routing**: Angular Router with lazy loading and `adminGuard` route protection
- **Icons**: Lucide Icons
- **Data Layer**: SheetDB API integration with fallback development mocks
- **Hosting / CI/CD**: Netlify (SPA redirects, edge caching, automated GitHub deployments)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `^18.19.0 || >=20.9.0`
- npm `^10.0.0`

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/fejinfm2000/creatorhub.git

# Navigate to project directory
cd creatorhub

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:4200/](http://localhost:4200/) in your browser.

---

## ☁️ Netlify Deployment

This project includes [`netlify.toml`](./netlify.toml) and [`public/_redirects`](./public/_redirects) pre-configured.

### Quick Deploy via Netlify Dashboard:
1. Connect your GitHub repository (`https://github.com/fejinfm2000/creatorhub` or `youtuber-website`).
2. Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist/creatorhub/browser`
3. Click **Deploy Site**.

---

## 🔑 External Integrations Setup

Update [`src/environments/environment.ts`](./src/environments/environment.ts) with your credentials:
- **SheetDB API URL & Key** for live Google Sheets backend.
- **Firebase Config** for Firebase Authentication and Firestore chat.
- **YouTube Data API v3 Key** for live channel subscriber statistics.

---

## 📄 License
MIT License. Built for creators.
