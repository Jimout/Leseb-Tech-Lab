import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SubscriberStatus } from '@/lib/generated/prisma/client'
import { authOptions } from '@/lib/auth'
import { isAllowedAdminSession } from '@/lib/admin-guard'

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
    const { email, status = 'ACTIVE', notifyWork = true, notifyInsights = true, notifyImportant = true } = body
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    // Check if subscriber exists
    const existing = await prisma.subscriber.findUnique({
      where: { email }
    })
    
    let subscriber
    
    if (existing) {
      // Update existing
      subscriber = await prisma.subscriber.update({
        where: { email },
        data: {
          status: SubscriberStatus[status as keyof typeof SubscriberStatus],
          notifyWork,
          notifyInsights,
          notifyImportant,
          confirmedAt: status === 'ACTIVE' ? new Date() : existing.confirmedAt,
        }
      })
    } else {
      // Create new
      subscriber = await prisma.subscriber.create({
        data: {
          email,
          status: SubscriberStatus[status as keyof typeof SubscriberStatus],
          notifyWork,
          notifyInsights,
          notifyImportant,
          confirmedAt: status === 'ACTIVE' ? new Date() : null,
        }
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
        notifyWork: subscriber.notifyWork,
        notifyInsights: subscriber.notifyInsights,
        notifyImportant: subscriber.notifyImportant,
        confirmedAt: subscriber.confirmedAt,
        createdAt: subscriber.createdAt,
      }
    })
    
  } catch (error) {
    console.error('Direct add error:', error)
    return NextResponse.json({ 
      error: 'Failed to add/update subscriber',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}