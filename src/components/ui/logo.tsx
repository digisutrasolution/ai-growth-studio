import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn('group inline-flex items-center gap-2.5', className)}>
      <span className="relative grid size-9 place-items-center rounded-xl bg-brand-gradient text-white glow-brand">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5" />
          <path d="M12 7v10M7.5 9.5l4.5 2.5 4.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        AI Growth <span className="text-gradient">Studio</span>
      </span>
    </Link>
  )
}
