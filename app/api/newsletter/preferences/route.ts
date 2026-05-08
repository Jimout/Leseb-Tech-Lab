import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { SubscriberStatus } from '@/lib/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { verifyPreferencesToken } from '@/lib/newsletter-tokens'

export const runtime = 'nodejs'

const preferencesSchema = z.object({
  notifyWork: z.boolean(),
  notifyInsights: z.boolean(),
  notifyImportant: z.boolean(),
})

function parseSubscriberIdFromRequest(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return null
  return verifyPreferencesToken(token)
}

export async function GET(request: NextRequest) {
  const subscriberId = parseSubscriberIdFromRequest(request)
  if (!subscriberId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { id: subscriberId },
    select: {
      id: true,
      email: true,
      status: true,
      notifyWork: true,
      notifyInsights: true,
      notifyImportant: true,
    },
  })
  if (!subscriber) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })

  return NextResponse.json({ subscriber })
}

export async function PUT(request: NextRequest) {
  const subscriberId = parseSubscriberIdFromRequest(request)
  if (!subscriberId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const payload = preferencesSchema.parse(body)

  const subscriber = await prisma.subscriber.update({
    where: { id: subscriberId },
    data: {
      notifyWork: payload.notifyWork,
      notifyInsights: payload.notifyInsights,
      notifyImportant: payload.notifyImportant,
      status: SubscriberStatus.ACTIVE,
      unsubscribedAt: null,
    },
    select: {
      id: true,
      email: true,
      status: true,
      notifyWork: true,
      notifyInsights: true,
      notifyImportant: true,
    },
  })

  return NextResponse.json({ subscriber })
}
