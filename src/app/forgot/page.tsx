import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { ForgotForm } from '@/components/auth/forgot-form'

export const metadata = { title: 'Reset password' } satisfies Metadata

export default function ForgotPage() {
  return (
    <AuthShell>
      <ForgotForm />
    </AuthShell>
  )
}
