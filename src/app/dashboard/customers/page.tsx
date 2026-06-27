import { Users } from 'lucide-react'
import { PagePlaceholder } from '@/components/app/page-placeholder'

export const metadata = { title: 'Customers' }

export default function Page() {
  return (
    <PagePlaceholder
      icon={Users}
      title="Customers"
      description="Track behavior, build segments and personalize at scale."
      stats={[
        { label: 'Customers', value: '12.4k' },
        { label: 'Active 30d', value: '8.9k' },
        { label: 'Churn risk', value: '214' },
        { label: 'LTV', value: '$1,840' },
      ]}
      bullets={['Behavioral tracking', 'Predictive segments', '1:1 personalization']}
    />
  )
}
