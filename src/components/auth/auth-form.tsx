'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const isSignup = mode === 'signup'
  const [loading, setLoading] = useState<'form' | 'demo' | null>(null)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

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
      const next = new URLSearchParams(window.location.search).get('next') || '/dashboard'
      router.push(next)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(null)
    }
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
