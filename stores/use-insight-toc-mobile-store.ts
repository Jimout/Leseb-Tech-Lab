'use client'

import { create } from 'zustand'

type InsightTocMobileState = {
  open: boolean
  setOpen: (open: boolean) => void
  toggleOpen: () => void
  close: () => void
}

export const useInsightTocMobileStore = create<InsightTocMobileState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggleOpen: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
}))
