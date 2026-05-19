export type PaginationItem = number | 'ellipsis'

/**
 * Compact page list for large totals: 1, 2, …, last (and a single current page in the middle).
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

  if (cp <= 2) {
    return [1, 2, 'ellipsis', totalPages]
  }
  if (cp === 3) {
    return [1, 'ellipsis', 3, 'ellipsis', totalPages]
  }
  if (cp >= totalPages - 1) {
    return [1, 'ellipsis', totalPages - 1, totalPages]
  }
  if (cp === totalPages - 2) {
    return [1, 'ellipsis', totalPages - 2, 'ellipsis', totalPages]
  }
  return [1, 'ellipsis', cp, 'ellipsis', totalPages]
}
