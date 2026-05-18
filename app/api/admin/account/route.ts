import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getAdminSession } from '@/lib/admin/require-admin-session'
import { updateUserAccount } from '@/lib/admin/user-auth'

const patchSchema = z.object({
  currentPassword: z.string().min(1),
  email: z.string().trim().email().optional(),
  newPassword: z.string().min(1).optional(),
})

export async function GET() {
  const session = await getAdminSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  })
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const result = await updateUserAccount({
    userId: session.user.id,
    currentPassword: parsed.data.currentPassword,
    email: parsed.data.email,
    newPassword: parsed.data.newPassword,
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({
    user: result.user,
    message: 'Account updated. Sign in again if you changed your email or password.',
  })
}
