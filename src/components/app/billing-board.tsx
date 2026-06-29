'use client'

import { CreditCard, Download, Check, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { buttonVariants } from '@/components/ui/button'
import { usageMeters, invoices } from '@/lib/data'
import { cn, formatCurrency, formatCompact } from '@/lib/utils'

export function BillingBoard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Billing</h2>
        <p className="text-sm text-fg-muted">Manage your plan, usage and invoices.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Current plan */}
        <GlassCard gradient className="p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                <Sparkles className="size-3.5" /> Professional plan
              </span>
              <p className="mt-3 text-3xl font-semibold tracking-tight">$129<span className="text-base font-normal text-fg-muted">/mo</span></p>
              <p className="text-sm text-fg-muted">Renews Jul 1, 2026 · billed monthly</p>
            </div>
            <div className="flex gap-2">
              <button className={cn(buttonVariants({ variant: 'glass', size: 'sm' }))}>Change plan</button>
              <button className={cn(buttonVariants({ size: 'sm' }))}>Upgrade</button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            {usageMeters.map((m) => {
              const pct = Math.min(100, Math.round((m.used / m.total) * 100))
              const near = pct >= 80
              const fmt = (n: number) => (m.unit ? `${n}${m.unit}` : n >= 1000 ? formatCompact(n) : String(n))
              return (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{m.label}</span>
                    <span className="text-fg-muted tabular-nums">{fmt(m.used)} / {fmt(m.total)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-fg/10">
                    <div className={cn('h-full rounded-full', near ? 'bg-amber-400' : 'bg-brand-gradient')} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* Payment method */}
        <GlassCard className="flex flex-col p-6">
          <h3 className="font-semibold">Payment method</h3>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-4">
            <span className="grid size-10 place-items-center rounded-lg bg-brand-gradient text-white"><CreditCard className="size-5" /></span>
            <div>
              <p className="text-sm font-medium">Visa •••• 4242</p>
              <p className="text-xs text-fg-muted">Expires 09 / 28</p>
            </div>
          </div>
          <button className={cn(buttonVariants({ variant: 'glass', size: 'sm' }), 'mt-3')}>Update card</button>
          <div className="mt-auto space-y-2 border-t border-line pt-4 text-sm text-fg-muted">
            <p className="flex items-center gap-2"><Check className="size-4 text-emerald-400" /> Auto-renew enabled</p>
            <p className="flex items-center gap-2"><Check className="size-4 text-emerald-400" /> Invoices emailed to billing@</p>
          </div>
        </GlassCard>
      </div>

      {/* Invoices */}
      <GlassCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="font-semibold">Invoices</h3>
          <button className="text-xs font-medium text-accent hover:underline">Download all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-y border-line text-left text-xs uppercase tracking-wider text-fg-muted">
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoices.map((inv) => (
                <tr key={inv.id} className="transition-colors hover:bg-fg/[0.03]">
                  <td className="px-5 py-3.5 font-medium">{inv.id}</td>
                  <td className="px-5 py-3.5 text-fg-muted">{inv.date}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{formatCurrency(inv.amount)}</td>
                  <td className="px-5 py-3.5"><span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">{inv.status}</span></td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="grid size-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg" aria-label={`Download ${inv.id}`}><Download className="size-4" /></button>
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
