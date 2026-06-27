import type { LucideIcon } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

interface Props {
  icon: LucideIcon
  title: string
  description: string
  stats?: { label: string; value: string }[]
  bullets?: string[]
}

export function PagePlaceholder({ icon: Icon, title, description, stats = [], bullets = [] }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-white glow-brand">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-fg-muted">{description}</p>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <GlassCard key={s.label} className="p-5">
              <p className="text-sm text-fg-muted">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{s.value}</p>
            </GlassCard>
          ))}
        </div>
      )}

      <GlassCard gradient className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <span className="grid size-12 place-items-center rounded-2xl border border-line glass">
          <Icon className="size-6 text-accent" />
        </span>
        <h3 className="text-lg font-semibold">{title} workspace</h3>
        <p className="max-w-md text-sm text-fg-muted">
          This screen is part of the Phase 1 app shell. Full interactivity arrives with the backend phase.
        </p>
        {bullets.length > 0 && (
          <ul className="mt-2 flex flex-wrap justify-center gap-2">
            {bullets.map((b) => (
              <li key={b} className="rounded-full border border-line glass px-3 py-1 text-xs text-fg-muted">{b}</li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}
