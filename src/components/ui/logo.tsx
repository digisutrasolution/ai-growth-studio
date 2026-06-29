import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const W = 499
const H = 138

/**
 * Brand logo — horizontal DigiSutra lockup (transparent PNG, built from the
 * official logo art). Two theme variants (dark text for light bg, light text
 * for dark bg) are swapped via CSS so there's no white box and no hydration flash.
 */
export function Logo({ className, href = '/', size = 'md' }: { className?: string; href?: string; size?: 'md' | 'lg' }) {
  const h = size === 'lg' ? 'h-14' : 'h-11'
  return (
    <Link href={href} className={cn('inline-flex items-center', className)} aria-label="DigiSutra Solutions">
      <Image src="/digisutra-logo-h.png" alt="" width={W} height={H} priority className={cn(h, 'w-auto dark:hidden')} />
      <Image src="/digisutra-logo-h-dark.png" alt="" width={W} height={H} priority className={cn(h, 'hidden w-auto dark:block')} />
    </Link>
  )
}
