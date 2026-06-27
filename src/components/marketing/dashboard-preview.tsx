'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Sparkles, TrendingUp, Users } from 'lucide-react'

const bars = [42, 55, 48, 67, 60, 78, 72, 88, 95]

export function DashboardPreview() {
  const reduce = useReducedMotion()
  return (
    <div className="glass-strong relative w-full rounded-3xl p-4 shadow-2xl sm:p-5">
      {/* window chrome */}
      <div className="mb-4 flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-rose-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-xs text-fg-muted">app.aigrowth.studio/dashboard</span>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Revenue', value: '$284.9k', delta: '+18%', icon: TrendingUp },
          { label: 'Leads', value: '1,284', delta: '+9%', icon: Users },
          { label: 'ROAS', value: '4.2x', delta: '+0.6', icon: ArrowUpRight },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface/40 p-3">
            <s.icon className="mb-2 size-4 text-accent" />
            <p className="text-base font-semibold">{s.value}</p>
            <p className="flex items-center justify-between text-[11px] text-fg-muted">
              {s.label} <span className="text-emerald-400">{s.delta}</span>
            </p>
          </div>
        ))}
      </div>

      {/* chart */}
      <div className="mt-3 rounded-xl border border-line bg-surface/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">Campaign performance</p>
          <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">Live</span>
        </div>
        <div className="flex h-28 items-end gap-2">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              whileInView={{ height: `${h}%`, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 rounded-t-md bg-gradient-to-t from-brand to-brand-2"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* AI insight strip */}
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-brand/10 p-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white">
          <Sparkles className="size-4" />
        </span>
        <p className="text-xs leading-snug text-fg">
          <span className="font-medium">Nova:</span> Shift 15% budget to TikTok — CPA is 32% lower this week.
        </p>
      </div>

      {/* floating mini badge */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="glass absolute -right-4 -top-4 hidden items-center gap-2 rounded-2xl px-3 py-2 sm:flex"
      >
        <span className="size-2 rounded-full bg-emerald-400" />
        <span className="text-xs font-medium">5 agents active</span>
      </motion.div>
    </div>
  )
}
