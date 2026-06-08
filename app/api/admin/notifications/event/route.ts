import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { isAllowedAdminSession } from '@/lib/admin-guard'
import { createNotificationEvent } from '@/lib/notifications/service'
import { dispatchPendingNotifications } from '@/lib/notifications/service'
import { NotificationType } from '@/lib/generated/prisma/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (!(await isAllowedAdminSession(session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  try {
    const body = await request.json()
    const { type, title, summary, url, entityId, dispatchNow } = body
    
    if (!title || title.trim().length < 2) {
      return NextResponse.json(
        { error: 'Title is required and must be at least 2 characters' },
        { status: 400 }
      )
    }
    
    // Create the event using your service
    const event = await createNotificationEvent({
      type: type || NotificationType.IMPORTANT_UPDATE,
      title: title.trim(),
      summary: summary?.trim(),
      url: url?.trim() || '/',
      entityId: entityId || null,
    })
    
    // Optionally dispatch immediately
    if (dispatchNow) {
      // Fire and forget - don't await
      dispatchPendingNotifications().catch(console.error)
    }
    
    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        type: event.type,
        title: event.title,
        summary: event.summary,
        url: event.url,
        createdAt: event.createdAt,
      },
    })
  } catch (error) {
    console.error('POST /api/notifications/event:', error)
    return NextResponse.json(
      { error: 'Failed to create notification event' },
      { status: 500 }
    )
  }
}