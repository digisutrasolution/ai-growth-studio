import { Settings } from 'lucide-react'
import { PagePlaceholder } from '@/components/app/page-placeholder'

export const metadata = { title: 'Settings' }

export default function Page() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Settings"
      description="Team, roles, permissions and notifications."
      bullets={['Role-based access', 'Team members', 'Permission management', 'Activity logs', 'Notifications']}
    />
  )
}
