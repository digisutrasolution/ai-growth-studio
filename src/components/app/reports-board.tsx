'use client'

import { Plus, Download, FileText, Calendar, Clock } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { StatCard } from '@/components/app/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { reportTemplates, scheduledReports, recentReports } from '@/lib/data'
import { cn } from '@/lib/utils'

export function ReportsBoard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Reports</h2>
          <p className="text-sm text-fg-muted">Real-time, exportable and scheduled reporting.</p>
        </div>
        <button className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="size-4" /> Build report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Saved reports" value="18" delta="+3" trend="up" />
        <StatCard label="Scheduled" value="6" delta="+1" trend="up" />
        <StatCard label="Exports (mo)" value="142" delta="+24%" trend="up" />
        <StatCard label="Recipients" value="24" delta="+2" trend="up" />
      </div>

      {/* Templates */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-fg-muted">Start from a template</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reportTemplates.map((t) => (
            <button key={t.name} className="group flex items-start gap-3 rounded-2xl border border-line glass p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:glow-soft">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line glass transition-colors group-hover:bg-brand/10">
                <t.icon className="size-5 text-accent" />
              </span>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-fg-muted">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Scheduled */}
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="size-4 text-accent" />
            <h3 className="font-semibold">Scheduled reports</h3>
          </div>
          <ul className="space-y-3">
            {scheduledReports.map((r) => (
              <li key={r.name} className="flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-3">
                <Calendar className="size-4 shrink-0 text-fg-muted" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-fg-muted">{r.frequency} · {r.format} · {r.recipients} recipients</p>
                </div>
                <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', r.status === 'Active' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-amber-400/15 text-amber-400')}>{r.status}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Recent */}
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="size-4 text-accent" />
            <h3 className="font-semibold">Recent reports</h3>
          </div>
          <ul className="space-y-3">
            {recentReports.map((r) => (
              <li key={r.name} className="flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-3">
                <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg text-[10px] font-bold', r.format === 'PDF' ? 'bg-rose-400/15 text-rose-400' : 'bg-emerald-400/15 text-emerald-400')}>{r.format}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-fg-muted">{r.date} · {r.size}</p>
                </div>
                <button className="grid size-8 shrink-0 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg" aria-label={`Download ${r.name}`}>
                  <Download className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  )
}
