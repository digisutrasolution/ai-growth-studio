import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const W = 350
const H = 318

/**
 * Brand logo — the exact DigiSutra logo, converted to transparent PNGs.
 * Two theme variants (dark text for light bg, light text for dark bg) are
 * swapped via CSS so there's no white box and no hydration flash.
 */
export function Logo({ className, href = '/', size = 'md' }: { className?: string; href?: string; size?: 'md' | 'lg' }) {
  const h = size === 'lg' ? 'h-12' : 'h-9'
  return (
    <Link href={href} className={cn('inline-flex items-center', className)} aria-label="DigiSutra Solutions">
      <Image src="/digisutra-logo.png" alt="" width={W} height={H} priority className={cn(h, 'w-auto dark:hidden')} />
      <Image src="/digisutra-logo-dark.png" alt="" width={W} height={H} priority className={cn(h, 'hidden w-auto dark:block')} />
    </Link>
  )
}
