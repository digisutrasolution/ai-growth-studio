'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, MailCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ForgotForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setSent(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div>
        <div className="grid size-12 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-400"><MailCheck className="size-6" /></div>
        <h2 className="mt-4 text-2xl font-semibold">Check your email</h2>
        <p className="mt-1 text-sm text-fg-muted">If an account exists for <span className="font-medium text-fg">{email}</span>, we have sent a link to reset your password. It expires in 30 minutes.</p>
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">← Back to sign in</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Reset your password</h2>
      <p className="mt-1 text-sm text-fg-muted">Enter your account email and we will send you a reset link.</p>

      {error && <div role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">{error}</div>}

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-fg-muted">Work email</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="auth-input" autoComplete="email" />
        </label>
        <button type="submit" disabled={loading} className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null} Send reset link
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        Remembered it? <Link href="/login" className="font-medium text-accent hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
