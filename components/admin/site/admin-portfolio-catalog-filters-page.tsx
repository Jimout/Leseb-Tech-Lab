'use client'

import { useEffect, useMemo, useState } from 'react'

import { AdminPageSaveCancelActions } from '@/components/admin/admin-page-save-cancel-actions'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  CatalogCategoryFiltersEditor,
  resequenceCatalogFilters,
} from '@/components/admin/site/catalog-filter-editors'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { usePortfolioCatalogFilters } from '@/hooks/use-portfolio-catalog-filters'
import type { PortfolioCatalogFilterEntry } from '@/lib/portfolio-catalog-filters'

export function AdminPortfolioCatalogFiltersPage() {
  const {
    filters: savedFilters,
    ready,
    saving,
    error,
    save,
    add,
  } = usePortfolioCatalogFilters()

  const [workInsights, setWorkInsights] = useState<PortfolioCatalogFilterEntry[]>([])

  useEffect(() => {
    if (!ready) return
    
    // Initialize with saved filters from database
    setWorkInsights(savedFilters && savedFilters.length ? [...savedFilters] : [])
  }, [ready, savedFilters])

  const currentFilters = useMemo(
    () => resequenceCatalogFilters(workInsights.length ? workInsights : savedFilters || []),
    [workInsights, savedFilters],
  )

  const savedSequencedFilters = useMemo(
    () => resequenceCatalogFilters(savedFilters || []),
    [savedFilters],
  )

  const changed = useMemo(
    () => JSON.stringify(currentFilters) !== JSON.stringify(savedSequencedFilters),
    [currentFilters, savedSequencedFilters],
  )

  function resetToSaved() {
    setWorkInsights(savedFilters && savedFilters.length ? [...savedFilters] : [])
  }

  async function saveNow() {
    const saved = await save(currentFilters)
    setWorkInsights([...saved])
  }

  async function handleAddCategory(label: string): Promise<void> {
    await add(label)
    // After adding, refresh the working copy
    setWorkInsights([...savedFilters])
  }

  const hasNoFilters = (!currentFilters || currentFilters.length === 0) && ready && !error

  return (
    <AdminPageShell
      title="Category filters"
      description="One list powers the filter bar on /work and /insights. Counts update from your projects and articles."
      right={
        <AdminPageSaveCancelActions
          changed={changed && ready && !saving}
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
      {error ? (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {hasNoFilters && !saving && (
        <div className="mb-4 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          📝 No categories found. Use the form below to add your first category filter.
        </div>
      )}

      {!ready ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-white/60">
          Loading category filters...
        </div>
      ) : (
        <Accordion 
          type="multiple" 
          defaultValue={currentFilters.length ? ['categories'] : []} 
          className="space-y-3"
        >
          <AccordionItem
            value="categories"
            className="rounded-2xl border border-white/10 bg-white/5 px-0"
          >
            <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
              <div className="text-left">
                <p className="text-sm font-semibold">Categories</p>
                <p className="mt-1 text-sm font-normal text-white/60">
                  Labels, order, and visibility for both catalog pages
                </p>
                {currentFilters.length > 0 && (
                  <p className="mt-1 text-xs text-white/40">
                    Total: {currentFilters.length} categor{currentFilters.length === 1 ? 'y' : 'ies'}
                  </p>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-6 sm:px-6">
              <CatalogCategoryFiltersEditor
                entries={currentFilters}
                onChange={setWorkInsights}
                onAddCategory={handleAddCategory}
                saving={saving}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </AdminPageShell>
  )
}