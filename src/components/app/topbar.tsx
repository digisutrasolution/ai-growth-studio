'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, Search, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Sidebar } from './sidebar'
import { appNav, adminNav } from '@/lib/data'

export function Topbar() {
  const [drawer, setDrawer] = useState(false)
  const pathname = usePathname()
  const title = [...appNav, ...adminNav].find((n) => n.href === pathname)?.label ?? 'Dashboard'

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

      <button className="relative grid size-10 place-items-center rounded-xl border border-line glass text-fg-muted transition-colors hover:text-fg" aria-label="Notifications">
        <Bell className="size-[18px]" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-accent ring-2 ring-bg" />
      </button>

      <ThemeToggle />

      <button className="flex items-center gap-2 rounded-xl border border-line glass py-1 pl-1 pr-3" aria-label="Account">
        <span className="grid size-8 place-items-center rounded-lg bg-brand-gradient text-xs font-semibold text-white">ST</span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium leading-tight">Steven</span>
          <span className="block text-[11px] leading-tight text-fg-muted">Owner</span>
        </span>
      </button>

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
