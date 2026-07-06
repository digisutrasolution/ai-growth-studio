'use client'

import { useState } from 'react'
import { KeyRound, Loader2, Eye, EyeOff, Check } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const inputCls = 'h-11 w-full rounded-xl border border-line bg-surface/60 px-3 text-sm outline-none transition-colors focus:border-brand/50'

export function ChangePasswordCard() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setDone(false)
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (next !== confirm) { setError('New passwords do not match.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setDone(true)
      setCurrent(''); setNext(''); setConfirm('')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2">
        <KeyRound className="size-4 text-accent" />
        <h3 className="font-semibold">Change password</h3>
      </div>
      <p className="mt-1 text-xs text-fg-muted">Update the password you use to sign in.</p>

      {error && <div role="alert" className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">{error}</div>}
      {done && <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-500"><Check className="size-4" /> Password updated.</div>}

      <form className="mt-4 space-y-3" onSubmit={submit}>
        <Field label="Current password">
          <div className="relative">
            <input required type={show ? 'text' : 'password'} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" className={cn(inputCls, "pr-10")} autoComplete="current-password" />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide passwords' : 'Show passwords'} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-fg-muted hover:text-fg">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>
        <Field label="New password">
          <input required type={show ? 'text' : 'password'} value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" className={inputCls} autoComplete="new-password" />
        </Field>
        <Field label="Confirm new password">
          <input required type={show ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password" className={inputCls} autoComplete="new-password" />
        </Field>
        <div className="flex justify-end pt-1">
          <button type="submit" disabled={loading} className={cn(buttonVariants({ size: 'sm' }))}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null} Update password
          </button>
        </div>
      </form>
    </GlassCard>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
