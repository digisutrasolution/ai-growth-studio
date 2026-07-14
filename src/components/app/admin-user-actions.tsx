'use client'

import { useState } from 'react'
import { Mail, KeyRound, Loader2, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Action = 'send_reset_link' | 'set_temp_password'

export function AdminUserActions({ email }: { email: string }) {
  const [busy, setBusy] = useState<Action | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [temp, setTemp] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function run(action: Action) {
    const confirmMsg = action === 'send_reset_link'
      ? `Email a password-reset link to ${email}?`
      : `Set a temporary password for ${email}? This immediately replaces their current password.`
    if (!window.confirm(confirmMsg)) return
    setBusy(action); setMsg(null); setTemp(null); setCopied(false)
    try {
      const res = await fetch('/api/admin/users/action', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, action }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Action failed.'); return }
      if (action === 'send_reset_link') setMsg(data.emailed ? 'Reset link sent.' : 'Email not configured — use Temp password instead.')
      else setTemp(data.tempPassword)
    } catch {
      setMsg('Network error.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center justify-end gap-1">
        <button onClick={() => run('send_reset_link')} disabled={busy !== null} title="Email a reset link"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/10 disabled:opacity-50">
          {busy === 'send_reset_link' ? <Loader2 className="size-3.5 animate-spin" /> : <Mail className="size-3.5" />}
          <span className="hidden lg:inline">Reset link</span>
        </button>
        <button onClick={() => run('set_temp_password')} disabled={busy !== null} title="Set a temporary password"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg disabled:opacity-50">
          {busy === 'set_temp_password' ? <Loader2 className="size-3.5 animate-spin" /> : <KeyRound className="size-3.5" />}
          <span className="hidden lg:inline">Temp password</span>
        </button>
      </div>
      {msg && <span className="text-[11px] text-fg-muted">{msg}</span>}
      {temp && (
        <button
          onClick={() => { navigator.clipboard?.writeText(temp); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
          className={cn('flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 font-mono text-[11px] text-emerald-500')}
          title="Copy — share securely with the customer"
        >
          {temp} {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        </button>
      )}
    </div>
  )
}
