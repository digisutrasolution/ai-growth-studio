'use client'

import { Plus, Download } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { StatCard } from '@/components/app/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { customers, customerSegments, customerHealthStyles } from '@/lib/data'
import { cn, formatCurrency } from '@/lib/utils'

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const w = 64
  const h = 22
  const step = w / (data.length - 1)
  const pts = data.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`).join(' ')
  const down = data[data.length - 1] < data[0]
  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={down ? '#fb7185' : '#34d399'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CustomersBoard() {
  const total = customerSegments.reduce((s, x) => s + x.count, 0)
  const avgLtv = Math.round(customers.reduce((s, c) => s + c.ltv, 0) / customers.length)
  const atRisk = customerSegments.find((s) => s.name === 'At risk')?.count ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Customers</h2>
          <p className="text-sm text-fg-muted">Track behavior, segment and personalize at scale.</p>
        </div>
        <div className="flex gap-2">
          <button className={cn(buttonVariants({ variant: 'glass', size: 'sm' }))}><Download className="size-4" /> Export</button>
          <button className={cn(buttonVariants({ size: 'sm' }))}><Plus className="size-4" /> Add customer</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total customers" value={total.toLocaleString()} delta="+6%" trend="up" />
        <StatCard label="Active (30d)" value="8.9k" delta="+4%" trend="up" />
        <StatCard label="Avg. LTV" value={formatCurrency(avgLtv)} delta="+11%" trend="up" />
        <StatCard label="Churn risk" value={atRisk.toLocaleString()} delta="+2%" trend="down" />
      </div>

      {/* Segments */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-fg-muted">Segments</h3>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {customerSegments.map((s) => (
            <GlassCard key={s.name} hover className="p-4">
              <p className={cn('text-sm font-semibold', s.accent)}>{s.name}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{s.count.toLocaleString()}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-fg/10">
                <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${s.share}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-fg-muted">{s.share}% of base</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-fg-muted">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Segment</th>
                <th className="px-5 py-3 text-right font-medium">LTV</th>
                <th className="px-5 py-3 text-right font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Activity</th>
                <th className="px-5 py-3 font-medium">Last active</th>
                <th className="px-5 py-3 font-medium">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-fg/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">{c.initials}</span>
                      <div className="min-w-0">
                        <p className="truncate font-medium leading-tight">{c.name}</p>
                        <p className="truncate text-xs text-fg-muted">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-fg-muted">{c.segment}</td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">{formatCurrency(c.ltv)}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-fg-muted">{c.orders}</td>
                  <td className="px-5 py-3.5"><Sparkline data={c.activity} /></td>
                  <td className="px-5 py-3.5 text-fg-muted">{c.lastActive}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', customerHealthStyles[c.health])}>{c.health}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
