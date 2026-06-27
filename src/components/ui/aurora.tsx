import { cn } from '@/lib/utils'

/** Decorative aurora orbs + dotted grid. Purely visual; aria-hidden. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)} aria-hidden="true">
      <div className="absolute inset-0 grid-backdrop opacity-70" />
      <div className="absolute -top-32 -left-24 size-[34rem] rounded-full bg-brand/30 blur-[120px] animate-aurora" />
      <div className="absolute top-1/3 -right-32 size-[30rem] rounded-full bg-brand-2/25 blur-[120px] animate-aurora [animation-delay:-6s]" />
      <div className="absolute -bottom-40 left-1/3 size-[28rem] rounded-full bg-accent/20 blur-[120px] animate-aurora [animation-delay:-12s]" />
    </div>
  )
}
