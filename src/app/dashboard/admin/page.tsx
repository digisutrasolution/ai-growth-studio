import { ShieldCheck } from 'lucide-react'
import { PagePlaceholder } from '@/components/app/page-placeholder'

export const metadata = { title: 'Admin' }

export default function Page() {
  return (
    <PagePlaceholder
      icon={ShieldCheck}
      title="Admin overview"
      description="Enterprise administration, monitoring and security."
      stats={[
        { label: 'Users', value: '1,940' },
        { label: 'MRR', value: '$182k' },
        { label: 'API calls (24h)', value: '4.1M' },
        { label: 'Uptime', value: '99.99%' },
      ]}
      bullets={['User management', 'Subscriptions', 'AI agent control', 'Usage monitoring', 'API management', 'System logs', 'Security monitoring', 'Revenue analytics']}
    />
  )
}
