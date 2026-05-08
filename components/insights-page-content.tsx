'use client'

import * as React from 'react'

import { Container } from '@/components/layout/container'
import { InsightCard } from '@/components/insight-card'
import { NewsletterSubscribeBanner } from '@/components/newsletter-subscribe-banner'
import { WorkPageFilterBar } from '@/components/work-page-filter-bar'
import type { WorkFilterDefinition } from '@/lib/work-filter-definition'
import { PillPagination } from '@/components/ui/pill-pagination'
import { useInsightsShowcaseMerged } from '@/hooks/use-insights-showcase-merged'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import { buildWorkInsightFilterDefinitions } from '@/lib/portfolio-catalog-filters'
import { useCatalogUiStore } from '@/stores/use-catalog-ui-store'

/** One “page”: up to six cards, newsletter, then up to six more (two lg rows). */
const INSIGHTS_PER_PAGE = 12

const INSIGHT_GRID_CLASS =
  'grid list-none grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 md:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 xl:gap-x-10'

function InsightCardsGrid({
  items,
  ariaLabel,
  priorityAboveFold,
}: {
  items: ShowcaseInsight[]
  ariaLabel: string
  priorityAboveFold: boolean
}) {
  if (items.length === 0) return null
  return (
    <ul className={INSIGHT_GRID_CLASS} aria-label={ariaLabel}>
      {items.map((item, i) => (
        <li key={item.id} className="min-w-0">
          <InsightCard
            date={item.date}
            dateIso={item.dateIso}
            title={item.title}
            description={item.description}
            heroMedia={item.heroMedia}
            href={item.href}
            priority={priorityAboveFold && i < 3}
            imageSizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="h-full rounded-2xl border border-border/60 bg-card p-3 sm:rounded-3xl sm:p-4"
          />
        </li>
      ))}
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
  const { settings } = useSiteSettings()
  const insights = useInsightsShowcaseMerged()
  const filters = useInsightFilterDefinitions(settings.portfolioCatalogFilters.workInsights, insights)
  const filtered = useFilteredInsights(activeId, insights)

  React.useEffect(() => {
    const ids = new Set(filters.map((f) => f.id))
    if (!ids.has(activeId)) setInsightActiveId('all')
  }, [filters, activeId, setInsightActiveId])

  const totalPages = Math.max(1, Math.ceil(filtered.length / INSIGHTS_PER_PAGE))

  React.useEffect(() => {
    setInsightPage(1)
  }, [activeId, setInsightPage])

  React.useEffect(() => {
    setInsightPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages, setInsightPage])

  const pageSlice = React.useMemo(() => {
    const start = (page - 1) * INSIGHTS_PER_PAGE
    return filtered.slice(start, start + INSIGHTS_PER_PAGE)
  }, [filtered, page])

  const topInsights = pageSlice.slice(0, 6)
  const bottomInsights = pageSlice.slice(6, 12)
  const lcpPriority = page === 1

  return (
    <>
      <WorkPageFilterBar
        filters={filters}
        activeId={activeId}
        onActiveIdChange={setInsightActiveId}
        kicker="My Insights"
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
              priorityAboveFold={lcpPriority}
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
              priorityAboveFold={false}
            />
          </Container>
        ) : null}
        {filtered.length > 0 && totalPages > 1 ? (
          <div className="mt-12 flex justify-center sm:mt-14 md:mt-16">
            <PillPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setInsightPage}
              hidePrev={page <= 1}
              hideNext={page >= totalPages}
            />
          </div>
        ) : null}
      </section>
    </>
  )
}
