import { cookies } from 'next/headers'
import { AdminBoard } from '@/components/app/admin-board'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { isAdmin, getAdminSummary, getAdminUsers, getAdminOrders } from '@/lib/admin-store'
import { getAuditLogs } from '@/lib/audit'

export const metadata = { title: 'Admin' }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; status?: string }>
}) {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)

  if (!isAdmin(session?.email)) {
    return <AdminBoard admin={false} email={session?.email ?? null} />
  }

  const sp = await searchParams
  const filters = { from: sp.from || '', to: sp.to || '', status: sp.status || '' }

  const [summary, users, orders, audit] = await Promise.all([
    getAdminSummary(),
    getAdminUsers(),
    getAdminOrders({ ...filters, limit: 200 }),
    getAuditLogs(50),
  ])
  return <AdminBoard admin summary={summary} users={users} orders={orders} audit={audit} filters={filters} email={session!.email} />
}
