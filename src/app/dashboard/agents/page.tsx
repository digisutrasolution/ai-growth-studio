import { Bot } from 'lucide-react'
import { PagePlaceholder } from '@/components/app/page-placeholder'

export const metadata = { title: 'AI Agents' }

export default function Page() {
  return (
    <PagePlaceholder
      icon={Bot}
      title="AI Agents"
      description="Activate, configure and monitor your autonomous agents."
      stats={[
        { label: 'Active agents', value: '5' },
        { label: 'Tasks today', value: '1,284' },
        { label: 'Auto-resolve', value: '78%' },
        { label: 'Hours saved', value: '142' },
      ]}
      bullets={['Marketing', 'SEO', 'Content', 'Sales', 'Support']}
    />
  )
}
