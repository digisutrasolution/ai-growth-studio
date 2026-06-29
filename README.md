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

## 🚀 Deploy (Vercel)

This is a standard Next.js app — Vercel needs zero extra config.

1. Push to GitHub (already at `digisutrasolution/ai-growth-studio`).
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo. Vercel auto-detects Next.js.
3. (Optional) add environment variables under **Settings → Environment Variables** to enable live AI:

   | Variable | Purpose |
   |---|---|
   | `ANTHROPIC_API_KEY` | Live Claude responses for Nova + agents (recommended) |
   | `OPENAI_API_KEY` | Alternative provider (used if no Anthropic key) |
   | `CHAT_MODEL` | Optional model override (default `claude-opus-4-8`) |

   Without these the AI features run in **demo mode** (canned responses) — the deploy still works.
4. **Deploy.** Every push to `main` redeploys automatically.

CLI alternative:

```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production
```

> Auth uses an unsigned demo cookie and data is mocked — fine for a live demo, not for production secrets. Harden (signed sessions, DB, 2FA) before real use.

---

## 👤 Author

Developed by **Steven** · DigiSutra Solutions

---

> Phase 1 is a front-end showcase: AI responses, metrics, and data are mocked. Real authentication, AI integration, and persistence arrive in later phases.
