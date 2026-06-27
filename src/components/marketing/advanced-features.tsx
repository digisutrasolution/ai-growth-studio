import { Check } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { GlassCard } from '@/components/ui/glass-card'
import { Reveal } from '@/components/ui/reveal'
import { features } from '@/lib/data'

export function AdvancedFeatures() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Advanced Features"
        title={<>Built for teams that <span className="text-gradient">automate everything</span></>}
        subtitle="The engine behind the agents — orchestration, intelligence, reporting, and the integrations to tie it together."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {features.map((f, i) => (
          <Reveal key={f.name} delay={(i % 2) * 0.08}>
            <GlassCard hover className="flex h-full gap-5 p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white glow-brand">
                <f.icon className="size-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{f.name}</h3>
                <p className="mt-1 text-sm text-fg-muted">{f.description}</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-emerald-400" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
