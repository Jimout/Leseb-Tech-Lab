'use client'

import { useEffect } from 'react'

import { SiteLink } from '@/components/seo/site-link'
import { Button } from '@/components/ui/button'

/**
 * Root-level error UI (replaces the root layout when the error boundary catches root failures).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-dvh bg-background px-6 py-16 font-sans text-[#fafafa] antialiased">
        <main className="mx-auto max-w-md text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Error</p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Something went wrong</h1>
          <p className="mt-3 text-sm text-white/65">
            Please try again. If the problem continues, return to the homepage.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button type="button" onClick={() => reset()}>
              Try again
            </Button>
            <Button asChild variant="secondary">
              <SiteLink href="/">Home</SiteLink>
            </Button>
          </div>
        </main>
      </body>
    </html>
  )
}
