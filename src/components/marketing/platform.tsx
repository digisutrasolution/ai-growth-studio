'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Activity, BarChart3, Sparkles, SlidersHorizontal, Check } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { Reveal } from '@/components/ui/reveal'
import { revenueSeries } from '@/lib/data'

const max = Math.max(...revenueSeries.map((d) => d.revenue))

const chat = [
  { role: 'user', text: 'Increase my website traffic' },
  { role: 'ai', text: 'Analyzing your website… Here are 5 optimization opportunities:' },
  { role: 'ai-list', items: ['Target 38 high-intent keywords', 'Fix 12 broken links', 'Improve LCP by 1.4s', 'Add 3 internal link clusters', 'Refresh 4 stale posts'] },
]

export function Platform() {
  const reduce = useReducedMotion()
  return (
    <section id="platform" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="AI Dashboard Preview"
          title={<>One enterprise cockpit for <span className="text-gradient">all your growth</span></>}
          subtitle="Analytics, campaign management, and an always-on AI assistant — unified in a dashboard your whole team will live in."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* Analytics dashboard */}
          <Reveal className="lg:col-span-2">
            <div className="glass-strong h-full rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-accent" />
                  <h3 className="font-semibold">Analytics dashboard</h3>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-medium text-emerald-400">+18.2% MoM</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { l: 'Revenue', v: '$284.9k' },
                  { l: 'Conversion', v: '4.86%' },
                  { l: 'Customers', v: '12.4k' },
                  { l: 'Avg. ROAS', v: '4.2x' },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-line bg-surface/40 p-3">
                    <p className="text-lg font-semibold">{s.v}</p>
                    <p className="text-[11px] text-fg-muted">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* area-ish bar chart */}
              <div className="mt-5 flex h-40 items-end gap-1.5">
                {revenueSeries.map((d, i) => (
                  <motion.div
                    key={d.month}
                    initial={reduce ? { opacity: 0 } : { height: 0 }}
                    whileInView={{ height: `${(d.revenue / max) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.04 }}
                    className="group relative flex-1 rounded-t-md bg-gradient-to-t from-brand/40 to-brand-2"
                    style={{ height: `${(d.revenue / max) * 100}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-surface px-1.5 py-0.5 text-[10px] opacity-0 shadow transition-opacity group-hover:opacity-100">
                      {d.month}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-2 text-center text-[11px] text-fg-muted">Revenue · last 12 months</p>
            </div>
          </Reveal>

          {/* AI assistant panel */}
          <Reveal delay={0.1}>
            <div className="glass-strong flex h-full flex-col rounded-3xl p-6">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-brand-gradient text-white"><Sparkles className="size-4" /></span>
                <h3 className="font-semibold">AI assistant panel</h3>
              </div>

              <div className="mt-5 flex-1 space-y-3">
                {chat.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.35 }}
                    className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                  >
                    {m.role === 'ai-list' ? (
                      <ul className="glass w-[90%] space-y-1.5 rounded-2xl p-3 text-xs">
                        {m.items!.map((it) => (
                          <li key={it} className="flex items-center gap-2"><Check className="size-3.5 shrink-0 text-emerald-400" />{it}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className={m.role === 'user' ? 'max-w-[85%] rounded-2xl bg-brand-gradient px-3.5 py-2 text-sm text-white' : 'max-w-[90%] rounded-2xl glass px-3.5 py-2 text-sm'}>
                        {m.text}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-line glass px-3 py-2 text-xs text-fg-muted">
                <Activity className="size-4 text-accent" /> Executing optimizations…
              </div>
            </div>
          </Reveal>
        </div>

        {/* Campaign manager strip */}
        <Reveal delay={0.05} className="mt-5">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-accent" />
              <h3 className="font-semibold">Campaign manager</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {['Create campaigns', 'Budget control', 'Audience targeting', 'A/B testing'].map((f) => (
                <div key={f} className="flex items-center gap-2 rounded-xl border border-line bg-surface/40 px-4 py-3 text-sm">
                  <Check className="size-4 text-emerald-400" /> {f}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
