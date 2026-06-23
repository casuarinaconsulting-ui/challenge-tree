import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'
import { getDailyChallenges, markComplete, swapChallenge } from '../services/challengeService'

const router = Router()

// Client sends Date.getTimezoneOffset() (minutes) so "today" resets at the
// user's local midnight, not the server's UTC midnight.
const tzOffset = (req: AuthRequest) => {
  const v = Number(req.query.tz)
  return Number.isFinite(v) ? v : 0
}

// GET /api/challenges/daily — returns 3 personalised challenges for today
router.get('/daily', authenticate, async (req: AuthRequest, res: Response) => {
  const challenges = await getDailyChallenges(req.userId!, tzOffset(req))
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
  const result = await markComplete(req.userId!, req.params.id, tzOffset(req))
  res.json(result)
})

// POST /api/challenges/:id/swap — replace an incomplete challenge with a fresh one
router.post('/:id/swap', authenticate, async (req: AuthRequest, res: Response) => {
  const result = await swapChallenge(req.userId!, req.params.id, tzOffset(req))
  res.json(result)
})

export default router
