import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const router = Router()

const registerSchema = z.object({
  email:    z.string().email(),
  name:     z.string().min(1).max(100),
  password: z.string().min(8),
  location: z.string().optional(),
  country:  z.string().optional(),
  language: z.string().default('en'),
})

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string(),
})

function signToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

    const { email, name, password, location, country, language } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, name, passwordHash, location, country, language },
      select: { id: true, email: true, name: true, createdAt: true }
    })

    res.status(201).json({ user, token: signToken(user.id) })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Could not create account. Please try again.' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

    const { email, password } = parsed.data
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    await prisma.user.update({ where: { id: user.id }, data: { lastActive: new Date() } })

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token: signToken(user.id)
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Service temporarily unavailable. Please try again.' })
  }
})

export default router
