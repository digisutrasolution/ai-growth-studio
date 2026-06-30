import { BillingBoard } from '@/components/app/billing-board'
import { paymentMethods, isMethodConfigured, type MethodId } from '@/lib/payments'

export const metadata = { title: 'Billing' }

export default function Page() {
  // Which gateways have credentials (computed server-side; bank transfer is always on).
  const configured = Object.fromEntries(
    paymentMethods.map((m) => [m.id, isMethodConfigured(m.id)]),
  ) as Partial<Record<MethodId, boolean>>
  return <BillingBoard configured={configured} />
}
