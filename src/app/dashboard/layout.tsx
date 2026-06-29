import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/app/sidebar'
import { Topbar } from '@/components/app/topbar'
import { SESSION_COOKIE, readSession } from '@/lib/auth'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  // Defense in depth: invalid/forged/expired tokens are rejected here too.
  if (!session) redirect('/login')
  const user = { name: session.name, email: session.email }

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-dvh shrink-0 lg:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
