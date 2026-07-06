'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ResetForm() {
  const router = useRouter()
  const token = useSearchParams().get('token')
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (pw.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (pw !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password: pw }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setDone(true)
      setTimeout(() => { router.push('/login'); router.refresh() }, 1800)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div>
        <div className="grid size-12 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-400"><CheckCircle2 className="size-6" /></div>
        <h2 className="mt-4 text-2xl font-semibold">Password updated</h2>
        <p className="mt-1 text-sm text-fg-muted">You can now sign in with your new password. Redirecting…</p>
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">Go to sign in →</Link>
      </div>
    )
  }

  if (!token) {
    return (
      <div>
        <div className="grid size-12 place-items-center rounded-2xl bg-amber-400/10 text-amber-400"><AlertTriangle className="size-6" /></div>
        <h2 className="mt-4 text-2xl font-semibold">Invalid reset link</h2>
        <p className="mt-1 text-sm text-fg-muted">This link is missing or malformed. Please request a new password-reset email.</p>
        <Link href="/forgot" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">Request a new link →</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Set a new password</h2>
      <p className="mt-1 text-sm text-fg-muted">Choose a strong password for your account.</p>

      {error && <div role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">{error}</div>}

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-fg-muted">New password</span>
          <div className="relative">
            <input required type={showPw ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters" className="auth-input pr-10" autoComplete="new-password" />
            <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-fg-muted hover:text-fg">
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-fg-muted">Confirm password</span>
          <input required type={showPw ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" className="auth-input" autoComplete="new-password" />
        </label>
        <button type="submit" disabled={loading} className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null} Update password
        </button>
      </form>
    </div>
  )
}
