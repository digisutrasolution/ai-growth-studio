'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Check, Loader2, AlertTriangle, Receipt } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CheckoutPanel } from '@/components/app/checkout-panel'
import { cn } from '@/lib/utils'
import { currencySymbol, type Currency, type MethodId } from '@/lib/payments'
import type { OrderRow } from '@/lib/billing-store'

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
  configured, plan, orders, email, returnStatus, returnRef,
}: {
  configured: Partial<Record<MethodId, boolean>>
  plan: string
  orders: OrderRow[]
  email: string | null
  returnStatus: string | null
  returnRef: string | null
}) {
  const router = useRouter()
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
                {isFree ? 'Free' : latestPaid ? money(latestPaid.amount, latestPaid.currency) : plan}
                {!isFree && latestPaid && (
                  <span className="text-base font-normal text-fg-muted">/{latestPaid.cycle === 'yearly' ? 'yr' : 'mo'}</span>
                )}
              </p>
              <p className="text-sm text-fg-muted">
                {isFree
                  ? 'Choose a plan above to unlock more capacity.'
                  : latestPaid
                    ? `Activated ${fmtDate(latestPaid.createdAt)} · billed ${latestPaid.cycle}`
                    : 'Active'}
              </p>
            </div>
          </div>
          {email && (
            <div className="mt-6 border-t border-line pt-4 text-sm text-fg-muted">
              Billing account: <span className="font-medium text-fg">{email}</span>
            </div>
          )}
        </GlassCard>

        {/* Account status */}
        <GlassCard className="flex flex-col p-6">
          <h3 className="font-semibold">Account</h3>
          <div className="mt-4 space-y-2 text-sm text-fg-muted">
            <p className="flex items-center gap-2"><Check className="size-4 text-emerald-400" /> Current plan: <span className="font-medium text-fg">{plan}</span></p>
            <p className="flex items-center gap-2"><Check className="size-4 text-emerald-400" /> {orders.length} payment{orders.length === 1 ? '' : 's'} on record</p>
            <p className="flex items-center gap-2"><Check className="size-4 text-emerald-400" /> Receipts include your reference</p>
          </div>
          <p className="mt-auto pt-4 text-xs text-fg-muted">
            Paid by card, PayPal, UPI/Cashfree, crypto or bank transfer. Bank transfers activate once received.
          </p>
        </GlassCard>
      </div>

      {/* Payment history */}
      <GlassCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="font-semibold">Payment history</h3>
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
