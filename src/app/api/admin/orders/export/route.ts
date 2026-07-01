import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { isAdmin, getAdminOrders } from '@/lib/admin-store'
import { toCsv, csvResponse } from '@/lib/csv'

export const runtime = 'nodejs'

/** CSV of every order across all users. Admin-only. */
export async function GET() {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return new Response('Please sign in.', { status: 401 })
  if (!isAdmin(session.email)) return new Response('Not authorized.', { status: 403 })

  const orders = await getAdminOrders(10000)
  const csv = toCsv(
    ['Reference', 'Email', 'Plan', 'Cycle', 'Currency', 'Amount', 'Method', 'Status', 'Created', 'Paid'],
    orders.map((o) => [
      o.reference, o.email, o.plan, o.cycle, o.currency, (o.amount / 100).toFixed(2), o.method, o.status,
      o.createdAt, o.paidAt ?? '',
    ]),
  )
  return csvResponse('digisutra-all-orders.csv', csv)
}
