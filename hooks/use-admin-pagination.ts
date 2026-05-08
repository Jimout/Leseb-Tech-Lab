'use client'

import * as React from 'react'

export function useAdminPagination(opts: { totalItems: number; pageSize?: number }) {
  const basePageSize = opts.pageSize ?? 5
  const [isLargeDesktop, setIsLargeDesktop] = React.useState(false)
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(min-width: 1536px)')
    const update = () => setIsLargeDesktop(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  const pageSize = isLargeDesktop ? 10 : basePageSize

  const totalPages = Math.max(1, Math.ceil(opts.totalItems / pageSize))

  React.useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages])

  const start = (page - 1) * pageSize
  const end = start + pageSize

  return { page, setPage, pageSize, totalPages, start, end }
}

