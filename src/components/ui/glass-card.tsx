import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
  hover?: boolean
}

export function GlassCard({ gradient = false, hover = false, className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl',
        gradient && 'gradient-border',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:glow-soft',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
