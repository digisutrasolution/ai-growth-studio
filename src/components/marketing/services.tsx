import { SectionHeading } from '@/components/ui/section-heading'
import { Reveal } from '@/components/ui/reveal'
import { services, integrations } from '@/lib/data'

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Digital Marketing Services"
          title={<>Everything you need to grow, <span className="text-gradient">in one platform</span></>}
          subtitle="From paid acquisition to retention — fully managed by AI, measurable end to end."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={(i % 4) * 0.06}>
              <div className="group h-full rounded-2xl border border-line bg-surface/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:glow-soft">
                <span className="grid size-11 place-items-center rounded-xl border border-line glass transition-colors group-hover:bg-brand/10">
                  <s.icon className="size-5 text-accent" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{s.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Integration marquee */}
      <div className="relative mt-20 overflow-hidden border-y border-line py-6">
        <p className="mb-5 text-center text-xs font-medium uppercase tracking-widest text-fg-muted">Connects with your entire stack</p>
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
            {[...integrations, ...integrations].map((name, i) => (
              <span key={i} className="whitespace-nowrap text-lg font-semibold text-fg-muted/70">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
