import { ShieldCheck, Lock, Users, Receipt, CheckCircle2, Download, Wallet } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { AdminOrderActions } from '@/components/app/admin-order-actions'
import { cn } from '@/lib/utils'
import { currencySymbol, type Currency } from '@/lib/payments'
import type { AdminSummary, AdminUser, AdminOrder } from '@/lib/admin-store'

interface Filters { from: string; to: string; status: string }
const STATUS_OPTIONS = ['', 'pending', 'paid', 'failed', 'refunded']

const METHOD_LABEL: Record<string, string> = {
  paypal: 'PayPal', cashfree: 'Cashfree', crypto: 'Crypto', bank_transfer: 'Bank transfer',
}

function money(minor: number, currency: string) {
  const sym = currencySymbol[currency as Currency] ?? ''
  return `${sym}${(minor / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusStyle: Record<string, string> = {
  paid: 'bg-emerald-400/15 text-emerald-400',
  pending: 'bg-amber-400/15 text-amber-400',
  failed: 'bg-red-400/15 text-red-400',
  refunded: 'bg-fg/10 text-fg-muted',
}

export function AdminBoard(props: {
  admin: boolean
  email: string | null
  summary?: AdminSummary
  users?: AdminUser[]
  orders?: AdminOrder[]
  filters?: Filters
}) {
  if (!props.admin) {
    return (
      <div className="mx-auto mt-10 max-w-lg">
        <GlassCard gradient className="p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white glow-brand"><Lock className="size-5" /></span>
          <h2 className="mt-4 text-lg font-semibold">Admin access required</h2>
          <p className="mt-2 text-sm text-fg-muted">
            {props.email ? <>Your account (<span className="font-medium text-fg">{props.email}</span>) isn’t an administrator.</> : 'Please sign in with an administrator account.'}
          </p>
          <p className="mt-3 text-xs text-fg-muted">
            To grant access, add the email to <code className="rounded bg-fg/10 px-1.5 py-0.5">ADMIN_EMAILS</code> in the server environment and restart.
          </p>
        </GlassCard>
      </div>
    )
  }

  const { summary, users = [], orders = [] } = props
  const filters: Filters = props.filters ?? { from: '', to: '', status: '' }
  const hasFilters = Boolean(filters.from || filters.to || filters.status)
  const revenueStr = summary && summary.revenue.length
    ? summary.revenue.map((r) => money(r.amount, r.currency)).join(' · ')
    : '—'

  // Export link mirrors the active filters.
  const exportParams = new URLSearchParams()
  if (filters.from) exportParams.set('from', filters.from)
  if (filters.to) exportParams.set('to', filters.to)
  if (filters.status) exportParams.set('status', filters.status)
  const exportHref = `/api/admin/orders/export${exportParams.toString() ? `?${exportParams}` : ''}`

  const stats = [
    { label: 'Users', value: String(summary?.users ?? 0), icon: Users },
    { label: 'Orders', value: String(summary?.orders ?? 0), icon: Receipt },
    { label: 'Paid orders', value: String(summary?.paidOrders ?? 0), icon: CheckCircle2 },
    { label: 'Revenue (paid)', value: revenueStr, icon: Wallet },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-white glow-brand"><ShieldCheck className="size-5" /></span>
        <div>
          <h2 className="text-xl font-semibold">Admin overview</h2>
          <p className="text-sm text-fg-muted">Live users, orders and revenue across all accounts.</p>
        </div>
      </div>

      {/* Real stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-fg-muted">{s.label}</p>
              <s.icon className="size-4 text-accent" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Orders */}
      <GlassCard className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h3 className="font-semibold">All orders</h3>
            <p className="text-xs text-fg-muted">
              {hasFilters ? `${orders.length} matching filter` : `Most recent ${orders.length} across every account`}
            </p>
          </div>
          <a
            href={exportHref}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/40 px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"
          >
            <Download className="size-3.5" /> Export CSV
          </a>
        </div>

        {/* Filter bar (plain GET form — works without JS) */}
        <form method="get" className="flex flex-wrap items-end gap-3 border-t border-line bg-surface/20 px-5 py-3 text-xs">
          <label className="flex flex-col gap-1">
            <span className="text-fg-muted">From</span>
            <input type="date" name="from" defaultValue={filters.from} className="rounded-lg border border-line bg-surface/60 px-2 py-1.5 text-sm" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-fg-muted">To</span>
            <input type="date" name="to" defaultValue={filters.to} className="rounded-lg border border-line bg-surface/60 px-2 py-1.5 text-sm" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-fg-muted">Status</span>
            <select name="status" defaultValue={filters.status} className="rounded-lg border border-line bg-surface/60 px-2 py-1.5 text-sm capitalize">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
            </select>
          </label>
          <button type="submit" className="rounded-lg bg-brand-gradient px-3 py-1.5 text-sm font-medium text-white">Filter</button>
          {hasFilters && <a href="/dashboard/admin" className="px-2 py-1.5 text-sm text-fg-muted hover:text-fg">Clear</a>}
        </form>

        {orders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-fg-muted">{hasFilters ? 'No orders match these filters.' : 'No orders yet.'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-y border-line text-left text-xs uppercase tracking-wider text-fg-muted">
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-5 py-3 font-medium">Account</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Method</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => (
                  <tr key={o.reference} className="transition-colors hover:bg-fg/[0.03]">
                    <td className="px-5 py-3 font-mono text-xs">{o.reference}</td>
                    <td className="px-5 py-3 text-fg-muted">{o.email}</td>
                    <td className="px-5 py-3 font-medium">{o.plan} <span className="text-xs font-normal text-fg-muted">· {o.cycle}</span></td>
                    <td className="px-5 py-3 text-fg-muted">{METHOD_LABEL[o.method] ?? o.method}</td>
                    <td className="px-5 py-3 text-fg-muted">{fmtDate(o.createdAt)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{money(o.amount, o.currency)}</td>
                    <td className="px-5 py-3"><span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium capitalize', statusStyle[o.status])}>{o.status}</span></td>
                    <td className="px-5 py-3"><AdminOrderActions reference={o.reference} status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Users */}
      <GlassCard className="overflow-hidden p-0">
        <div className="px-5 py-4">
          <h3 className="font-semibold">Accounts</h3>
          <p className="text-xs text-fg-muted">{users.length} registered · current plan and payment counts</p>
        </div>
        {users.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-fg-muted">No accounts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-y border-line text-left text-xs uppercase tracking-wider text-fg-muted">
                  <th className="px-5 py-3 font-medium">Account</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 text-right font-medium">Orders</th>
                  <th className="px-5 py-3 text-right font-medium">Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.email} className="transition-colors hover:bg-fg/[0.03]">
                    <td className="px-5 py-3">
                      <p className="font-medium leading-tight">{u.name}</p>
                      <p className="text-xs text-fg-muted">{u.email}</p>
                    </td>
                    <td className="px-5 py-3"><span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">{u.plan}</span></td>
                    <td className="px-5 py-3 text-fg-muted">{fmtDate(u.createdAt)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{u.orders}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{u.paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
