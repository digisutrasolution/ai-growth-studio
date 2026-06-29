import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'
import { Aurora } from '@/components/ui/aurora'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="glass-strong relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12">
          <Aurora />
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold sm:text-4xl md:text-[2.75rem]">
            Put your marketing on <span className="text-gradient">autopilot</span> today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-fg-muted">
            Join 38,000+ businesses scaling with AI Growth Studio. Launch your first autonomous agent in minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className={cn(buttonVariants({ size: 'lg' }))}>
              Start free trial <ArrowRight className="size-4" />
            </Link>
            <Link href="#platform" className={cn(buttonVariants({ variant: 'glass', size: 'lg' }))}>Book AI demo</Link>
          </div>
          <p className="mt-4 text-xs text-fg-muted">14-day free trial · No credit card required</p>
        </div>
      </Reveal>
    </section>
  )
}
