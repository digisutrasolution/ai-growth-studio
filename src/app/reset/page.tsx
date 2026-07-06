import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/auth/auth-shell'
import { ResetForm } from '@/components/auth/reset-form'

export const metadata = { title: 'Set a new password' } satisfies Metadata

export default function ResetPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="h-40" />}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  )
}
