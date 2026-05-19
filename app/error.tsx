'use client'

import { useEffect } from 'react'

import { typeH2 } from '@/lib/type-scale'
import { cn } from '@/lib/utils'

/**
 * Route-level error UI. Avoid components that call usePathname/useRouter — they can
 * throw "layout router to be mounted" when the app router is in a bad state.
 */
export default function RouteError({
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
    <main className="min-h-dvh scroll-mt-24 bg-background px-6 py-20 text-foreground sm:py-28">
      <article className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Error</p>
        <h1 className={cn('mt-4', typeH2)}>
          Something went wrong
        </h1>
        <p className="mt-4 text-pretty text-base text-muted-foreground">
          A brief issue occurred while loading this page. You can retry or return to a safe starting point.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground"
          >
            Home
          </a>
        </div>
      </article>
    </main>
  )
}
