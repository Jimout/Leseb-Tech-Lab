import { SiteNavbar } from '@/components/site-navbar'
import { Container } from '@/components/layout/container'

export default function Loading() {
  return (
    <>
      <SiteNavbar />
      <main className="min-h-dvh scroll-mt-24 bg-page-grid text-foreground">
        <Container className="py-20 sm:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-5xl animate-pulse space-y-6">
            <div className="h-4 w-28 rounded bg-white/10" />
            <div className="h-10 w-full max-w-3xl rounded bg-white/10" />
            <div className="h-4 w-full max-w-2xl rounded bg-white/8" />
            <div className="h-4 w-full max-w-xl rounded bg-white/8" />
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-48 rounded-2xl bg-white/8" />
              <div className="h-48 rounded-2xl bg-white/8" />
              <div className="h-48 rounded-2xl bg-white/8" />
            </div>
          </div>
        </Container>
      </main>
    </>
  )
}
