import { Megaphone } from 'lucide-react'
import { PagePlaceholder } from '@/components/app/page-placeholder'

export const metadata = { title: 'Campaigns' }

export default function Page() {
  return (
    <PagePlaceholder
      icon={Megaphone}
      title="Campaigns"
      description="Create, budget, target and A/B test every campaign."
      stats={[
        { label: 'Active', value: '32' },
        { label: 'Total spend', value: '$284.9k' },
        { label: 'Avg. ROAS', value: '4.2x' },
        { label: 'Conversions', value: '6.0k' },
      ]}
      bullets={['Create campaigns', 'Budget control', 'Audience targeting', 'A/B testing']}
    />
  )
}
