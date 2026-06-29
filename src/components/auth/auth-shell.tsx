import Link from 'next/link'
import { Check } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Aurora } from '@/components/ui/aurora'

const perks = ['5 specialized AI agents', 'Unlimited campaigns & automation', '14-day free trial — no card required']

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-line p-10 lg:flex">
        <Aurora />
        <Logo />
        <div className="relative">
          <h1 className="max-w-md text-balance text-3xl font-semibold leading-tight">
            Put your marketing on <span className="text-gradient">autopilot</span> with AI Growth Studio
          </h1>
          <ul className="mt-6 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-fg-muted">
                <span className="grid size-5 place-items-center rounded-full bg-emerald-400/15"><Check className="size-3 text-emerald-400" /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-fg-muted">© {new Date().getFullYear()} DigiSutra Solutions · Your growth, our sutra</p>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          {children}
          <p className="mt-8 text-center text-xs text-fg-muted">
            By continuing you agree to our <Link href="#" className="text-accent hover:underline">Terms</Link> and{' '}
            <Link href="#" className="text-accent hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
