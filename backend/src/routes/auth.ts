import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// Generates a friendly, readable temporary password e.g. "Leaf-7392"
function generateTempPassword(): string {
  const words = ['Leaf', 'River', 'Forest', 'Coral', 'Bloom', 'Tide', 'Stone', 'Fern', 'Cloud', 'Grove']
  const word  = words[Math.floor(Math.random() * words.length)]
  const num   = Math.floor(1000 + Math.random() * 9000)
  return `${word}-${num}`
}

const registerSchema = z.object({
  email:       z.string().email(),
  name:        z.string().min(1).max(100),
  password:    z.string().min(8),
  location:    z.string().optional(),
  country:     z.string().optional(),
  language:    z.string().default('en'),
  preferences: z.record(z.unknown()).optional(),
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

    const { email, name, password, location, country, language, preferences } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, name, passwordHash, location, country, language, ...(preferences ? { preferences: preferences as any } : {}) },
      select: { id: true, email: true, name: true, createdAt: true }
    })

    // Non-blocking, email failure must never prevent registration
    sendWelcomeEmail(user.email, user.name).catch(err =>
      console.error('[email] Welcome email failed:', err.message)
    )

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

const forgotSchema = z.object({ email: z.string().email() })

router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const parsed = forgotSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Please enter a valid email address.' })

    const { email } = parsed.data
    const user = await prisma.user.findUnique({ where: { email } })

    // Only reset + email if the user actually exists, but always return the same
    // generic response so we never reveal which emails are registered.
    if (user) {
      const tempPassword = generateTempPassword()
      const passwordHash = await bcrypt.hash(tempPassword, 12)
      await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

      await sendPasswordResetEmail(user.email, user.name, tempPassword).catch(err =>
        console.error('[email] Password reset email failed:', err.message)
      )
    }

    res.json({ message: 'If that email is registered, a temporary password is on its way.' })
  } catch (err) {
    console.error('Forgot-password error:', err)
    res.status(500).json({ error: 'Could not process the request. Please try again.' })
  }
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8),
})

router.post('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Your new password must be at least 8 characters.' })
    }

    const { currentPassword, newPassword } = parsed.data
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (!user) return res.status(404).json({ error: 'Account not found.' })

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Your current password is incorrect.' })

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

    res.json({ message: 'Password updated successfully.' })
  } catch (err) {
    console.error('Change-password error:', err)
    res.status(500).json({ error: 'Could not update your password. Please try again.' })
  }
})

export default router
