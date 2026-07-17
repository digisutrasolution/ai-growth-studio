'use client'

import { Plus, Sparkles } from 'lucide-react'
import { StatCard } from '@/components/app/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { leads, leadStages, type LeadStage } from '@/lib/data'
import { cn, formatCurrency, formatCompact } from '@/lib/utils'

function scoreStyle(score: number) {
  if (score >= 80) return 'bg-emerald-400/15 text-emerald-400'
  if (score >= 60) return 'bg-amber-400/15 text-amber-400'
  return 'bg-rose-400/15 text-rose-400'
}

const stageAccent: Record<LeadStage, string> = {
  New: 'bg-blue-400',
  Contacted: 'bg-orange-400',
  Qualified: 'bg-cyan-400',
  Proposal: 'bg-amber-400',
  Won: 'bg-emerald-400',
}

export function LeadsBoard() {
  const totalValue = leads.reduce((s, l) => s + l.value, 0)
  const wonValue = leads.filter((l) => l.stage === 'Won').reduce((s, l) => s + l.value, 0)
  const avgScore = Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Leads</h2>
          <p className="text-sm text-fg-muted">Capture, score and move leads through your pipeline.</p>
        </div>
        <button className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="size-4" /> Add lead
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open leads" value={String(leads.length)} delta="+9%" trend="up" />
        <StatCard label="Pipeline value" value={formatCurrency(totalValue)} delta="+14%" trend="up" />
        <StatCard label="Won this month" value={formatCurrency(wonValue)} delta="+22%" trend="up" />
        <StatCard label="Avg. lead score" value={String(avgScore)} delta="+3" trend="up" />
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {leadStages.map((stage) => {
          const items = leads.filter((l) => l.stage === stage)
          const colValue = items.reduce((s, l) => s + l.value, 0)
          return (
            <div key={stage} className="flex w-72 shrink-0 flex-col">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={cn('size-2 rounded-full', stageAccent[stage])} />
                  <span className="text-sm font-semibold">{stage}</span>
                  <span className="rounded-full bg-fg/10 px-1.5 text-xs text-fg-muted">{items.length}</span>
                </div>
                <span className="text-xs text-fg-muted tabular-nums">${formatCompact(colValue)}</span>
              </div>

              <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-line bg-surface/30 p-3">
                {items.map((l) => (
                  <div key={l.id} className="group cursor-grab rounded-xl border border-line glass p-3 transition-all hover:-translate-y-0.5 hover:glow-soft active:cursor-grabbing">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-9 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">{l.initials}</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium leading-tight">{l.name}</p>
                          <p className="truncate text-xs text-fg-muted">{l.company}</p>
                        </div>
                      </div>
                      <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums', scoreStyle(l.score))} title="Lead score">{l.score}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold tabular-nums">{formatCurrency(l.value)}</span>
                      <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-fg-muted">{l.source}</span>
                    </div>
                  </div>
                ))}

                <button className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-line py-2 text-xs text-fg-muted transition-colors hover:border-brand/40 hover:text-fg">
                  <Plus className="size-3.5" /> Add lead
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI hint */}
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-brand/10 p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white"><Sparkles className="size-[18px]" /></span>
        <p className="text-sm text-fg">
          <span className="font-medium">Sales AI Agent:</span> 3 leads in <span className="font-medium">Proposal</span> have a score above 80 and haven&apos;t been followed up in 48h — want me to send a personalized nudge?
        </p>
      </div>
    </div>
  )
}
