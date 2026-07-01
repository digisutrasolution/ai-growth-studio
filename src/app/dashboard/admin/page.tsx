import { cookies } from 'next/headers'
import { AdminBoard } from '@/components/app/admin-board'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { isAdmin, getAdminSummary, getAdminUsers, getAdminOrders } from '@/lib/admin-store'

export const metadata = { title: 'Admin' }

export default async function Page() {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)

  if (!isAdmin(session?.email)) {
    return <AdminBoard admin={false} email={session?.email ?? null} />
  }

  const [summary, users, orders] = await Promise.all([
    getAdminSummary(), getAdminUsers(), getAdminOrders(100),
  ])
  return <AdminBoard admin summary={summary} users={users} orders={orders} email={session!.email} />
}
