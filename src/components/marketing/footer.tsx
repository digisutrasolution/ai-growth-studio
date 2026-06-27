import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

const cols = [
  { title: 'Product', links: ['AI Agents', 'Services', 'Platform', 'Pricing', 'Integrations'] },
  { title: 'Company', links: ['About', 'Careers', 'Blog', 'Customers', 'Contact'] },
  { title: 'Resources', links: ['Docs', 'API reference', 'Status', 'Community', 'Changelog'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR', 'DPA'] },
]

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              The AI growth platform that runs your marketing — campaigns, content, and customers, automated end to end.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-fg-muted transition-colors hover:text-fg">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-sm text-fg-muted sm:flex-row">
          <p>© {new Date().getFullYear()} AI Growth Studio. Crafted by Steven.</p>
          <p className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" /> All systems operational
          </p>
        </div>
      </div>
    </footer>
  )
}
