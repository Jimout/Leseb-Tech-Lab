import { NextRequest, NextResponse } from 'next/server'

import { SubscriberStatus } from '@/lib/generated/prisma/client'
import { hashToken, verifyUnsubscribeToken } from '@/lib/newsletter-tokens'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/?subscribe=invalid', request.url))
  }

  const signedSubscriberId = verifyUnsubscribeToken(token)
  const subscriber = signedSubscriberId
    ? await prisma.subscriber.findUnique({ where: { id: signedSubscriberId } })
    : await prisma.subscriber.findFirst({
        where: { unsubscribeTokenHash: hashToken(token) },
      })
  if (!subscriber) {
    return NextResponse.redirect(new URL('/?subscribe=invalid', request.url))
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: SubscriberStatus.UNSUBSCRIBED,
      unsubscribedAt: new Date(),
    },
  })

  return NextResponse.redirect(new URL('/?subscribe=unsubscribed', request.url))
}
