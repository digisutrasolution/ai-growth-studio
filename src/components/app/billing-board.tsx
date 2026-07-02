'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Check, Loader2, AlertTriangle, Receipt, Download, CalendarClock, RefreshCw, Ban } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CheckoutPanel } from '@/components/app/checkout-panel'
import { cn } from '@/lib/utils'
import { currencySymbol, type Currency, type MethodId } from '@/lib/payments'
import type { OrderRow } from '@/lib/billing-store'
import type { SubRow } from '@/lib/subscriptions'

const METHOD_LABEL: Record<string, string> = {
  paypal: 'PayPal', cashfree: 'Cashfree', crypto: 'Crypto', bank_transfer: 'Bank transfer',
}

function money(amountMinor: number, currency: string) {
  const sym = currencySymbol[currency as Currency] ?? ''
  return `${sym}${(amountMinor / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

type Banner = { kind: 'success' | 'pending' | 'error'; msg: string }

export function BillingBoard({
  configured, plan, orders, subscription, email, returnStatus, returnRef,
}: {
  configured: Partial<Record<MethodId, boolean>>
  plan: string
  orders: OrderRow[]
  subscription: SubRow | null
  email: string | null
  returnStatus: string | null
  returnRef: string | null
}) {
  const router = useRouter()
  const [subBusy, setSubBusy] = useState(false)

  async function subAction(action: 'cancel' | 'resume') {
    if (action === 'cancel' && !window.confirm('Turn off auto-renew? Your plan stays active until the end of the current period, then downgrades to Free.')) return
    setSubBusy(true)
    try {
      const res = await fetch('/api/subscription', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }),
      })
      if (res.ok) router.refresh()
    } finally {
      setSubBusy(false)
    }
  }
  const [banner, setBanner] = useState<Banner | null>(() => {
    if (returnStatus === 'cancelled') return { kind: 'error', msg: 'Payment cancelled. You can try again anytime.' }
    if (returnStatus === 'success' && returnRef) return { kind: 'pending', msg: 'Confirming your payment…' }
    return null
  })
  const handled = useRef(false)

  // On return from a gateway, confirm the payment and refresh the view.
  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const clearUrl = () => window.history.replaceState(null, '', '/dashboard/billing')

    if (returnStatus === 'cancelled') {
      clearUrl()
      return
    }
    if (returnStatus === 'success' && returnRef) {
      fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: returnRef }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.status === 'paid') {
            setBanner({ kind: 'success', msg: `Payment confirmed — your ${d.plan ?? ''} plan is now active.` })
            clearUrl()
            router.refresh()
          } else {
            setBanner({ kind: 'pending', msg: 'Payment received. We’ll activate your plan as soon as it clears.' })
            clearUrl()
          }
        })
        .catch(() => {
          setBanner({ kind: 'pending', msg: 'We couldn’t confirm just yet — this can take a moment. Refresh shortly.' })
          clearUrl()
        })
    }
  }, [returnStatus, returnRef, router])

  const latestPaid = orders.find((o) => o.status === 'paid')
  const isFree = plan === 'Free' || !plan
  const sub = subscription

  // Price shown on the plan card: recurring subscription price if we have it.
  const priceMinor = sub && sub.status !== 'canceled' ? sub.amount : latestPaid?.amount ?? 0
  const priceCurrency = sub?.currency ?? latestPaid?.currency ?? 'USD'
  const priceCycle = sub?.cycle ?? latestPaid?.cycle ?? 'monthly'

  let renewLine: string
  if (isFree) renewLine = 'Choose a plan above to unlock more capacity.'
  else if (sub?.status === 'past_due') renewLine = 'Past due — renew to continue.'
  else if (sub?.status === 'active' && sub.cancelAtPeriodEnd) renewLine = `Cancels on ${fmtDate(sub.currentPeriodEnd)} · won't renew`
  else if (sub?.status === 'active') renewLine = `Auto-renews on ${fmtDate(sub.currentPeriodEnd)} · billed ${sub.cycle}`
  else if (latestPaid) renewLine = `Activated ${fmtDate(latestPaid.createdAt)} · billed ${latestPaid.cycle}`
  else renewLine = 'Active'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Billing</h2>
        <p className="text-sm text-fg-muted">Manage your plan and view your payment history.</p>
      </div>

      {banner && (
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm',
            banner.kind === 'success' && 'border-emerald-400/30 bg-emerald-400/10 text-emerald-500',
            banner.kind === 'pending' && 'border-brand/30 bg-brand/10 text-brand',
            banner.kind === 'error' && 'border-amber-400/30 bg-amber-400/10 text-amber-500',
          )}
        >
          {banner.kind === 'success' ? <Check className="size-4 shrink-0" />
            : banner.kind === 'pending' ? <Loader2 className="size-4 shrink-0 animate-spin" />
            : <AlertTriangle className="size-4 shrink-0" />}
          {banner.msg}
        </div>
      )}

      {subscription?.status === 'past_due' && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-500">
          <span className="flex items-center gap-2.5">
            <AlertTriangle className="size-4 shrink-0" />
            Your {subscription.plan} plan is <strong>past due</strong> — renew to keep access. Amount due: {money(subscription.amount, subscription.currency)}.
          </span>
          <span className="text-xs text-amber-500/80">Select your plan below and pay to renew.</span>
        </div>
      )}

      <CheckoutPanel configured={configured} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Current plan */}
        <GlassCard gradient className="p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                <Sparkles className="size-3.5" /> {plan} plan
              </span>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {isFree ? 'Free' : priceMinor > 0 ? money(priceMinor, priceCurrency) : plan}
                {!isFree && priceMinor > 0 && (
                  <span className="text-base font-normal text-fg-muted">/{priceCycle === 'yearly' ? 'yr' : 'mo'}</span>
                )}
              </p>
              <p className="text-sm text-fg-muted">{renewLine}</p>
            </div>
          </div>
          {email && (
            <div className="mt-6 border-t border-line pt-4 text-sm text-fg-muted">
              Billing account: <span className="font-medium text-fg">{email}</span>
            </div>
          )}
        </GlassCard>

        {/* Subscription */}
        <GlassCard className="flex flex-col p-6">
          <div className="flex items-center gap-2"><CalendarClock className="size-4 text-accent" /><h3 className="font-semibold">Subscription</h3></div>
          {sub && sub.status !== 'canceled' ? (
            <>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">Status</span>
                  <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
                    sub.status === 'past_due' ? 'bg-amber-400/15 text-amber-400' : 'bg-emerald-400/15 text-emerald-400')}>
                    {sub.status === 'past_due' ? 'Past due' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between"><span className="text-fg-muted">Plan</span><span className="font-medium">{sub.plan} · {sub.cycle}</span></div>
                <div className="flex items-center justify-between"><span className="text-fg-muted">Recurring</span><span className="font-medium">{money(sub.amount, sub.currency)}/{sub.cycle === 'yearly' ? 'yr' : 'mo'}</span></div>
                <div className="flex items-center justify-between"><span className="text-fg-muted">{sub.cancelAtPeriodEnd ? 'Ends' : 'Renews'}</span><span className="font-medium">{fmtDate(sub.currentPeriodEnd)}</span></div>
              </div>
              <div className="mt-auto pt-4">
                {sub.cancelAtPeriodEnd ? (
                  <button onClick={() => subAction('resume')} disabled={subBusy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface/40 px-3 py-2 text-sm font-medium transition-colors hover:bg-fg/5 disabled:opacity-50">
                    {subBusy ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Resume auto-renew
                  </button>
                ) : (
                  <button onClick={() => subAction('cancel')} disabled={subBusy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface/40 px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg disabled:opacity-50">
                    {subBusy ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />} Turn off auto-renew
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 flex-1 text-sm text-fg-muted">No active subscription. Pick a plan above — you can cancel auto-renew anytime.</p>
              <p className="mt-auto pt-4 text-xs text-fg-muted">Paid by card, PayPal, UPI/Cashfree, crypto or bank transfer.</p>
            </>
          )}
        </GlassCard>
      </div>

      {/* Payment history */}
      <GlassCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="font-semibold">Payment history</h3>
          {orders.length > 0 && (
            <a
              href="/api/orders/export"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/40 px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"
            >
              <Download className="size-3.5" /> Export CSV
            </a>
          )}
        </div>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
            <Receipt className="size-8 text-fg-muted/50" />
            <p className="text-sm text-fg-muted">No payments yet. Your orders will appear here after checkout.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-y border-line text-left text-xs uppercase tracking-wider text-fg-muted">
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Method</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => (
                  <tr key={o.reference} className="transition-colors hover:bg-fg/[0.03]">
                    <td className="px-5 py-3.5 font-mono text-xs">{o.reference}</td>
                    <td className="px-5 py-3.5 font-medium">{o.plan} <span className="text-xs font-normal text-fg-muted">· {o.cycle}</span></td>
                    <td className="px-5 py-3.5 text-fg-muted">{METHOD_LABEL[o.method] ?? o.method}</td>
                    <td className="px-5 py-3.5 text-fg-muted">{fmtDate(o.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{money(o.amount, o.currency)}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
                        o.status === 'paid' && 'bg-emerald-400/15 text-emerald-400',
                        o.status === 'pending' && 'bg-amber-400/15 text-amber-400',
                        o.status === 'failed' && 'bg-red-400/15 text-red-400',
                      )}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={`/api/orders/${encodeURIComponent(o.reference)}/receipt`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Receipt for ${o.reference}`}
                        className="inline-grid size-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"
                      >
                        <Download className="size-4" />
                      </a>
                    </td>
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
