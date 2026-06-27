'use client'

import { useMemo, useState } from 'react'
import { Plus, Search, FlaskConical, MoreHorizontal } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { StatCard } from '@/components/app/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { campaigns, channelStyles, campaignStatusStyles, type CampaignStatus } from '@/lib/data'
import { cn, formatCurrency } from '@/lib/utils'

const FILTERS: ('All' | CampaignStatus)[] = ['All', 'Active', 'Scheduled', 'Paused', 'Completed']

export function CampaignsBoard() {
  const [filter, setFilter] = useState<'All' | CampaignStatus>('All')
  const [query, setQuery] = useState('')

  const rows = useMemo(
    () =>
      campaigns.filter(
        (c) => (filter === 'All' || c.status === filter) && c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [filter, query],
  )

  const totalSpend = campaigns.reduce((s, c) => s + c.spent, 0)
  const totalConv = campaigns.reduce((s, c) => s + c.conversions, 0)
  const withRoas = campaigns.filter((c) => c.roas !== null)
  const avgRoas = withRoas.reduce((s, c) => s + (c.roas ?? 0), 0) / withRoas.length
  const activeCount = campaigns.filter((c) => c.status === 'Active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Campaigns</h2>
          <p className="text-sm text-fg-muted">Create, budget, target and A/B test every campaign.</p>
        </div>
        <button className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="size-4" /> New campaign
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active campaigns" value={String(activeCount)} delta="+5" trend="up" />
        <StatCard label="Total spend" value={formatCurrency(totalSpend)} delta="+12%" trend="up" />
        <StatCard label="Avg. ROAS" value={`${avgRoas.toFixed(1)}x`} delta="+0.6" trend="up" />
        <StatCard label="Conversions" value={totalConv.toLocaleString()} delta="+8%" trend="up" />
      </div>

      {/* Toolbar */}
      <GlassCard className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const count = f === 'All' ? campaigns.length : campaigns.filter((c) => c.status === f).length
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    filter === f ? 'bg-brand-gradient text-white' : 'text-fg-muted hover:bg-fg/5 hover:text-fg',
                  )}
                >
                  {f} <span className={cn('ml-1 text-xs', filter === f ? 'text-white/70' : 'text-fg-muted')}>{count}</span>
                </button>
              )
            })}
          </div>
          <div className="relative ml-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns…"
              className="h-10 w-full rounded-xl border border-line bg-surface/60 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-fg-muted focus:border-brand/50 sm:w-56"
            />
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-fg-muted">
                <th className="px-5 py-3 font-medium">Campaign</th>
                <th className="px-5 py-3 font-medium">Channel</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Budget</th>
                <th className="px-5 py-3 text-right font-medium">ROAS</th>
                <th className="px-5 py-3 text-right font-medium">Conv.</th>
                <th className="px-5 py-3 text-right font-medium">CTR</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((c) => {
                const pct = Math.min(100, Math.round((c.spent / c.budget) * 100)) || 0
                return (
                  <tr key={c.id} className="transition-colors hover:bg-fg/[0.03]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        {c.abTest && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-medium text-brand" title="A/B test running">
                            <FlaskConical className="size-3" /> A/B
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-fg-muted">{c.audience}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', channelStyles[c.channel])}>{c.channel}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', campaignStatusStyles[c.status])}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3.5 w-44">
                      <div className="flex items-center justify-between text-xs">
                        <span className="tabular-nums">{formatCurrency(c.spent)}</span>
                        <span className="text-fg-muted tabular-nums">/ {formatCurrency(c.budget)}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-fg/10">
                        <div className={cn('h-full rounded-full', pct >= 100 ? 'bg-amber-400' : 'bg-brand-gradient')} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-medium">{c.roas !== null ? `${c.roas}x` : '—'}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-fg-muted">{c.conversions.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-fg-muted">{c.ctr}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="grid size-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg" aria-label={`Actions for ${c.name}`}>
                        <MoreHorizontal className="size-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {rows.length === 0 && <p className="px-5 py-12 text-center text-sm text-fg-muted">No campaigns match your filters.</p>}
        </div>
      </GlassCard>
    </div>
  )
}
