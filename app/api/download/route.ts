import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { generateSignedPrivateDownloadUrl } from '@/lib/cloudinary'
import { hasUserPurchasedProduct } from '@/lib/purchase'
import { prisma } from '@/lib/prisma'

const querySchema = z.object({
  productId: z.string().min(1, 'productId is required'),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const parsedQuery = querySchema.safeParse({
      productId: request.nextUrl.searchParams.get('productId'),
    })

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedQuery.error.flatten() },
        { status: 400 },
      )
    }

    const { productId } = parsedQuery.data
    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const purchased = await hasUserPurchasedProduct(user.id, productId)
    if (!purchased) {
      return NextResponse.json({ error: 'You have not purchased this product' }, { status: 403 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { filePublicId: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const signedUrl = generateSignedPrivateDownloadUrl(product.filePublicId)
    return NextResponse.json({ url: signedUrl }, { status: 200 })
  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

