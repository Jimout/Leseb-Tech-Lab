import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SubscriberStatus } from '@/lib/generated/prisma/client'
import jwt from 'jsonwebtoken'

const SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

function verifyConfirmToken(token: string): { subscriberId: string } | null {
  try {
    const decoded = jwt.verify(token, SECRET) as any
    if (decoded.type === 'confirm' && decoded.subscriberId) {
      return { subscriberId: decoded.subscriberId }
    }
    return null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    
    if (!token) {
      return new Response('Missing token', { status: 400 })
    }
    
    const payload = verifyConfirmToken(token)
    if (!payload) {
      return new Response('Invalid or expired token', { status: 400 })
    }
    
    // Update subscriber status to ACTIVE
    await prisma.subscriber.update({
      where: { id: payload.subscriberId },
      data: {
        status: SubscriberStatus.ACTIVE,
        confirmedAt: new Date(),
      },
    })
    
    // Redirect to success page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Subscription Confirmed</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f4f4f5; }
            .container { text-align: center; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #111827; margin-bottom: 0.5rem; }
            p { color: #4b5563; margin-bottom: 1.5rem; }
            a { color: #facc15; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Subscription Confirmed!</h1>
            <p>You're now subscribed to Leseb updates.</p>
            <a href="/">Return to Home</a>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
    
  } catch (error) {
    console.error('Confirm error:', error)
    return new Response('Failed to confirm subscription', { status: 500 })
  }
}