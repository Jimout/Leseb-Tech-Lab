'use client'

import Link from 'next/link'
import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { SiFacebook, SiInstagram, SiTelegram } from 'react-icons/si'

import { cn } from '@/lib/utils'

const SHARE_LINKS = [
  { href: 'https://www.linkedin.com', label: 'LinkedIn', Icon: FaLinkedinIn },
  { href: 'https://www.facebook.com', label: 'Facebook', Icon: SiFacebook },
  { href: 'https://x.com', label: 'X', Icon: FaXTwitter },
  { href: 'https://www.instagram.com', label: 'Instagram', Icon: SiInstagram },
  { href: 'https://t.me', label: 'Telegram', Icon: SiTelegram },
] as const

export function InsightDetailShare({ className }: { className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const copyTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current)
    }
  }, [])

  const onCopyLink = React.useCallback(async () => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current)
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // Intentionally silent fallback; share controls remain usable.
    }
  }, [])

  return (
    <div className={cn('space-y-3.5', className)}>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
        Share
      </p>
      <div className="flex flex-wrap gap-2.5">
        {SHARE_LINKS.map(({ href, label, Icon }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              'inline-flex size-10 shrink-0 items-center justify-center rounded-full overflow-visible leading-none',
              'bg-accent text-accent-foreground shadow-sm transition-opacity hover:opacity-90',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
          </Link>
        ))}
        <button
          type="button"
          onClick={() => void onCopyLink()}
          aria-label="Copy link"
          title={copied ? 'Link copied' : 'Copy link'}
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-full overflow-visible leading-none',
            'bg-accent text-accent-foreground shadow-sm transition-opacity hover:opacity-90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            copied && 'opacity-90',
          )}
        >
          {copied ? <Check className="size-4 shrink-0" aria-hidden /> : <Copy className="size-4 shrink-0" aria-hidden />}
        </button>
      </div>
    </div>
  )
}
