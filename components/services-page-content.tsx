import { ServicesPageHero } from '@/components/services-page-hero'
import { ServicesEditorialSection } from '@/components/services-editorial-section'
import { servicesPageRootClass } from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

export function ServicesPageContent() {
  return (
    <div className={cn(servicesPageRootClass)}>
      <ServicesPageHero />
      <ServicesEditorialSection />
    </div>
  )
}

