'use client'

import { useState } from 'react'
import { Plus, ArrowDown, Play, Pause, Zap } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { StatCard } from '@/components/app/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { workflows, nodeKindStyles } from '@/lib/data'
import { cn } from '@/lib/utils'

export function AutomationBoard() {
  const [selectedId, setSelectedId] = useState(workflows[0].id)
  const selected = workflows.find((w) => w.id === selectedId)!
  const liveCount = workflows.filter((w) => w.status === 'Live').length
  const totalRuns = workflows.reduce((s, w) => s + w.runs, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Automation</h2>
          <p className="text-sm text-fg-muted">Build self-running workflows with triggers and smart actions.</p>
        </div>
        <button className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="size-4" /> New workflow
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Live workflows" value={`${liveCount} / ${workflows.length}`} delta="live" trend="up" />
        <StatCard label="Runs today" value={totalRuns.toLocaleString()} delta="+12%" trend="up" />
        <StatCard label="Success rate" value="99.2%" delta="+0.4pt" trend="up" />
        <StatCard label="Actions saved" value="38k" delta="+18%" trend="up" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        {/* Workflow list */}
        <div className="space-y-3">
          {workflows.map((w) => {
            const active = w.id === selectedId
            return (
              <button
                key={w.id}
                onClick={() => setSelectedId(w.id)}
                className={cn(
                  'w-full rounded-2xl border p-4 text-left transition-all',
                  active ? 'border-brand/50 glass-strong glow-soft' : 'border-line glass hover:-translate-y-0.5',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{w.name}</span>
                  <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', w.status === 'Live' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-amber-400/15 text-amber-400')}>
                    {w.status === 'Live' ? <Play className="size-2.5" /> : <Pause className="size-2.5" />} {w.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-fg-muted">{w.nodes.length} steps · {w.runs.toLocaleString()} runs · {w.successRate}% success</p>
              </button>
            )
          })}
        </div>

        {/* Flow canvas */}
        <GlassCard className="relative overflow-hidden p-6">
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-accent" />
                <h3 className="font-semibold">{selected.name}</h3>
              </div>
              <span className="text-xs text-fg-muted">{selected.runs.toLocaleString()} total runs</span>
            </div>

            <div className="mx-auto flex max-w-md flex-col items-center">
              {selected.nodes.map((node, i) => {
                const s = nodeKindStyles[node.kind]
                return (
                  <div key={i} className="flex w-full flex-col items-center">
                    <div className={cn('w-full rounded-2xl border bg-surface/60 p-4', s.ring)}>
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line glass">
                          <node.icon className="size-5 text-fg" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide', s.chip)}>{s.label}</span>
                          </div>
                          <p className="mt-0.5 truncate text-sm font-medium">{node.label}</p>
                          <p className="truncate text-xs text-fg-muted">{node.detail}</p>
                        </div>
                      </div>
                    </div>
                    {i < selected.nodes.length - 1 && (
                      <div className="flex h-8 items-center justify-center">
                        <span className="grid size-6 place-items-center rounded-full border border-line glass text-fg-muted">
                          <ArrowDown className="size-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}

              <button className="mt-4 flex items-center gap-1.5 rounded-xl border border-dashed border-line px-4 py-2 text-xs text-fg-muted transition-colors hover:border-brand/40 hover:text-fg">
                <Plus className="size-3.5" /> Add step
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
