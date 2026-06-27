'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { Reveal } from '@/components/ui/reveal'
import { buttonVariants } from '@/components/ui/button'
import { plans } from '@/lib/data'
import { cn } from '@/lib/utils'

export function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Simple pricing that <span className="text-gradient">scales with you</span></>}
          subtitle="Start free for 14 days. No credit card required. Cancel anytime."
        />

        {/* Toggle */}
        <Reveal className="mt-8 flex items-center justify-center gap-3">
          <span className={cn('text-sm', !yearly ? 'text-fg' : 'text-fg-muted')}>Monthly</span>
          <button
            role="switch"
            aria-checked={yearly}
            aria-label="Toggle yearly billing"
            onClick={() => setYearly((y) => !y)}
            className="relative h-7 w-12 rounded-full border border-line glass transition-colors"
          >
            <motion.span
              className="absolute top-1 size-5 rounded-full bg-brand-gradient"
              animate={{ left: yearly ? 26 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={cn('text-sm', yearly ? 'text-fg' : 'text-fg-muted')}>
            Yearly <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-medium text-emerald-400">Save 20%</span>
          </span>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const price = yearly ? plan.yearly : plan.monthly
            const isEnterprise = plan.monthly === 0
            return (
              <Reveal key={plan.name} delay={i * 0.08}>
                <div
                  className={cn(
                    'relative flex h-full flex-col rounded-3xl p-7',
                    plan.featured ? 'gradient-border glass-strong glow-soft' : 'glass border border-line',
                  )}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand-gradient px-3 py-1 text-xs font-medium text-white glow-brand">
                      <Sparkles className="size-3.5" /> Most popular
                    </span>
                  )}

                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-fg-muted">{plan.blurb}</p>

                  <div className="mt-5 flex items-end gap-1">
                    {isEnterprise ? (
                      <span className="text-4xl font-bold tracking-tight">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold tracking-tight">${price}</span>
                        <span className="mb-1.5 text-sm text-fg-muted">/mo</span>
                      </>
                    )}
                  </div>
                  {!isEnterprise && yearly && <p className="text-xs text-emerald-400">Billed annually</p>}
                  {!isEnterprise && !yearly && <p className="text-xs text-fg-muted">Billed monthly</p>}

                  <Link
                    href="/dashboard"
                    className={cn(buttonVariants({ variant: plan.featured ? 'primary' : 'glass' }), 'mt-6 w-full')}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="mt-6 space-y-3 border-t border-line pt-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                        <span className="text-fg">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
