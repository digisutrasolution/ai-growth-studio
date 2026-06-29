import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Brand logo — uses the exact DigiSutra logo asset (public/digisutra-logo.jpg).
 * The source art has a white background, so on dark surfaces it sits on a small
 * white "chip" to stay crisp. `size` controls the rendered height.
 */
export function Logo({ className, href = '/', size = 'md' }: { className?: string; href?: string; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'size-14' : 'size-10'
  return (
    <Link href={href} className={cn('inline-flex items-center', className)} aria-label="DigiSutra Solutions">
      <span className="inline-flex items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-black/5">
        <Image
          src="/digisutra-logo.jpg"
          alt="DigiSutra Solutions"
          width={452}
          height={452}
          priority
          className={cn(box, 'object-contain')}
        />
      </span>
    </Link>
  )
}
