import { FileText } from 'lucide-react'
import { PagePlaceholder } from '@/components/app/page-placeholder'

export const metadata = { title: 'Reports' }

export default function Page() {
  return (
    <PagePlaceholder
      icon={FileText}
      title="Reports"
      description="Real-time, exportable, scheduled reporting."
      stats={[
        { label: 'Saved reports', value: '18' },
        { label: 'Scheduled', value: '6' },
        { label: 'Exports (mo)', value: '142' },
        { label: 'Recipients', value: '24' },
      ]}
      bullets={['Real-time dashboards', 'Export PDF / CSV', 'Scheduled delivery']}
    />
  )
}
