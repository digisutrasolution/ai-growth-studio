import { Sparkles, ArrowUpRight, Plus } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { StatCard } from '@/components/app/stat-card'
import { RevenueChart, ChannelChart } from '@/components/app/charts'
import { buttonVariants } from '@/components/ui/button'
import { dashboardStats, aiRecommendations, campaignRows } from '@/lib/data'
import { cn } from '@/lib/utils'

const impactColor: Record<string, string> = {
  High: 'bg-emerald-400/15 text-emerald-400',
  Medium: 'bg-amber-400/15 text-amber-400',
  Low: 'bg-rose-400/15 text-rose-400',
}

const statusColor: Record<string, string> = {
  Active: 'bg-emerald-400/15 text-emerald-400',
  Scheduled: 'bg-orange-400/15 text-orange-400',
  Paused: 'bg-fg/10 text-fg-muted',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Greeting row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Welcome back, Steven 👋</h2>
          <p className="text-sm text-fg-muted">Here&apos;s how your growth engine is performing today.</p>
        </div>
        <button className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="size-4" /> New campaign
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue vs. spend</h3>
              <p className="text-xs text-fg-muted">Last 12 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" /> Spend</span>
            </div>
          </div>
          <RevenueChart />
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-semibold">Revenue by channel</h3>
          <p className="text-xs text-fg-muted">Share of attributed revenue</p>
          <div className="mt-4">
            <ChannelChart />
          </div>
        </GlassCard>
      </div>

      {/* AI recommendations + campaigns */}
      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard gradient className="p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-gradient text-white"><Sparkles className="size-4" /></span>
            <h3 className="font-semibold">AI recommendations</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {aiRecommendations.map((r) => (
              <li key={r.title} className="rounded-xl border border-line bg-surface/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{r.title}</p>
                  <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', impactColor[r.impact])}>{r.impact}</span>
                </div>
                <p className="mt-1 text-xs text-fg-muted">{r.detail}</p>
                <button className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                  Apply <ArrowUpRight className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Active campaigns</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-fg-muted">
                  <th className="pb-3 font-medium">Campaign</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Spend</th>
                  <th className="pb-3 text-right font-medium">ROAS</th>
                  <th className="pb-3 text-right font-medium">Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {campaignRows.map((c) => (
                  <tr key={c.name} className="transition-colors hover:bg-fg/[0.03]">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3"><span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', statusColor[c.status])}>{c.status}</span></td>
                    <td className="py-3 text-right tabular-nums text-fg-muted">{c.spend}</td>
                    <td className="py-3 text-right tabular-nums font-medium">{c.roas}</td>
                    <td className="py-3 text-right tabular-nums text-fg-muted">{c.conv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
