import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: req.userId },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' }
  })
  res.json(userBadges)
})

export default router
