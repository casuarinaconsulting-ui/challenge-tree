import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

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
