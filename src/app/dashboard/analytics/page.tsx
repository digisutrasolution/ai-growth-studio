import { BarChart3 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { RevenueChart, ChannelChart } from '@/components/app/charts'

export const metadata = { title: 'Analytics' }

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-white glow-brand">
          <BarChart3 className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold">Analytics</h2>
          <p className="text-sm text-fg-muted">Unified attribution across every channel.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Revenue vs. spend</h3>
          <p className="mb-4 text-xs text-fg-muted">Last 12 months</p>
          <RevenueChart />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-semibold">Revenue by channel</h3>
          <p className="mb-4 text-xs text-fg-muted">Attributed share</p>
          <ChannelChart />
        </GlassCard>
      </div>
    </div>
  )
}
