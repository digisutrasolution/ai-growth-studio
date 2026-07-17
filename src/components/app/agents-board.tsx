'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Settings2, Activity, Plus, Sparkles, Loader2, X } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { StatCard } from '@/components/app/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { agents } from '@/lib/data'
import { cn } from '@/lib/utils'

const activity = [
  { agent: 'Marketing AI Agent', action: 'Reallocated $4.2k budget to TikTok', time: '2m ago', accent: 'text-orange-400' },
  { agent: 'SEO AI Agent', action: 'Fixed 12 broken links on /blog', time: '14m ago', accent: 'text-orange-500' },
  { agent: 'Content AI Agent', action: 'Drafted 3 social posts for review', time: '38m ago', accent: 'text-amber-400' },
  { agent: 'Sales AI Agent', action: 'Qualified 24 new inbound leads', time: '1h ago', accent: 'text-emerald-400' },
  { agent: 'Customer Support AI Agent', action: 'Resolved 86 tickets autonomously', time: '2h ago', accent: 'text-amber-400' },
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
  const [run, setRun] = useState<{ id: string; name: string; loading: boolean; text: string } | null>(null)

  async function runAgent(id: string, name: string) {
    setRun({ id, name, loading: true, text: '' })
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: id }),
      })
      const data = await res.json()
      setRun({ id, name, loading: false, text: data.reply || 'No suggestions right now — try again.' })
    } catch {
      setRun({ id, name, loading: false, text: "Couldn't reach the model just now. Please try again." })
    }
  }

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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => runAgent(agent.id, agent.name)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line glass px-3 py-2 text-xs font-medium text-fg transition-colors hover:bg-fg/5"
                    >
                      <Sparkles className="size-3.5 text-accent" /> Generate ideas
                    </button>
                    <button className="grid size-9 place-items-center rounded-xl border border-line glass text-fg-muted transition-colors hover:text-fg" aria-label={`Configure ${agent.name}`}>
                      <Settings2 className="size-[18px]" />
                    </button>
                  </div>
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

      {/* AI suggestions modal */}
      <AnimatePresence>
        {run && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRun(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-lg overflow-hidden rounded-3xl border border-line shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient text-white"><Sparkles className="size-[18px]" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{run.name}</p>
                  <p className="text-xs text-fg-muted">AI-generated suggestions for this week</p>
                </div>
                <button onClick={() => setRun(null)} aria-label="Close" className="grid size-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"><X className="size-4" /></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
                {run.loading ? (
                  <div className="flex items-center gap-2 text-sm text-fg-muted"><Loader2 className="size-4 animate-spin" /> Thinking…</div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">{run.text}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
