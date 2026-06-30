import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { sendFeedbackEmail } from '../services/emailService'

const router = Router()

const feedbackSchema = z.object({
  message: z.string().trim().min(1).max(5000),
  type:    z.string().trim().max(40).optional(),
  name:    z.string().trim().max(120).optional(),
  email:   z.string().email().max(200).optional().or(z.literal('')),
})

// Public: anyone (including demo and logged-out users) can send feedback.
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = feedbackSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Please include a message.' })

    const { message, type, name, email } = parsed.data
    const ok = await sendFeedbackEmail({ message, type, name, email: email || undefined })
    if (!ok) return res.status(503).json({ error: 'Email is not configured yet.' })
    res.json({ ok: true })
  } catch (err) {
    console.error('Feedback error:', err)
    res.status(502).json({ error: 'Could not send feedback right now.' })
  }
})

export default router
