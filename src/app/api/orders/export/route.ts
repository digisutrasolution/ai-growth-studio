import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { getPrisma } from '@/lib/db'
import { toCsv, csvResponse } from '@/lib/csv'

export const runtime = 'nodejs'

/** CSV of the signed-in user's own orders. */
export async function GET() {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return new Response('Please sign in.', { status: 401 })

  const prisma = getPrisma()
  if (!prisma) return new Response('Not available.', { status: 503 })

  const orders = await prisma.order
    .findMany({ where: { email: session.email }, orderBy: { createdAt: 'desc' } })
    .catch(() => [])

  const csv = toCsv(
    ['Reference', 'Plan', 'Cycle', 'Currency', 'Amount', 'Method', 'Status', 'Created', 'Paid'],
    orders.map((o) => [
      o.reference, o.plan, o.cycle, o.currency, (o.amount / 100).toFixed(2), o.method, o.status,
      o.createdAt.toISOString(), o.paidAt ? o.paidAt.toISOString() : '',
    ]),
  )
  return csvResponse('digisutra-payments.csv', csv)
}
