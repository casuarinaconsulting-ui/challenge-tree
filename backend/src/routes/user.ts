import { Router, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

const profileSchema = z.object({
  name:          z.string().min(1).max(100).optional(),
  location:      z.string().optional(),
  country:       z.string().optional(),
  language:      z.string().optional(),
  incomeLevel:   z.enum(['low', 'medium', 'high']).optional(),
  abilityLevel:  z.enum(['limited', 'moderate', 'full']).optional(),
  timeAvailable: z.number().min(5).max(120).optional(),
  motivations:   z.array(z.string()).optional(),
  preferences:   z.record(z.unknown()).optional(),
})

router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true, email: true, name: true, location: true, country: true,
      language: true, incomeLevel: true, abilityLevel: true,
      timeAvailable: true, motivations: true, preferences: true,
      streakCount: true, longestStreak: true, lastActive: true, createdAt: true
    }
  })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  const parsed = profileSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: parsed.data,
    select: { id: true, email: true, name: true, incomeLevel: true, abilityLevel: true }
  })
  res.json(user)
})

export default router
