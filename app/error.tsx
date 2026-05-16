'use client'

import { useEffect } from 'react'

import { SiteNavbar } from '@/components/site-navbar'
import { SiteLink } from '@/components/seo/site-link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

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
    <>
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-background text-foreground">
        <Container className="py-20 sm:py-28">
          <article className="mx-auto max-w-xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Error</p>
            <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Something went wrong
            </h1>
            <p className="mt-4 text-pretty text-base text-muted-foreground">
              A brief issue occurred while loading this page. You can retry or return to a safe starting point.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button type="button" onClick={() => reset()}>
                Try again
              </Button>
              <Button asChild variant="secondary">
                <SiteLink href="/">Home</SiteLink>
              </Button>
            </div>
          </article>
        </Container>
      </main>
    </>
  )
}
