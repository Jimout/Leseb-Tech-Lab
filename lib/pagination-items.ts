export type PaginationItem = number | 'ellipsis'

/**
 * Compact page list for large totals: 1, 2, 3, …, last (and windows near the ends / middle).
 */
export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages < 1) return [1]
  if (totalPages === 1) return [1]
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const cp = Math.min(Math.max(1, currentPage), totalPages)

  if (cp <= 3) {
    return [1, 2, 3, 'ellipsis', totalPages]
  }
  if (cp >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, 'ellipsis', cp - 1, cp, cp + 1, 'ellipsis', totalPages]
}
