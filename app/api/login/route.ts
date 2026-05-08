import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { encodeSessionHeader } from '@/lib/session-header-server'

const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid login credentials' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, email: true, name: true, password: true },
  })

  if (!user?.password) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const validPassword = await bcrypt.compare(parsed.data.password, user.password)
  if (!validPassword) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const sessionHeader = encodeSessionHeader({
    id: user.id,
    email: user.email,
    name: user.name,
  })

  const response = NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
    { status: 200 },
  )

  response.headers.set('x-session', sessionHeader)
  return response
}
