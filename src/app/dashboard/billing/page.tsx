import { cookies } from 'next/headers'
import { BillingBoard } from '@/components/app/billing-board'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { getUserPlan, getUserOrders } from '@/lib/billing-store'
import { getSubscription } from '@/lib/subscriptions'
import { paymentMethods, isMethodConfigured, type MethodId } from '@/lib/payments'

export const metadata = { title: 'Billing' }

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; ref?: string }> }) {
  const { status, ref } = await searchParams

  // Which gateways have credentials (computed server-side; bank transfer is always on).
  const configured = Object.fromEntries(
    paymentMethods.map((m) => [m.id, isMethodConfigured(m.id)]),
  ) as Partial<Record<MethodId, boolean>>

  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  const email = session?.email ?? null

  const [plan, orders, subscription] = email
    ? await Promise.all([getUserPlan(email), getUserOrders(email), getSubscription(email)])
    : [null, [], null]

  return (
    <BillingBoard
      configured={configured}
      plan={plan ?? 'Free'}
      orders={orders}
      subscription={subscription}
      email={email}
      returnStatus={status ?? null}
      returnRef={ref ?? null}
    />
  )
}
