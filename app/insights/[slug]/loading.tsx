import { SiteNavbar } from '@/components/site-navbar'
import {
  catalogPageBelowNavPadTopClass,
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

export default function InsightDetailLoading() {
  return (
    <>
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-background text-foreground">
        <section
          className={cn(
            'animate-pulse',
            catalogPageBelowNavPadTopClass,
            'pb-12',
            landingPageGutterClass,
          )}
        >
          <div className={cn('mx-auto min-w-0 space-y-6', landingPageContentMaxClass)}>
            <div className="h-4 w-24 rounded bg-foreground/10" />
            <div className="h-4 w-40 rounded bg-foreground/10" />
            <div className="h-12 w-full max-w-3xl rounded bg-foreground/10" />
            <div className="aspect-4/3 w-full rounded-2xl bg-foreground/8" />
          </div>
        </section>
      </main>
    </>
  )
}
