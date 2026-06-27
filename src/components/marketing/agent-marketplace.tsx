import { Check, Zap } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { GlassCard } from '@/components/ui/glass-card'
import { Reveal } from '@/components/ui/reveal'
import { agents } from '@/lib/data'

export function AgentMarketplace() {
  return (
    <section id="agents" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="AI Agent Marketplace"
        title={<>A workforce of <span className="text-gradient">specialized AI agents</span></>}
        subtitle="Activate purpose-built agents that work 24/7 across your entire marketing stack. Each one is an expert in its lane."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, i) => (
          <Reveal key={agent.id} delay={i * 0.06}>
            <GlassCard gradient hover className="flex h-full flex-col p-6">
              <div className="flex items-start justify-between">
                <span
                  className="grid size-12 place-items-center rounded-2xl border border-line"
                  style={{ background: `${agent.glow}1a`, boxShadow: `0 8px 30px -12px ${agent.glow}` }}
                >
                  <agent.icon className={`size-6 ${agent.accent}`} />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> Active
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold">{agent.name}</h3>
              <p className="text-sm font-medium text-accent">{agent.tagline}</p>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{agent.description}</p>

              <ul className="mt-4 space-y-2">
                {agent.capabilities.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-fg">
                    <Check className="size-4 shrink-0 text-emerald-400" /> {c}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-6 border-t border-line pt-4">
                {agent.stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-base font-semibold">{s.value}</p>
                    <p className="text-[11px] text-fg-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line glass py-2.5 text-sm font-medium transition-colors hover:bg-fg/5">
                <Zap className="size-4 text-accent" /> Activate agent
              </button>
            </GlassCard>
          </Reveal>
        ))}

        {/* CTA tile */}
        <Reveal delay={agents.length * 0.06}>
          <GlassCard className="flex h-full min-h-56 flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white glow-brand">
              <Zap className="size-6" />
            </span>
            <h3 className="text-lg font-semibold">Build a custom agent</h3>
            <p className="text-sm text-fg-muted">Train an agent on your data, tools, and brand voice on the Enterprise plan.</p>
            <a href="#pricing" className="text-sm font-medium text-accent hover:underline">Explore Enterprise →</a>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}
