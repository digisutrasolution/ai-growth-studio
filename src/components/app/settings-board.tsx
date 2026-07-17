'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Shield } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { buttonVariants } from '@/components/ui/button'
import { ChangePasswordCard } from '@/components/app/change-password-card'
import { TwoFactorCard } from '@/components/app/two-factor-card'
import { teamMembers, roleStyles, notificationPrefs } from '@/lib/data'
import { cn } from '@/lib/utils'

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onToggle} className={cn('relative h-6 w-11 shrink-0 rounded-full border border-line transition-colors', on ? 'bg-brand-gradient' : 'bg-fg/10')}>
      <motion.span className="absolute top-1 size-4 rounded-full bg-white shadow" animate={{ left: on ? 25 : 3 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </button>
  )
}

export function SettingsBoard() {
  const [prefs, setPrefs] = useState(notificationPrefs.map((p) => p.on))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-fg-muted">Team, roles, permissions and notifications.</p>
      </div>

      {/* Profile */}
      <GlassCard className="p-6">
        <h3 className="font-semibold">Organization profile</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Organization name', value: 'AI Growth Studio' },
            { label: 'Owner', value: 'Steven' },
            { label: 'Billing email', value: 'billing@digisutra.solutions' },
            { label: 'Timezone', value: 'GMT+05:30 · IST' },
          ].map((f) => (
            <label key={f.label} className="block">
              <span className="text-xs font-medium text-fg-muted">{f.label}</span>
              <input defaultValue={f.value} className="mt-1 h-11 w-full rounded-xl border border-line bg-surface/60 px-3 text-sm outline-none transition-colors focus:border-brand/50" />
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button className={cn(buttonVariants({ size: 'sm' }))}>Save changes</button>
        </div>
      </GlassCard>

      {/* Team members */}
      <GlassCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h3 className="font-semibold">Team members</h3>
            <p className="text-xs text-fg-muted">Role-based access · {teamMembers.length} members</p>
          </div>
          <button className={cn(buttonVariants({ variant: 'glass', size: 'sm' }))}><UserPlus className="size-4" /> Invite</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-y border-line text-left text-xs uppercase tracking-wider text-fg-muted">
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {teamMembers.map((m) => (
                <tr key={m.email} className="transition-colors hover:bg-fg/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">{m.initials}</span>
                      <div className="min-w-0">
                        <p className="truncate font-medium leading-tight">{m.name}</p>
                        <p className="truncate text-xs text-fg-muted">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', roleStyles[m.role])}>{m.role}</span></td>
                  <td className="px-5 py-3.5"><span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', m.status === 'Active' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-amber-400/15 text-amber-400')}>{m.status}</span></td>
                  <td className="px-5 py-3.5 text-right"><button className="text-xs font-medium text-accent hover:underline">Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Notifications */}
        <GlassCard className="p-6">
          <h3 className="font-semibold">Notifications</h3>
          <ul className="mt-4 space-y-3">
            {notificationPrefs.map((p, i) => (
              <li key={p.label} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-fg-muted">{p.detail}</p>
                </div>
                <Toggle on={prefs[i]} label={p.label} onToggle={() => setPrefs((s) => s.map((v, j) => (j === i ? !v : v)))} />
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Security */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-accent" />
            <h3 className="font-semibold">Security</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { label: 'Two-factor authentication', value: 'Enabled', on: true },
              { label: 'Single sign-on (SSO)', value: 'Enterprise only', on: false },
              { label: 'Session timeout', value: '30 minutes', on: true },
              { label: 'Audit logs', value: 'Retained 90 days', on: true },
            ].map((s) => (
              <li key={s.label} className="flex items-center justify-between rounded-xl border border-line bg-surface/40 px-4 py-3">
                <span>{s.label}</span>
                <span className={cn('text-xs font-medium', s.on ? 'text-emerald-400' : 'text-fg-muted')}>{s.value}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Change password (real) */}
        <ChangePasswordCard />

        {/* Two-factor authentication (real) */}
        <TwoFactorCard />
      </div>
    </div>
  )
}
