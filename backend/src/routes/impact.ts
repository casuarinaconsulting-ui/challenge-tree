import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// Public — collective impact across all users (used on the login screen)
router.get('/global', async (_req, res: Response) => {
  try {
    const [agg, memberCount] = await Promise.all([
      prisma.impact.aggregate({
        _sum: { co2Saved: true, waterSaved: true, wasteDiverted: true, totalActions: true },
      }),
      prisma.user.count(),
    ])
    res.json({
      members:       memberCount,
      co2Saved:      agg._sum.co2Saved      ?? 0,
      waterSaved:    agg._sum.waterSaved    ?? 0,
      wasteDiverted: agg._sum.wasteDiverted ?? 0,
      totalActions:  agg._sum.totalActions  ?? 0,
    })
  } catch (err) {
    console.error('Global impact error:', err)
    res.status(500).json({ error: 'Could not load global impact.' })
  }
})

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const records = await prisma.impact.findMany({ where: { userId: req.userId } })
  const totals = records.reduce(
    (acc, r) => ({
      co2Saved:      acc.co2Saved      + r.co2Saved,
      waterSaved:    acc.waterSaved    + r.waterSaved,
      wasteDiverted: acc.wasteDiverted + r.wasteDiverted,
      treesEquiv:    acc.treesEquiv    + r.treesEquiv,
      totalActions:  acc.totalActions  + r.totalActions,
    }),
    { co2Saved: 0, waterSaved: 0, wasteDiverted: 0, treesEquiv: 0, totalActions: 0 }
  )
  res.json(totals)
})

router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
  const history = await prisma.impact.findMany({
    where: { userId: req.userId },
    orderBy: { date: 'desc' },
    take: 30,
  })
  res.json(history)
})

export default router
