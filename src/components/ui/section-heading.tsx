import { cn } from '@/lib/utils'
import { Reveal } from './reveal'
import { Badge } from './badge'

interface SectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', className }: SectionHeadingProps) {
  return (
    <Reveal className={cn('flex flex-col gap-4', align === 'center' ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow && <Badge dot>{eyebrow}</Badge>}
      <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-[2.75rem]">{title}</h2>
      {subtitle && <p className={cn('max-w-xl text-pretty text-base leading-relaxed text-fg-muted', align === 'center' && 'mx-auto')}>{subtitle}</p>}
    </Reveal>
  )
}
