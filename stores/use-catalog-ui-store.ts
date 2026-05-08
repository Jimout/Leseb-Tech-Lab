'use client'

import { create } from 'zustand'

type CatalogUiState = {
  workActiveId: string
  workPage: number
  insightActiveId: string
  insightPage: number
  setWorkActiveId: (id: string) => void
  setWorkPage: (page: number | ((prev: number) => number)) => void
  setInsightActiveId: (id: string) => void
  setInsightPage: (page: number | ((prev: number) => number)) => void
}

const ALL_FILTER_ID = 'all'

export const useCatalogUiStore = create<CatalogUiState>((set) => ({
  workActiveId: ALL_FILTER_ID,
  workPage: 1,
  insightActiveId: ALL_FILTER_ID,
  insightPage: 1,
  setWorkActiveId: (workActiveId) => set({ workActiveId }),
  setWorkPage: (page) =>
    set((state) => ({
      workPage: typeof page === 'function' ? page(state.workPage) : page,
    })),
  setInsightActiveId: (insightActiveId) => set({ insightActiveId }),
  setInsightPage: (page) =>
    set((state) => ({
      insightPage: typeof page === 'function' ? page(state.insightPage) : page,
    })),
}))
