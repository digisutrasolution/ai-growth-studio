'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { appNav, adminNav } from '@/lib/data'
import { cn } from '@/lib/utils'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  function NavLink({ label, href, icon: Icon }: { label: string; href: string; icon: typeof appNav[number]['icon'] }) {
    const active = pathname === href
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
          active ? 'bg-brand/10 text-fg' : 'text-fg-muted hover:bg-fg/5 hover:text-fg',
        )}
      >
        <Icon className={cn('size-[18px]', active ? 'text-accent' : 'text-fg-muted group-hover:text-fg')} />
        <span className="flex-1">{label}</span>
        {active && <ChevronRight className="size-4 text-accent" />}
      </Link>
    )
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-surface/40">
      <div className="flex h-16 items-center px-5">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {appNav.map((n) => <NavLink key={n.href} {...n} />)}

        <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Admin</p>
        {adminNav.map((n) => <NavLink key={n.href} {...n} />)}
      </nav>

      {/* Upgrade card */}
      <div className="m-3 rounded-2xl gradient-border glass p-4">
        <p className="text-sm font-semibold">Professional trial</p>
        <p className="mt-1 text-xs text-fg-muted">9 days left · 64% of actions used</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-fg/10">
          <div className="h-full w-[64%] rounded-full bg-brand-gradient" />
        </div>
        <Link href="/dashboard/billing" className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-brand-gradient py-2 text-xs font-medium text-white">
          Upgrade plan
        </Link>
      </div>
    </aside>
  )
}
