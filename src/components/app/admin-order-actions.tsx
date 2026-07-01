'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, X, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type Action = 'mark_paid' | 'mark_failed' | 'refund'

const LABEL: Record<Action, string> = {
  mark_paid: 'Mark paid', mark_failed: 'Mark failed', refund: 'Refund',
}

export function AdminOrderActions({ reference, status }: { reference: string; status: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState<Action | null>(null)
  const [err, setErr] = useState(false)

  async function run(action: Action) {
    const verb = LABEL[action].toLowerCase()
    if (!window.confirm(`${LABEL[action]} order ${reference}?${action === 'refund' ? '\nThis revokes the plan if it is still active.' : ''}`)) return
    setBusy(action)
    setErr(false)
    try {
      const res = await fetch('/api/admin/orders/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, action }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) router.refresh()
      else { setErr(true); console.error(`Failed to ${verb}:`, data) }
    } catch {
      setErr(true)
    } finally {
      setBusy(null)
    }
  }

  // Available actions depend on current status.
  const actions: Action[] =
    status === 'paid' ? ['refund']
    : status === 'pending' ? ['mark_paid', 'mark_failed']
    : ['mark_paid'] // failed / refunded → allow re-activating

  const icon: Record<Action, typeof Check> = { mark_paid: Check, mark_failed: X, refund: RotateCcw }
  const tone: Record<Action, string> = {
    mark_paid: 'text-emerald-400 hover:bg-emerald-400/10',
    mark_failed: 'text-amber-400 hover:bg-amber-400/10',
    refund: 'text-rose-400 hover:bg-rose-400/10',
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {actions.map((a) => {
        const Icon = busy === a ? Loader2 : icon[a]
        return (
          <button
            key={a}
            onClick={() => run(a)}
            disabled={busy !== null}
            title={LABEL[a]}
            className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50', tone[a])}
          >
            <Icon className={cn('size-3.5', busy === a && 'animate-spin')} />
            <span className="hidden lg:inline">{LABEL[a]}</span>
          </button>
        )
      })}
      {err && <span className="text-[11px] text-rose-400">failed</span>}
    </div>
  )
}
