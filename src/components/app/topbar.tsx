'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, Search, X, LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Sidebar } from './sidebar'
import { appNav, adminNav } from '@/lib/data'

function initialsOf(name: string) {
  return name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase() || 'AG'
}

export function Topbar({ user }: { user: { name: string; email: string } }) {
  const [drawer, setDrawer] = useState(false)
  const [menu, setMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const title = [...appNav, ...adminNav].find((n) => n.href === pathname)?.label ?? 'Dashboard'

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line glass-strong px-4 sm:px-6">
      <button className="grid size-10 place-items-center rounded-xl border border-line lg:hidden" aria-label="Open menu" onClick={() => setDrawer(true)}>
        <Menu className="size-5" />
      </button>

      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="relative ml-auto hidden md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
        <input
          placeholder="Search campaigns, leads…"
          className="h-10 w-64 rounded-xl border border-line bg-surface/60 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-fg-muted focus:border-brand/50"
        />
      </div>

      <button className="relative grid size-10 place-items-center rounded-xl border border-line glass text-fg-muted transition-colors hover:text-fg ml-auto md:ml-0" aria-label="Notifications">
        <Bell className="size-[18px]" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-accent ring-2 ring-bg" />
      </button>

      <ThemeToggle />

      {/* Account menu */}
      <div className="relative">
        <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-xl border border-line glass py-1 pl-1 pr-2.5" aria-haspopup="menu" aria-expanded={menu} aria-label="Account menu">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-gradient text-xs font-semibold text-white">{initialsOf(user.name)}</span>
          <span className="hidden max-w-[8rem] text-left sm:block">
            <span className="block truncate text-sm font-medium leading-tight">{user.name}</span>
            <span className="block truncate text-[11px] leading-tight text-fg-muted">{user.email || 'Signed in'}</span>
          </span>
        </button>

        <AnimatePresence>
          {menu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} aria-hidden="true" />
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                role="menu"
                className="glass-strong absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-line p-1.5 shadow-2xl"
              >
                <div className="border-b border-line px-3 py-2.5">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-fg-muted">{user.email || 'demo session'}</p>
                </div>
                <Link href="/dashboard/settings" onClick={() => setMenu(false)} role="menuitem" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg">
                  <User className="size-4" /> Profile
                </Link>
                <Link href="/dashboard/settings" onClick={() => setMenu(false)} role="menuitem" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg">
                  <Settings className="size-4" /> Settings
                </Link>
                <button onClick={logout} role="menuitem" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-400 transition-colors hover:bg-rose-400/10">
                  <LogOut className="size-4" /> Sign out
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <div className="relative h-full bg-surface">
                <button onClick={() => setDrawer(false)} className="absolute right-3 top-4 z-10 grid size-9 place-items-center rounded-xl border border-line" aria-label="Close menu"><X className="size-5" /></button>
                <Sidebar onNavigate={() => setDrawer(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
