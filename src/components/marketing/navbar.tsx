'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Agents', href: '#agents' },
  { label: 'Services', href: '#services' },
  { label: 'Platform', href: '#platform' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn('fixed inset-x-0 top-0 z-40 transition-all duration-300', scrolled && 'glass-strong border-b border-line')}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/dashboard" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:inline-flex')}>
            Sign in
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')}>
            Start free trial
          </Link>
          <button className="grid size-10 place-items-center rounded-xl border border-line glass md:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong border-t border-line px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-fg-muted hover:bg-fg/5 hover:text-fg">
                {l.label}
              </Link>
            ))}
            <Link href="/dashboard" className={cn(buttonVariants({ size: 'sm' }), 'mt-2 w-full')}>Start free trial</Link>
          </div>
        </div>
      )}
    </header>
  )
}
