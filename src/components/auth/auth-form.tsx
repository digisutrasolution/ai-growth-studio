'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const isSignup = mode === 'signup'
  const [loading, setLoading] = useState<'form' | 'demo' | null>(null)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [ticket, setTicket] = useState<string | null>(null) // 2FA pending ticket
  const [code, setCode] = useState('')

  function goNext() {
    const next = new URLSearchParams(window.location.search).get('next') || '/dashboard'
    router.push(next)
    router.refresh()
  }

  async function authenticate(body: Record<string, string>, kind: 'form' | 'demo') {
    setError('')
    setLoading(kind)
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(null)
        return
      }
      // Account has 2FA on → switch to the code step instead of redirecting.
      if (data.twoFactor && data.ticket) {
        setTicket(data.ticket)
        setLoading(null)
        return
      }
      goNext()
    } catch {
      setError('Network error. Please try again.')
      setLoading(null)
    }
  }

  async function verify2fa(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading('form')
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket, code }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Invalid code.')
        setLoading(null)
        return
      }
      goNext()
    } catch {
      setError('Network error. Please try again.')
      setLoading(null)
    }
  }

  // Second step: authenticator code.
  if (ticket) {
    return (
      <div>
        <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand"><ShieldCheck className="size-6" /></div>
        <h2 className="mt-4 text-2xl font-semibold">Two-step verification</h2>
        <p className="mt-1 text-sm text-fg-muted">Enter the 6-digit code from your authenticator app. You can also use a backup code.</p>

        {error && <div role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">{error}</div>}

        <form className="mt-6 space-y-4" onSubmit={verify2fa}>
          <input
            autoFocus
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            placeholder="123456"
            className="h-12 w-full rounded-xl border border-line bg-surface/60 px-3 text-center font-mono text-lg tracking-[0.4em] outline-none transition-colors focus:border-brand/50"
          />
          <button type="submit" disabled={loading !== null} className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
            {loading === 'form' ? <Loader2 className="size-4 animate-spin" /> : null} Verify & sign in
          </button>
        </form>

        <button onClick={() => { setTicket(null); setCode(''); setError('') }} className="mt-6 text-sm font-medium text-accent hover:underline">← Back to sign in</button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
      <p className="mt-1 text-sm text-fg-muted">{isSignup ? 'Start your 14-day free trial.' : 'Sign in to your DigiSutra workspace.'}</p>

      {error && (
        <div role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">{error}</div>
      )}

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          authenticate(form, 'form')
        }}
      >
        {isSignup && (
          <Field label="Full name">
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Steven"
              className="auth-input"
              autoComplete="name"
            />
          </Field>
        )}
        <Field label="Work email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@company.com"
            className="auth-input"
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <div className="relative">
            <input
              required
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="auth-input pr-10"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
            <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-fg-muted hover:text-fg">
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        {!isSignup && (
          <div className="-mt-1 text-right">
            <Link href="/forgot" className="text-xs font-medium text-accent hover:underline">Forgot password?</Link>
          </div>
        )}

        <button type="submit" disabled={loading !== null} className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
          {loading === 'form' ? <Loader2 className="size-4 animate-spin" /> : null}
          {isSignup ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-fg-muted">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        disabled={loading !== null}
        onClick={() => authenticate({ email: 'demo@digisutra.solutions', password: 'demo-access' }, 'demo')}
        className={cn(buttonVariants({ variant: 'glass', size: 'lg' }), 'w-full')}
      >
        {loading === 'demo' ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 text-accent" />}
        Continue with demo account
      </button>

      <p className="mt-6 text-center text-sm text-fg-muted">
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <Link href={isSignup ? '/login' : '/signup'} className="font-medium text-accent hover:underline">
          {isSignup ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-fg-muted">{label}</span>
      {children}
    </label>
  )
}
