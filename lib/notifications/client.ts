//lib/notifications/client.ts
import type { NotificationTypeValue } from '@/lib/notifications/constants'

type CreateClientEventInput = {
  type: NotificationTypeValue
  title: string
  summary?: string
  url: string
  entityId?: string
}

type CreateClientEventResult = {
  ok: boolean
  status: number
  error?: string
}

/**
 * Fire-and-forget event creation from client admin pages.
 * Uses keepalive so navigation right after save still sends.
 */
export async function createNotificationEventClient(
  input: CreateClientEventInput,
): Promise<CreateClientEventResult> {
  try {
    const response = await fetch('/api/notifications/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, dispatchNow: true }),
      keepalive: true,
    })
    if (response.ok) {
      return { ok: true, status: response.status }
    }

    let error = 'Notification request failed.'
    try {
      const data = (await response.json()) as { error?: string }
      if (typeof data.error === 'string' && data.error.trim()) error = data.error
    } catch {
      // Keep fallback error when body is not JSON.
    }
    return { ok: false, status: response.status, error }
  } catch {
    // Non-blocking for authoring flow.
    return { ok: false, status: 0, error: 'Network error while sending notification request.' }
  }
}
