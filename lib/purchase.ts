import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const purchaseInputSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  productId: z.string().min(1, 'productId is required'),
})

/**
 * Example usage (access check):
 * const allowed = await hasUserPurchasedProduct(userId, productId)
 * if (!allowed) throw new Error('Access denied')
 */
export async function hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
  const parsed = purchaseInputSchema.parse({ userId, productId })

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_productId: {
        userId: parsed.userId,
        productId: parsed.productId,
      },
    },
    select: { id: true },
  })

  return Boolean(purchase)
}

/**
 * Example usage (post-payment DB write):
 * await createPurchase(userId, productId)
 */
export async function createPurchase(userId: string, productId: string): Promise<void> {
  const parsed = purchaseInputSchema.parse({ userId, productId })

  const [userExists, productExists] = await Promise.all([
    prisma.user.findUnique({ where: { id: parsed.userId }, select: { id: true } }),
    prisma.product.findUnique({ where: { id: parsed.productId }, select: { id: true } }),
  ])

  if (!userExists) {
    throw new Error('User not found')
  }

  if (!productExists) {
    throw new Error('Product not found')
  }

  await prisma.purchase.upsert({
    where: {
      userId_productId: {
        userId: parsed.userId,
        productId: parsed.productId,
      },
    },
    update: {},
    create: {
      userId: parsed.userId,
      productId: parsed.productId,
    },
  })
}

