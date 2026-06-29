import { ShieldCheck, Activity, AlertTriangle, Info, XCircle, Bot } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { StatCard } from '@/components/app/stat-card'
import { RevenueChart } from '@/components/app/charts'
import {
  adminStats, adminUsers, adminPlanStyles, adminStatusStyles, systemLogs, securityChecks,
} from '@/lib/data'
import { cn } from '@/lib/utils'

const logIcon = { info: Info, warn: AlertTriangle, error: XCircle }
const logColor = { info: 'text-blue-400', warn: 'text-amber-400', error: 'text-rose-400' }

export function AdminBoard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-white glow-brand"><ShieldCheck className="size-5" /></span>
        <div>
          <h2 className="text-xl font-semibold">Admin overview</h2>
          <p className="text-sm text-fg-muted">Enterprise administration, monitoring and security.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue analytics */}
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Revenue analytics</h3>
          <p className="mb-4 text-xs text-fg-muted">Platform MRR — last 12 months</p>
          <RevenueChart />
        </GlassCard>

        {/* Security monitoring */}
        <GlassCard gradient className="p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-accent" />
            <h3 className="font-semibold">Security</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {securityChecks.map((c) => (
              <li key={c.label} className="flex items-start justify-between gap-2 rounded-xl border border-line bg-surface/40 p-3">
                <div>
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="text-xs text-fg-muted">{c.value}</p>
                </div>
                <span className="mt-0.5 size-2 shrink-0 rounded-full bg-emerald-400" />
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* User / subscription management */}
        <GlassCard className="overflow-hidden p-0 lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h3 className="font-semibold">Account management</h3>
              <p className="text-xs text-fg-muted">Users · subscriptions · usage</p>
            </div>
            <button className="text-xs font-medium text-accent hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-y border-line text-left text-xs uppercase tracking-wider text-fg-muted">
                  <th className="px-5 py-3 font-medium">Account</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">MRR</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {adminUsers.map((u) => (
                  <tr key={u.email} className="transition-colors hover:bg-fg/[0.03]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-9 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">{u.initials}</span>
                        <div className="min-w-0">
                          <p className="truncate font-medium leading-tight">{u.name}</p>
                          <p className="truncate text-xs text-fg-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', adminPlanStyles[u.plan])}>{u.plan}</span></td>
                    <td className="px-5 py-3.5"><span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', adminStatusStyles[u.status])}>{u.status}</span></td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-medium">{u.mrr}</td>
                    <td className="px-5 py-3.5 text-right"><button className="text-xs font-medium text-accent hover:underline">Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* System logs */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-accent" />
            <h3 className="font-semibold">System logs</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {systemLogs.map((l, i) => {
              const Icon = logIcon[l.level]
              return (
                <li key={i} className="flex gap-2.5">
                  <Icon className={cn('mt-0.5 size-4 shrink-0', logColor[l.level])} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{l.message}</p>
                    <p className="text-[11px] text-fg-muted">{l.time}</p>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-surface/40 p-3 text-xs text-fg-muted">
            <Bot className="size-4 text-accent" /> AI agent control & API management available on request.
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
