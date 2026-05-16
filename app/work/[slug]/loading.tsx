import { Container } from '@/components/layout/container'
import { SiteNavbar } from '@/components/site-navbar'

export default function WorkDetailLoading() {
  return (
    <>
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-background text-foreground">
        <section className="pb-16 pt-6 sm:pb-20 sm:pt-8 md:pb-24 md:pt-10 lg:pb-28 lg:pt-12">
          <Container>
            <div className="animate-pulse space-y-6">
              <div className="h-5 w-24 rounded bg-white/10" />
              <div className="h-10 w-full max-w-3xl rounded bg-white/10" />
              <div className="h-[45vh] w-full rounded-2xl bg-white/8" />
              <div className="h-4 w-full max-w-2xl rounded bg-white/10" />
              <div className="h-4 w-full max-w-xl rounded bg-white/10" />
            </div>
          </Container>
        </section>
      </main>
    </>
  )
}
