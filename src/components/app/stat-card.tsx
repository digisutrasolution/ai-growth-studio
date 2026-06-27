import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

export function StatCard({ label, value, delta, trend }: { label: string; value: string; delta: string; trend: 'up' | 'down' }) {
  const up = trend === 'up'
  return (
    <GlassCard className="p-5">
      <p className="text-sm text-fg-muted">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        <span className={cn('inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium', up ? 'bg-emerald-400/15 text-emerald-400' : 'bg-rose-400/15 text-rose-400')}>
          {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {delta}
        </span>
      </div>
    </GlassCard>
  )
}
