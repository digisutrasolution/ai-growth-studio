'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, PlayCircle, Megaphone, BarChart3, UserPlus, Bot, Workflow } from 'lucide-react'
import { Aurora } from '@/components/ui/aurora'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { DashboardPreview } from './dashboard-preview'
import { heroStats } from '@/lib/data'
import { cn } from '@/lib/utils'

const featurePills = [
  { label: 'AI Marketing Agents', icon: Megaphone },
  { label: 'Campaign Automation', icon: Workflow },
  { label: 'Smart Analytics', icon: BarChart3 },
  { label: 'Lead Generation', icon: UserPlus },
  { label: 'Customer Automation', icon: Bot },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <Aurora />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-start gap-6">
          <motion.div variants={item}>
            <Badge dot>New · Nova autonomous agents are live</Badge>
          </motion.div>

          <motion.h1 variants={item} className="text-balance text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Grow your business with <span className="text-gradient">AI-powered</span> digital marketing automation
          </motion.h1>

          <motion.p variants={item} className="max-w-xl text-pretty text-lg leading-relaxed text-fg-muted">
            AI agents that manage campaigns, analyze data, generate content, optimize ads, and automate customer engagement — so your team can focus on growth, not grunt work.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-2">
            {featurePills.map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1.5 rounded-full border border-line glass px-3 py-1.5 text-xs font-medium text-fg-muted">
                <f.icon className="size-3.5 text-accent" /> {f.label}
              </span>
            ))}
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/dashboard" className={cn(buttonVariants({ size: 'lg' }))}>
              Start free trial <ArrowRight className="size-4" />
            </Link>
            <Link href="#platform" className={cn(buttonVariants({ variant: 'glass', size: 'lg' }))}>
              <PlayCircle className="size-4" /> Book AI demo
            </Link>
          </motion.div>

          <motion.dl variants={item} className="mt-6 grid w-full max-w-lg grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label}>
                <dt className="text-2xl font-semibold tracking-tight">{s.value}</dt>
                <dd className="text-xs text-fg-muted">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative [perspective:1200px]"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  )
}
