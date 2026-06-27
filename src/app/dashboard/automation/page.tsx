import { Workflow } from 'lucide-react'
import { PagePlaceholder } from '@/components/app/page-placeholder'

export const metadata = { title: 'Automation' }

export default function Page() {
  return (
    <PagePlaceholder
      icon={Workflow}
      title="Automation"
      description="Build self-running workflows with triggers and smart actions."
      stats={[
        { label: 'Workflows', value: '24' },
        { label: 'Runs today', value: '4,820' },
        { label: 'Success rate', value: '99.2%' },
        { label: 'Actions saved', value: '38k' },
      ]}
      bullets={['Visual workflow builder', 'Trigger & action library', 'Smart branching logic']}
    />
  )
}
