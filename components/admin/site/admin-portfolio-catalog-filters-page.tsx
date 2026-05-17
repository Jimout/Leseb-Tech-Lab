'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { AdminPageSaveCancelActions } from '@/components/admin/admin-page-save-cancel-actions'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  CatalogCategoryFiltersEditor,
  resequenceCatalogFilters,
} from '@/components/admin/site/catalog-filter-editors'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  normalizePortfolioCatalogFiltersState,
  type PortfolioCatalogFilterEntry,
} from '@/lib/portfolio-catalog-filters'

export function AdminPortfolioCatalogFiltersPage() {
  const { settings, patch, ready } = useSiteSettings()
  const hydrated = useRef(false)
  const [workInsights, setWorkInsights] = useState<PortfolioCatalogFilterEntry[]>(() =>
    normalizePortfolioCatalogFiltersState(settings.portfolioCatalogFilters).workInsights,
  )

  useEffect(() => {
    if (!ready || hydrated.current) return
    hydrated.current = true
    setWorkInsights([
      ...normalizePortfolioCatalogFiltersState(settings.portfolioCatalogFilters).workInsights,
    ])
  }, [ready, settings.portfolioCatalogFilters])

  const savedFilters = useMemo(
    () => normalizePortfolioCatalogFiltersState(settings.portfolioCatalogFilters).workInsights,
    [settings.portfolioCatalogFilters],
  )

  const changed = useMemo(
    () =>
      JSON.stringify(resequenceCatalogFilters(workInsights)) !==
      JSON.stringify(resequenceCatalogFilters(savedFilters)),
    [workInsights, savedFilters],
  )

  function resetToSaved() {
    setWorkInsights([...savedFilters])
  }

  function saveNow() {
    patch({
      portfolioCatalogFilters: normalizePortfolioCatalogFiltersState({
        workInsights: resequenceCatalogFilters(workInsights),
      }),
    })
  }

  return (
    <AdminPageShell
      title="Category filters"
      description="One list powers the filter bar on /work and /insights. Counts update from your projects and articles."
      right={
        <AdminPageSaveCancelActions
          changed={changed}
          pageName="Category filters"
          saveTitle="Save category filters?"
          saveDescription="This will update the filter bars on /work and /insights for all visitors."
          discardTitle="Discard category filter changes?"
          discardDescription="Unsaved edits to labels, order, or visibility will be lost. The list will reset to the last saved version."
          onSave={saveNow}
          onDiscard={resetToSaved}
        />
      }
    >
      <Accordion type="multiple" defaultValue={['categories']} className="space-y-3">
        <AccordionItem value="categories" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Categories</p>
              <p className="mt-1 text-sm font-normal text-white/60">
                Labels, order, and visibility for both catalog pages
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <CatalogCategoryFiltersEditor entries={workInsights} onChange={setWorkInsights} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminPageShell>
  )
}
