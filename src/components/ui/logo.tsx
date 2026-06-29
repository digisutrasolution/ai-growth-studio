import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn('group inline-flex items-center gap-2.5', className)} aria-label="DigiSutra Solutions">
      <span className="relative inline-grid size-9 place-items-center">
        <svg viewBox="0 0 48 48" className="size-9 drop-shadow-[0_4px_12px_rgba(234,88,12,0.45)]" aria-hidden="true">
          <defs>
            <linearGradient id="ds-mark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FDBA74" />
              <stop offset="0.45" stopColor="#F97316" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          {/* shield with downward chevron, echoing the DigiSutra mark */}
          <path d="M8 6h32v20.5L24 42 8 26.5V6Z" fill="url(#ds-mark)" />
          <path d="M8 6h32v20.5L24 42 8 26.5V6Z" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
          <text x="24" y="24.5" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-sora), system-ui, sans-serif" fontWeight="700" fontSize="15" letterSpacing="-0.5" fill="#ffffff">DS</text>
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        <span className="text-[#F97316]">Digi</span>Sutra
      </span>
    </Link>
  )
}
