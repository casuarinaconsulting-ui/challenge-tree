import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: req.userId },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' }
  })
  res.json(userBadges)
})

export default router
