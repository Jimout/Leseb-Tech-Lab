import { NextRequest, NextResponse } from 'next/server'

import { SubscriberStatus } from '@/lib/generated/prisma/client'
import { createRawToken, hashToken } from '@/lib/newsletter-tokens'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/?subscribe=invalid', request.url))
  }

  const tokenHash = hashToken(token)
  const subscriber = await prisma.subscriber.findFirst({
    where: { confirmTokenHash: tokenHash },
  })
  if (!subscriber) {
    return NextResponse.redirect(new URL('/?subscribe=invalid', request.url))
  }

  const rawUnsubscribeToken = createRawToken()
  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: SubscriberStatus.ACTIVE,
      confirmTokenHash: null,
      confirmedAt: new Date(),
      unsubscribeTokenHash: hashToken(rawUnsubscribeToken),
      unsubscribedAt: null,
    },
  })

  return NextResponse.redirect(new URL('/?subscribe=confirmed', request.url))
}
