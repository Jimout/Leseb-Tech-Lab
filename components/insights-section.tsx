import { Container } from '@/components/layout/container'
import { InsightsShowcase } from '@/components/insights-showcase'
import { cn } from '@/lib/utils'

export function InsightsSection() {
  return (
    <section
      id="insights"
      className={cn(
        'scroll-mt-24 min-w-0',
        'pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-14 2xl:pt-16 3xl:pt-20 4xl:pt-24',
        'pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-28 2xl:pb-32 3xl:pb-36 4xl:pb-40',
      )}
    >
      <Container className="min-w-0">
        <InsightsShowcase mobileCardLimit={2} />
      </Container>
    </section>
  )
}
