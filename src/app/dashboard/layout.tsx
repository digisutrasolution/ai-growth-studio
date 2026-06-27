import type { Metadata } from 'next'
import { Sidebar } from '@/components/app/sidebar'
import { Topbar } from '@/components/app/topbar'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-dvh shrink-0 lg:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
