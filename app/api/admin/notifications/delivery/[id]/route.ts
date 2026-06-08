import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { isAllowedAdminSession } from '@/lib/admin-guard'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || !(await isAllowedAdminSession(session))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { id } = await params
    
    // Delete the delivery record
    await prisma.notificationDelivery.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete delivery:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}