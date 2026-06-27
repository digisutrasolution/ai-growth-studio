'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings2, Activity, Plus } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { StatCard } from '@/components/app/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { agents } from '@/lib/data'
import { cn } from '@/lib/utils'

const activity = [
  { agent: 'Marketing AI Agent', action: 'Reallocated $4.2k budget to TikTok', time: '2m ago', accent: 'text-violet-400' },
  { agent: 'SEO AI Agent', action: 'Fixed 12 broken links on /blog', time: '14m ago', accent: 'text-blue-400' },
  { agent: 'Content AI Agent', action: 'Drafted 3 social posts for review', time: '38m ago', accent: 'text-cyan-400' },
  { agent: 'Sales AI Agent', action: 'Qualified 24 new inbound leads', time: '1h ago', accent: 'text-emerald-400' },
  { agent: 'Customer Support AI Agent', action: 'Resolved 86 tickets autonomously', time: '2h ago', accent: 'text-fuchsia-400' },
]

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={on ? 'Pause agent' : 'Activate agent'}
      onClick={onToggle}
      className={cn('relative h-6 w-11 rounded-full border border-line transition-colors', on ? 'bg-brand-gradient' : 'bg-fg/10')}
    >
      <motion.span
        className="absolute top-1 size-4 rounded-full bg-white shadow"
        animate={{ left: on ? 25 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

export function AgentsBoard() {
  const [active, setActive] = useState<Record<string, boolean>>(Object.fromEntries(agents.map((a) => [a.id, true])))
  const activeCount = Object.values(active).filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">AI Agents</h2>
          <p className="text-sm text-fg-muted">Activate, configure and monitor your autonomous workforce.</p>
        </div>
        <button className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="size-4" /> Deploy agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active agents" value={`${activeCount} / ${agents.length}`} delta="live" trend="up" />
        <StatCard label="Tasks today" value="1,284" delta="+12%" trend="up" />
        <StatCard label="Auto-resolve rate" value="78%" delta="+4pt" trend="up" />
        <StatCard label="Hours saved" value="142" delta="+18" trend="up" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Agent grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {agents.map((agent) => {
            const on = active[agent.id]
            return (
              <GlassCard key={agent.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between">
                  <span
                    className="grid size-11 place-items-center rounded-2xl border border-line"
                    style={{ background: `${agent.glow}1a`, boxShadow: `0 8px 30px -14px ${agent.glow}` }}
                  >
                    <agent.icon className={cn('size-5', agent.accent)} />
                  </span>
                  <Toggle on={on} onToggle={() => setActive((s) => ({ ...s, [agent.id]: !s[agent.id] }))} />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <h3 className="font-semibold">{agent.name}</h3>
                  <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', on ? 'bg-emerald-400/15 text-emerald-400' : 'bg-fg/10 text-fg-muted')}>
                    <span className={cn('size-1.5 rounded-full', on ? 'bg-emerald-400' : 'bg-fg-muted')} /> {on ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-sm text-fg-muted">{agent.tagline}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {agent.capabilities.map((c) => (
                    <span key={c} className="rounded-full border border-line glass px-2 py-0.5 text-[11px] text-fg-muted">{c}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <div className="flex gap-5">
                    {agent.stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-sm font-semibold tabular-nums">{s.value}</p>
                        <p className="text-[10px] text-fg-muted">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <button className="grid size-9 place-items-center rounded-xl border border-line glass text-fg-muted transition-colors hover:text-fg" aria-label={`Configure ${agent.name}`}>
                    <Settings2 className="size-[18px]" />
                  </button>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {/* Activity feed */}
        <GlassCard gradient className="p-5">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-accent" />
            <h3 className="font-semibold">Agent activity</h3>
          </div>
          <ol className="mt-4 space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="relative flex gap-3 pl-1">
                <span className={cn('mt-1 size-2 shrink-0 rounded-full bg-current', a.accent)} />
                <div className="min-w-0">
                  <p className="text-sm leading-snug">{a.action}</p>
                  <p className="text-[11px] text-fg-muted"><span className={a.accent}>{a.agent}</span> · {a.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </GlassCard>
      </div>
    </div>
  )
}
