# AI Growth Studio

> Grow your business with AI-powered digital marketing automation.

A premium, enterprise-grade **Digital Marketing & AI Agent platform** — a futuristic, dark-first SaaS experience combining AI automation, marketing tools, analytics, and intelligent agents. Built with a glassmorphism design system, smooth micro-interactions, and full dark/light theming.

**Live (local):** `npm run dev` → http://localhost:3000

---

## ✨ Highlights

- **Dark-first premium UI** — glassmorphism, aurora gradients, animated micro-interactions
- **Fully responsive** — desktop, tablet, mobile (375px and up)
- **Dark + light mode** — system-aware, one-click toggle, no flash
- **Accessible & SEO-ready** — semantic markup, reduced-motion support, Open Graph metadata
- **Motion** — `framer-motion` scroll reveals, staggered entrances, springy interactions

---

## 🧩 What's inside

### Marketing site (`/`)
| Section | Details |
|---|---|
| **Hero** | Headline, feature pills, dual CTAs, animated live dashboard preview |
| **AI Agent Marketplace** | 5 specialized agents (Marketing, SEO, Content, Sales, Support) — capabilities, usage stats, activate actions |
| **Services** | 8 marketing services + scrolling integrations marquee |
| **Platform preview** | Analytics panel, AI assistant chat example, campaign manager |
| **Advanced Features** | Automation engine, customer intelligence, reports, integrations |
| **Pricing** | Starter / Professional / Enterprise with monthly–yearly toggle |
| **AI Chat Assistant** | Global floating assistant with suggestions, typing indicator, voice/file actions |

### App dashboard (`/dashboard`)
Sidebar + topbar shell with: **Dashboard** (KPIs, revenue/spend area chart, channel bar chart, AI recommendations, campaigns table), **Analytics**, plus shell routes for AI Agents, Campaigns, Leads, Customers, Automation, Reports, Billing, Settings, and an **Admin** overview.

---

## 🛠 Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) · React 19
- **Styling:** Tailwind CSS v4 (CSS-first config) · custom glassmorphism design tokens
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Theming:** next-themes
- **Icons:** Lucide · **Fonts:** Sora (display) + Inter (body)

---

## 🚀 Getting started

```bash
# install
npm install

# run the dev server (http://localhost:3000)
npm run dev

# production build + start
npm run build
npm run start

# lint
npm run lint
```

Requires Node.js 18.18+ (Node 20+ recommended).

---

## 📁 Project structure

```
src/
├── app/
│   ├── layout.tsx              # root layout: fonts, theme, global AI assistant
│   ├── page.tsx                # marketing landing page
│   ├── globals.css             # Tailwind v4 theme tokens + design utilities
│   └── dashboard/              # app shell (layout + all routes)
├── components/
│   ├── marketing/              # hero, marketplace, services, pricing, …
│   ├── app/                    # sidebar, topbar, charts, stat cards
│   ├── assistant/              # floating AI chat assistant
│   ├── providers/              # theme provider
│   └── ui/                     # button, glass-card, badge, reveal, aurora, …
└── lib/
    ├── data.ts                 # mock data (agents, plans, metrics, …)
    └── utils.ts                # helpers (cn, formatters)
```

---

## 🗺 Roadmap

- [x] **Phase 1** — Marketing site + app dashboard shell (UI, mock data)
- [x] **Phase 2** — Fuller app screens (agents, campaigns, leads, customers, automation, reports, billing, settings, admin)
- [~] **Phase 4** — Auth foundation (login/signup/session/guard) + Nova AI assistant & agents wired to Claude (with demo fallback)
- [ ] **Phase 4 (remaining)** — Real auth + 2FA, PostgreSQL, Stripe billing
- [ ] **Phase 5** — Infrastructure, security hardening, monitoring

---

## 🖥️ Self-hosting (your own server)

The app builds to a minimal standalone server (`output: "standalone"`) and ships a Docker stack with PostgreSQL included.

### Option A — Docker Compose (recommended)

```bash
git clone https://github.com/digisutrasolution/ai-growth-studio.git
cd ai-growth-studio
cp .env.example .env          # set AUTH_SECRET, POSTGRES_PASSWORD, ANTHROPIC_API_KEY
docker compose up -d --build  # app on :3000, Postgres on :5432
```

Update later with `git pull && docker compose up -d --build`.

| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | Signs session JWTs — **set a strong value** (`openssl rand -base64 32`) |
| `POSTGRES_PASSWORD` | Password for the bundled database |
| `ANTHROPIC_API_KEY` | Live Claude responses for Nova + agents (else demo mode) |
| `OPENAI_API_KEY` | Alternative AI provider (used if no Anthropic key) |
| `CHAT_MODEL` | Optional model override (default `claude-opus-4-8`) |

### Option B — bare metal (Node + PM2)

```bash
npm ci && npm run build
node .next/standalone/server.js        # serves on PORT (default 3000), HOSTNAME=0.0.0.0
# or keep it alive: pm2 start "node .next/standalone/server.js" --name ai-growth-studio
```

The standalone server needs `public/` and `.next/static/` beside it — `npm run start` handles paths automatically if you prefer it.

### Reverse proxy + TLS (nginx)

```nginx
server {
  server_name yourdomain.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
# then: sudo certbot --nginx -d yourdomain.com   (free Let's Encrypt TLS)
```

> Sessions are signed JWTs (set `AUTH_SECRET`). Credentials are still accepted without a user store — wire the bundled Postgres (hashed passwords) before real production use.

### Alternative — Vercel (managed)

Push to GitHub → import the repo on [vercel.com](https://vercel.com) (zero config) → add the same env vars under **Settings → Environment Variables**.

---

## 👤 Author

Developed by **Steven** · DigiSutra Solutions

---

> Phase 1 is a front-end showcase: AI responses, metrics, and data are mocked. Real authentication, AI integration, and persistence arrive in later phases.
