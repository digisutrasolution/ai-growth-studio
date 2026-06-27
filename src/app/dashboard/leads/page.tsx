import { UserPlus } from 'lucide-react'
import { PagePlaceholder } from '@/components/app/page-placeholder'

export const metadata = { title: 'Leads' }

export default function Page() {
  return (
    <PagePlaceholder
      icon={UserPlus}
      title="Leads"
      description="Capture, score and route inbound leads automatically."
      stats={[
        { label: 'New leads', value: '1,284' },
        { label: 'Qualified', value: '612' },
        { label: 'Reply rate', value: '+41%' },
        { label: 'Avg. score', value: '72' },
      ]}
      bullets={['Lead scoring', 'Auto-routing', 'Enrichment', 'Follow-up sequences']}
    />
  )
}
