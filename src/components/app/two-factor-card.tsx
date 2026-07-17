'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ShieldCheck, ShieldOff, Loader2, Copy, Check, AlertTriangle } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const inputCls = 'h-11 w-full rounded-xl border border-line bg-surface/60 px-3 text-center font-mono tracking-[0.3em] text-sm outline-none transition-colors focus:border-brand/50'

type Step = 'loading' | 'on' | 'off' | 'setup' | 'backup' | 'disable'

export function TwoFactorCard() {
  const [step, setStep] = useState<Step>('loading')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [code, setCode] = useState('')
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [backup, setBackup] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/auth/2fa/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStep(d?.enabled ? 'on' : 'off'))
      .catch(() => setStep('off'))
  }, [])

  async function startSetup() {
    setError(''); setBusy(true)
    try {
      const res = await fetch('/api/auth/2fa/setup', { method: 'POST' })
      const d = await res.json()
      if (!res.ok) { setError(d.error || 'Could not start setup.'); return }
      setQr(d.qr); setSecret(d.secret); setCode(''); setStep('setup')
    } finally { setBusy(false) }
  }

  async function confirmEnable() {
    setError(''); setBusy(true)
    try {
      const res = await fetch('/api/auth/2fa/enable', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error || 'Invalid code.'); return }
      setBackup(d.backupCodes || []); setCode(''); setStep('backup')
    } finally { setBusy(false) }
  }

  async function confirmDisable() {
    setError(''); setBusy(true)
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error || 'Invalid code.'); return }
      setCode(''); setStep('off')
    } finally { setBusy(false) }
  }

  const title = (
    <div className="flex items-center gap-2">
      {step === 'on' ? <ShieldCheck className="size-4 text-emerald-400" /> : <ShieldCheck className="size-4 text-accent" />}
      <h3 className="font-semibold">Two-factor authentication</h3>
      {step === 'on' && <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">On</span>}
    </div>
  )

  return (
    <GlassCard className="p-6">
      {title}

      {error && <div role="alert" className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">{error}</div>}

      {step === 'loading' && <p className="mt-4 flex items-center gap-2 text-sm text-fg-muted"><Loader2 className="size-4 animate-spin" /> Checking status…</p>}

      {step === 'off' && (
        <>
          <p className="mt-1 text-xs text-fg-muted">Add a second step at sign-in using an authenticator app (Google Authenticator, Authy, 1Password).</p>
          <button onClick={startSetup} disabled={busy} className={cn(buttonVariants({ size: 'sm' }), 'mt-4')}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Enable 2FA
          </button>
        </>
      )}

      {step === 'setup' && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-fg-muted">1. Scan this with your authenticator app:</p>
          {qr && <Image src={qr} alt="2FA QR code" width={180} height={180} unoptimized className="rounded-xl border border-line bg-white p-2" />}
          <p className="text-xs text-fg-muted">Or enter this key manually:</p>
          <button onClick={() => { navigator.clipboard?.writeText(secret); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface/40 px-3 py-1.5 font-mono text-xs">
            {secret} {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5 text-fg-muted" />}
          </button>
          <p className="text-sm text-fg-muted">2. Enter the 6-digit code to confirm:</p>
          <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} placeholder="123456" className={inputCls} />
          <div className="flex gap-2">
            <button onClick={confirmEnable} disabled={busy} className={cn(buttonVariants({ size: 'sm' }))}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null} Confirm & enable
            </button>
            <button onClick={() => { setStep('off'); setError('') }} className={cn(buttonVariants({ variant: 'glass', size: 'sm' }))}>Cancel</button>
          </div>
        </div>
      )}

      {step === 'backup' && (
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-500">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" /> Save these backup codes somewhere safe. Each works once if you lose your device. They will not be shown again.
          </div>
          <div className="grid grid-cols-2 gap-2">
            {backup.map((c) => <span key={c} className="rounded-lg border border-line bg-surface/40 px-3 py-1.5 text-center font-mono text-xs">{c}</span>)}
          </div>
          <button
            onClick={() => { navigator.clipboard?.writeText(backup.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
            className={cn(buttonVariants({ variant: 'glass', size: 'sm' }))}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} Copy all
          </button>
          <div><button onClick={() => setStep('on')} className={cn(buttonVariants({ size: 'sm' }))}>Done</button></div>
        </div>
      )}

      {step === 'on' && (
        <>
          <p className="mt-1 text-xs text-fg-muted">Your account is protected with an authenticator app. You&apos;ll enter a code at each sign-in.</p>
          <button onClick={() => { setStep('disable'); setError(''); setCode('') }} className={cn(buttonVariants({ variant: 'glass', size: 'sm' }), 'mt-4')}>
            <ShieldOff className="size-4" /> Turn off 2FA
          </button>
        </>
      )}

      {step === 'disable' && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-fg-muted">Enter a current code (or a backup code) to turn off 2FA:</p>
          <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" placeholder="123456" className={inputCls} />
          <div className="flex gap-2">
            <button onClick={confirmDisable} disabled={busy} className={cn(buttonVariants({ variant: 'glass', size: 'sm' }))}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <ShieldOff className="size-4" />} Turn off
            </button>
            <button onClick={() => { setStep('on'); setError('') }} className={cn(buttonVariants({ size: 'sm' }))}>Keep on</button>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
