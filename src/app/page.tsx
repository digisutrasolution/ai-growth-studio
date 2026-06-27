import { Navbar } from '@/components/marketing/navbar'
import { Hero } from '@/components/marketing/hero'
import { AgentMarketplace } from '@/components/marketing/agent-marketplace'
import { Services } from '@/components/marketing/services'
import { Platform } from '@/components/marketing/platform'
import { AdvancedFeatures } from '@/components/marketing/advanced-features'
import { Pricing } from '@/components/marketing/pricing'
import { CTA } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AgentMarketplace />
        <Services />
        <Platform />
        <AdvancedFeatures />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
