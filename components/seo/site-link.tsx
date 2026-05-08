import Link from 'next/link'
import type { ComponentProps } from 'react'

type SiteLinkProps = ComponentProps<typeof Link>

/**
 * Internal link with prefetch on by default (Next.js App Router SEO + UX).
 */
export function SiteLink({ prefetch = true, ...props }: SiteLinkProps) {
  return <Link prefetch={prefetch} {...props} />
}
