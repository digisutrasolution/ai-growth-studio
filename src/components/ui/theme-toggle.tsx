'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} mode` : 'Toggle theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-xl border border-line glass text-fg-muted transition-colors hover:text-fg',
        className,
      )}
    >
      {mounted ? (
        isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />
      ) : (
        <span className="size-[18px]" />
      )}
    </button>
  )
}
