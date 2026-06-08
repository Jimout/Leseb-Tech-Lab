import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SubscriberStatus } from '@/lib/generated/prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received body:', body)
    
    const { email, notifyWork = true, notifyInsights = true, notifyImportant = true } = body
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    
    // Check if subscriber exists
    const existing = await prisma.subscriber.findUnique({
      where: { email }
    })
    
    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Subscriber already exists',
        subscriber: existing
      }, { status: 200 })
    }
    
    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        status: SubscriberStatus.ACTIVE, // Set to ACTIVE directly for testing
        notifyWork,
        notifyInsights,
        notifyImportant,
        confirmedAt: new Date(), // Set confirmed immediately
      }
    })
    
    console.log('Created subscriber:', subscriber)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscriber added successfully',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
        createdAt: subscriber.createdAt,
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Subscribe error details:', error)
    return NextResponse.json({ 
      error: 'Failed to subscribe',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}