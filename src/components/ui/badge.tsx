import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function Badge({ children, className, dot = false }: { children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line glass px-3 py-1 text-xs font-medium text-fg-muted',
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px] shadow-accent" />}
      {children}
    </span>
  )
}
