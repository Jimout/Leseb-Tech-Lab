import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
  })
  .passthrough()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      ...data,
    })

    return NextResponse.json({ success: true, message: 'Message received' }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.flatten() },
        { status: 400 },
      )
    }

    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
