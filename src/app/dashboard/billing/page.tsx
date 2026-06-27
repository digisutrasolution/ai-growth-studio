import { Receipt } from 'lucide-react'
import { PagePlaceholder } from '@/components/app/page-placeholder'

export const metadata = { title: 'Billing' }

export default function Page() {
  return (
    <PagePlaceholder
      icon={Receipt}
      title="Billing"
      description="Manage your plan, usage and invoices."
      stats={[
        { label: 'Plan', value: 'Professional' },
        { label: 'Actions used', value: '64%' },
        { label: 'Next invoice', value: '$129' },
        { label: 'Renews', value: '9 days' },
      ]}
      bullets={['Plan management', 'Usage metering', 'Invoices & receipts', 'Payment methods']}
    />
  )
}
