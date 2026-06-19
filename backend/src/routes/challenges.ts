import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'
import { getDailyChallenges, markComplete } from '../services/challengeService'

const router = Router()
const prisma = new PrismaClient()

// GET /api/challenges/daily — returns 3 personalised challenges for today
router.get('/daily', authenticate, async (req: AuthRequest, res: Response) => {
  const challenges = await getDailyChallenges(req.userId!)
  res.json(challenges)
})

// GET /api/challenges/:id — get a single challenge
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const challenge = await prisma.challenge.findUnique({ where: { id: req.params.id } })
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' })
  res.json(challenge)
})

// POST /api/challenges/:id/complete — mark a challenge as completed
router.post('/:id/complete', authenticate, async (req: AuthRequest, res: Response) => {
  const result = await markComplete(req.userId!, req.params.id)
  res.json(result)
})

export default router
