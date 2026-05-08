import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { NotificationType } from '@/lib/generated/prisma/client'
import { isAllowedAdminSession } from '@/lib/admin-guard'
import { authOptions } from '@/lib/auth'
import { createNotificationEvent, dispatchPendingNotifications } from '@/lib/notifications/service'

const eventSchema = z.object({
  type: z.nativeEnum(NotificationType),
  title: z.string().min(2),
  summary: z.string().optional(),
  url: z.string().min(1),
  entityId: z.string().optional(),
  dispatchNow: z.boolean().optional().default(true),
})

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isAllowedAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const payload = eventSchema.parse(body)
    const event = await createNotificationEvent({
      type: payload.type,
      title: payload.title,
      summary: payload.summary,
      url: payload.url,
      entityId: payload.entityId,
    })
    const dispatch = payload.dispatchNow ? await dispatchPendingNotifications() : null
    return NextResponse.json({ event, dispatch }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.flatten() }, { status: 400 })
    }
    console.error('POST /api/notifications/event', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
