'use client'

import * as React from 'react'

import { Container } from '@/components/layout/container'
import {
  InsightLandingCard,
  primaryInsightCategory,
  useInsightFilterLabelMap,
} from '@/components/insight-landing-card'
import { NewsletterSubscribeBanner } from '@/components/newsletter-subscribe-banner'
import { WorkPageFilterBar } from '@/components/work-page-filter-bar'
import type { WorkFilterDefinition } from '@/lib/work-filter-definition'
import { StripPagination } from '@/components/strip-pagination'
import { useIsMobile } from '@/hooks/use-mobile'
import { useInsightsShowcaseMerged } from '@/hooks/use-insights-showcase-merged'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import { workLabCardLandingGridClass } from '@/lib/landing-page-typography'
import { buildWorkInsightFilterDefinitions } from '@/lib/portfolio-catalog-filters'
import { useCatalogUiStore } from '@/stores/use-catalog-ui-store'

/** Mobile: one grid of four. Desktop: six cards, newsletter, then six more. */
const INSIGHTS_PER_PAGE_MOBILE = 4
const INSIGHTS_PER_PAGE_DESKTOP = 12
const INSIGHTS_TOP_ROW_DESKTOP = 6

function InsightCardsGrid({
  items,
  ariaLabel,
  filterLabels,
}: {
  items: ShowcaseInsight[]
  ariaLabel: string
  filterLabels: Map<string, string>
}) {
  if (items.length === 0) return null
  return (
    <ul className={workLabCardLandingGridClass} aria-label={ariaLabel}>
      {items.map((item, i) => {
        const cat = primaryInsightCategory(item, filterLabels)
        return (
          <li key={item.id} className="min-w-0">
            <InsightLandingCard
              item={item}
              categoryPill={cat.pill}
              categoryMeta={cat.meta}
              imageSizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="h-full w-full"
            />
          </li>
        )
      })}
    </ul>
  )
}

function useFilteredInsights(activeId: string, insights: ShowcaseInsight[]): ShowcaseInsight[] {
  return React.useMemo(() => {
    if (activeId === 'all') return [...insights]
    return insights.filter((item) => item.filterIds.includes(activeId))
  }, [activeId, insights])
}

function useInsightFilterDefinitions(
  entries: ReturnType<typeof useSiteSettings>['settings']['portfolioCatalogFilters']['workInsights'],
  insights: ShowcaseInsight[],
): WorkFilterDefinition[] {
  return React.useMemo(
    () => buildWorkInsightFilterDefinitions(entries, insights),
    [entries, insights],
  )
}

export function InsightsPageContent() {
  const { insightActiveId: activeId, insightPage: page, setInsightActiveId, setInsightPage } =
    useCatalogUiStore()
  const isMobile = useIsMobile()
  const insightsPerPage = isMobile ? INSIGHTS_PER_PAGE_MOBILE : INSIGHTS_PER_PAGE_DESKTOP
  const { settings } = useSiteSettings()
  const insights = useInsightsShowcaseMerged()
  const filters = useInsightFilterDefinitions(settings.portfolioCatalogFilters.workInsights, insights)
  const filterLabels = useInsightFilterLabelMap()
  const filtered = useFilteredInsights(activeId, insights)

  React.useEffect(() => {
    const ids = new Set(filters.map((f) => f.id))
    if (!ids.has(activeId)) setInsightActiveId('all')
  }, [filters, activeId, setInsightActiveId])

  const totalPages = Math.max(1, Math.ceil(filtered.length / insightsPerPage))

  React.useEffect(() => {
    setInsightPage(1)
  }, [activeId, setInsightPage])

  React.useEffect(() => {
    setInsightPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages, setInsightPage])

  const pageSlice = React.useMemo(() => {
    const start = (page - 1) * insightsPerPage
    return filtered.slice(start, start + insightsPerPage)
  }, [filtered, page, insightsPerPage])

  const topInsights = isMobile ? pageSlice : pageSlice.slice(0, INSIGHTS_TOP_ROW_DESKTOP)
  const bottomInsights = isMobile ? [] : pageSlice.slice(INSIGHTS_TOP_ROW_DESKTOP, INSIGHTS_PER_PAGE_DESKTOP)

  return (
    <>
      <WorkPageFilterBar
        filters={filters}
        activeId={activeId}
        onActiveIdChange={setInsightActiveId}
        kicker="Our insights"
        filterTablistAriaLabel="Filter insights"
      />
      <section className="pb-10 pt-6 sm:pb-14 sm:pt-8 md:pb-16 md:pt-10 lg:pb-20 lg:pt-12">
        <Container>
          {filtered.length === 0 ? (
            <p className="max-w-none text-muted-foreground lg:text-base xl:text-lg 2xl:text-xl">
              No articles in this category yet. Try another filter or explore all insights.
            </p>
          ) : (
            <InsightCardsGrid
              items={topInsights}
              ariaLabel="Insight articles"
              filterLabels={filterLabels}
            />
          )}
        </Container>
        {filtered.length > 0 ? (
          <NewsletterSubscribeBanner className="mt-12 sm:mt-16 md:mt-20 lg:mt-24" />
        ) : null}
        {bottomInsights.length > 0 ? (
          <Container className="mt-12 sm:mt-16 md:mt-20 lg:mt-24">
            <InsightCardsGrid
              items={bottomInsights}
              ariaLabel="More insight articles"
              filterLabels={filterLabels}
            />
          </Container>
        ) : null}
        {filtered.length > 0 ? (
          <StripPagination
            numbered
            className="mt-8 sm:mt-10"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setInsightPage}
          />
        ) : null}
      </section>
    </>
  )
}
