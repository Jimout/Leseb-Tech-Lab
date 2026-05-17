import { getSessionHeaderFromStorage } from '@/lib/session-header-client'
import type { WorkRow } from '@/lib/work-admin-types'

export async function createWorkRowClient(
  row: WorkRow,
): Promise<{ ok: true; row: WorkRow } | { ok: false; error: string }> {
  const sessionHeader = getSessionHeaderFromStorage()
  if (!sessionHeader) {
    return { ok: false, error: 'Session expired. Please log in again.' }
  }

  try {
    const res = await fetch('/api/admin/work-rows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-session': sessionHeader },
      body: JSON.stringify(row),
    })
    if (!res.ok) {
      const message =
        res.status === 401 || res.status === 403
          ? 'Session expired. Please log in again.'
          : 'Failed to create work item.'
      return { ok: false, error: message }
    }
    const data = (await res.json()) as { row?: WorkRow }
    if (!data.row) return { ok: false, error: 'Failed to create work item.' }
    return { ok: true, row: data.row }
  } catch {
    return { ok: false, error: 'Network error while creating work item.' }
  }
}
