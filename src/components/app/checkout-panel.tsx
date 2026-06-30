'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Landmark, Wallet, Bitcoin, Banknote, Check, Loader2, X, Copy, AlertTriangle } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { buttonVariants } from '@/components/ui/button'
import { plans } from '@/lib/data'
import { methodsForCurrency, formatPrice, currencySymbol, type Currency, type Cycle, type MethodId, type BankAccount } from '@/lib/payments'
import { cn } from '@/lib/utils'

const ICONS = { Landmark, Wallet, Bitcoin, Banknote }

type Result =
  | { type: 'bank'; reference: string; currency: string; amount: number; accounts: BankAccount[] }
  | { type: 'demo'; message: string }
  | { type: 'contact'; message: string }
  | { type: 'error'; message: string }

export function CheckoutPanel({ configured }: { configured: Partial<Record<MethodId, boolean>> }) {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [cycle, setCycle] = useState<Cycle>('monthly')
  const [plan, setPlan] = useState('Professional')
  const methods = useMemo(() => methodsForCurrency(currency), [currency])
  const [method, setMethod] = useState<MethodId>('paypal')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  // keep the selected method valid for the chosen currency
  const activeMethod = methods.some((m) => m.id === method) ? method : methods[0].id

  async function checkout() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, currency, cycle, method: activeMethod }),
      })
      const data = await res.json()
      if (data.type === 'redirect' && data.url) {
        window.location.href = data.url
        return
      }
      if (data.type === 'bank') setResult(data)
      else if (data.type === 'demo') setResult({ type: 'demo', message: data.message })
      else if (data.type === 'contact') setResult({ type: 'contact', message: data.message })
      else setResult({ type: 'error', message: data.error || 'Checkout failed.' })
    } catch {
      setResult({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard gradient className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">Upgrade / change plan</h3>
        {/* currency + cycle toggles */}
        <div className="flex items-center gap-2">
          <Segmented value={currency} onChange={(v) => setCurrency(v as Currency)} options={[{ v: 'USD', l: '$ USD' }, { v: 'INR', l: '₹ INR' }]} />
          <Segmented value={cycle} onChange={(v) => setCycle(v as Cycle)} options={[{ v: 'monthly', l: 'Monthly' }, { v: 'yearly', l: 'Yearly' }]} />
        </div>
      </div>

      {/* plans */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {plans.map((p) => {
          const active = p.name === plan
          const price = formatPrice(p.name, currency, cycle)
          const custom = p.monthly === 0
          return (
            <button
              key={p.name}
              onClick={() => setPlan(p.name)}
              className={cn('rounded-2xl border p-4 text-left transition-all', active ? 'border-brand/50 glass-strong glow-soft' : 'border-line glass hover:-translate-y-0.5')}
            >
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="mt-1 text-xl font-semibold tracking-tight">{custom ? 'Custom' : price}<span className="text-xs font-normal text-fg-muted">{custom ? '' : '/mo'}</span></p>
              <p className="mt-1 text-[11px] text-fg-muted">{p.blurb}</p>
            </button>
          )
        })}
      </div>

      {/* methods (region-aware) */}
      <p className="mt-5 mb-2 text-sm font-semibold text-fg-muted">Payment method · {currency === 'INR' ? 'India' : 'International'}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {methods.map((m) => {
          const Icon = ICONS[m.icon]
          const active = m.id === activeMethod
          const live = m.id === 'bank_transfer' || configured[m.id]
          return (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={cn('flex flex-col gap-1 rounded-2xl border p-4 text-left transition-all', active ? 'border-brand/50 glass-strong' : 'border-line glass hover:-translate-y-0.5')}
            >
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-accent" />
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', live ? 'bg-emerald-400/15 text-emerald-400' : 'bg-amber-400/15 text-amber-400')}>{live ? 'Available' : 'Setup'}</span>
              </div>
              <p className="text-sm font-medium">{m.label}</p>
              <p className="text-[11px] text-fg-muted">{m.blurb}</p>
            </button>
          )
        })}
      </div>

      <button onClick={checkout} disabled={loading} className={cn(buttonVariants({ size: 'lg' }), 'mt-5 w-full')}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        Continue to payment — {formatPrice(plan, currency, cycle)}{plans.find((p) => p.name === plan)?.monthly === 0 ? '' : `/${cycle === 'monthly' ? 'mo' : 'yr'}`}
      </button>

      {/* result modal */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setResult(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onClick={(e) => e.stopPropagation()} className="glass-strong w-full max-w-md overflow-hidden rounded-3xl border border-line shadow-2xl">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <p className="text-sm font-semibold">
                  {result.type === 'bank' ? 'Bank transfer details' : result.type === 'contact' ? 'Enterprise' : result.type === 'demo' ? 'Almost there' : 'Something went wrong'}
                </p>
                <button onClick={() => setResult(null)} aria-label="Close" className="grid size-8 place-items-center rounded-lg text-fg-muted hover:bg-fg/5 hover:text-fg"><X className="size-4" /></button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
                {result.type === 'bank' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-fg-muted">
                      Transfer <span className="font-semibold text-fg">{currencySymbol[result.currency as Currency]}{result.amount.toLocaleString()}</span> using any account below, and include the reference so we can match your payment and activate your plan.
                    </p>
                    <CopyRow label="Payment reference" value={result.reference} />
                    {result.accounts.map((acc) => (
                      <div key={acc.title} className="rounded-2xl border border-line bg-surface/40 p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{acc.title}</p>
                          <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">{acc.region}</span>
                        </div>
                        {acc.note && (
                          <div className="mb-2 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-[11px] text-amber-400">
                            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" /> {acc.note}
                          </div>
                        )}
                        <div className="space-y-1.5">
                          {acc.fields.map((f) => (
                            <CopyRow key={f.label} label={f.label} value={f.value} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-fg-muted">{result.message}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div className="inline-flex rounded-xl border border-line glass p-0.5 text-xs">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} className={cn('rounded-lg px-2.5 py-1 font-medium transition-colors', value === o.v ? 'bg-brand-gradient text-white' : 'text-fg-muted hover:text-fg')}>{o.l}</button>
      ))}
    </div>
  )
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500) }}
      className="flex w-full items-center justify-between rounded-xl border border-line bg-surface/40 px-3 py-2 text-sm transition-colors hover:bg-fg/5"
    >
      <span className="text-fg-muted">{label}</span>
      <span className="flex items-center gap-2 font-mono text-xs">{value} {done ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5 text-fg-muted" />}</span>
    </button>
  )
}
