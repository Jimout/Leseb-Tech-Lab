'use client'

import { create } from 'zustand'

type InsightTocMobileState = {
  open: boolean
  anchorTop: number
  setOpen: (open: boolean) => void
  setAnchorTop: (anchorTop: number) => void
  toggleOpen: () => void
  close: () => void
}

const DEFAULT_ANCHOR_TOP = 100

export const useInsightTocMobileStore = create<InsightTocMobileState>((set) => ({
  open: false,
  anchorTop: DEFAULT_ANCHOR_TOP,
  setOpen: (open) => set({ open }),
  setAnchorTop: (anchorTop) => set({ anchorTop }),
  toggleOpen: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
}))
