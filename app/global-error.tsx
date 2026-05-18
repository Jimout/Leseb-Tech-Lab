'use client'

import { useEffect } from 'react'

/**
 * Root-level error UI (replaces the root layout when the error boundary catches root failures).
 * Avoid next/link and navigation hooks here — the layout router is not mounted.
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
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 text-sm font-medium text-white"
            >
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
