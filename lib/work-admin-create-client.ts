import { createWorkRowInStorage } from '@/lib/frontend-content'
import { isAdminLoggedIn } from '@/lib/frontend-auth'
import type { WorkRow } from '@/lib/work-admin-types'

export async function createWorkRowClient(
  row: WorkRow,
): Promise<{ ok: true; row: WorkRow } | { ok: false; error: string }> {
  if (!isAdminLoggedIn()) {
    return { ok: false, error: 'Session expired. Please log in again.' }
  }

  try {
    const created = createWorkRowInStorage(row)
    return { ok: true, row: created }
  } catch {
    return { ok: false, error: 'Failed to create work item.' }
  }
}
