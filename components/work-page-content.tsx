'use client'

import * as React from 'react'

import { WorkPageFilterBar } from '@/components/work-page-filter-bar'
import { WorksLabShowcaseFromWorks } from '@/components/works-lab-grid'
import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { PillPagination } from '@/components/ui/pill-pagination'
import { buildWorkInsightFilterDefinitions } from '@/lib/portfolio-catalog-filters'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { useWorksShowcaseMerged } from '@/hooks/use-works-showcase-merged'
import type { ShowcaseWork } from '@/lib/works-showcase-data'
import { useCatalogUiStore } from '@/stores/use-catalog-ui-store'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 8

function useFilteredWorks(works: ShowcaseWork[], activeId: string) {
  return React.useMemo(() => {
    if (activeId === 'all') return works
    return works.filter((w) => w.filterIds.includes(activeId))
  }, [works, activeId])
}

function useFilterDefinitions(
  works: ShowcaseWork[],
  entries: ReturnType<typeof useSiteSettings>['settings']['portfolioCatalogFilters']['workInsights'],
) {
  return React.useMemo(
    () => buildWorkInsightFilterDefinitions(entries, works),
    [works, entries],
  )
}

export function WorkPageContent() {
  const { workActiveId: activeId, workPage: page, setWorkActiveId, setWorkPage } =
    useCatalogUiStore()
  const { settings } = useSiteSettings()
  const works = useWorksShowcaseMerged()
  const filters = useFilterDefinitions(works, settings.portfolioCatalogFilters.workInsights)
  const filtered = useFilteredWorks(works, activeId)

  React.useEffect(() => {
    const ids = new Set(filters.map((f) => f.id))
    if (!ids.has(activeId)) setWorkActiveId('all')
  }, [filters, activeId, setWorkActiveId])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  React.useEffect(() => {
    setWorkPage(1)
  }, [activeId, setWorkPage])

  React.useEffect(() => {
    setWorkPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages, setWorkPage])

  const pageWorks = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  return (
    <>
      <WorkPageFilterBar
        filters={filters}
        activeId={activeId}
        onActiveIdChange={setWorkActiveId}
        kicker="Our work"
      />
      <section
        className={cn(
          'pb-10 pt-6 sm:pb-14 sm:pt-8 md:pb-16 md:pt-10 lg:pb-20 lg:pt-12',
          landingPageGutterClass,
        )}
      >
        <div className={cn('mx-auto min-w-0', landingPageContentMaxClass)}>
          {filtered.length === 0 ? (
            <p className="max-w-none text-muted-foreground lg:text-base xl:text-lg 2xl:text-xl">
              No projects in this category yet. Try another filter or explore all works.
            </p>
          ) : (
            <>
              <WorksLabShowcaseFromWorks works={pageWorks} lcpPriority={page === 1} />
              {totalPages > 1 ? (
                <div className="mt-12 flex justify-center sm:mt-14 md:mt-16">
                  <PillPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setWorkPage}
                    hidePrev={page <= 1}
                    hideNext={page >= totalPages}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  )
}
