import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import authRoutes      from './routes/auth'
import userRoutes      from './routes/user'
import challengeRoutes from './routes/challenges'
import impactRoutes    from './routes/impact'
import badgeRoutes     from './routes/badges'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'Challenge Tree API' }))

app.use('/api/auth',       authRoutes)
app.use('/api/user',       userRoutes)
app.use('/api/challenges', challengeRoutes)
app.use('/api/impact',     impactRoutes)
app.use('/api/badges',     badgeRoutes)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Challenge Tree API running on port ${PORT}`))
}

export default app
