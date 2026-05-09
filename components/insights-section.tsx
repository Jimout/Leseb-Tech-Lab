import { Container } from '@/components/layout/container'
import { InsightsShowcase } from '@/components/insights-showcase'
import { cn } from '@/lib/utils'

export function InsightsSection() {
  return (
    <section id="insights" data-nav-surface="light" className={cn('scroll-mt-24 min-w-0 bg-background py-0')}>
      <Container className={cn('min-w-0', 'pt-0', 'pb-0')}>
        <InsightsShowcase mobileCardLimit={2} />
      </Container>
    </section>
  )
}
