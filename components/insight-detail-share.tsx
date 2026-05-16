'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'

import { ContactSocialRow } from '@/components/contact-social-row'
import { insightDetailKickerClass } from '@/lib/insight-detail-typography'
import { cn } from '@/lib/utils'

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
      // Clipboard may be unavailable; social links remain usable.
    }
  }, [])

  return (
    <div className={cn('space-y-4', className)}>
      <p className={insightDetailKickerClass}>Share</p>
      <div className="flex flex-wrap items-center gap-2">
        <ContactSocialRow />
        <button
          type="button"
          onClick={() => void onCopyLink()}
          aria-label="Copy link"
          title={copied ? 'Link copied' : 'Copy link'}
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background',
            'text-foreground/80 transition-colors hover:border-signal/40 hover:text-signal',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'sm:size-11',
            copied && 'border-signal/40 text-signal',
          )}
        >
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        </button>
      </div>
    </div>
  )
}
