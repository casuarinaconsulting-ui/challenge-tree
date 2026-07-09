# Challenge Tre3

Free web app by Casuarina Consulting: three personalised daily sustainability challenges, measurable impact (CO2, water, waste, trees), streaks, endangered-species badges, impact milestones, and impact days. Initial market: Europe.

- **Live app:** https://challengetree.casuarinaconsulting.com (also challenge-tree.vercel.app)
- **Landing/marketing domain** is a CNAME on the Wix-managed casuarinaconsulting.com zone; do not touch the apex MX records (Google Workspace mail).

## Stack and deploys

- `frontend/` React + Vite + TypeScript + Tailwind-free inline styles, PWA. Deployed on Vercel (team `casuarina-consulting`, project `frontend`). Deploy: `npx vercel --prod` from `frontend/`.
- `backend/` Express + Prisma + PostgreSQL. Deployed on Railway (project `challenge-tree-backend`, service `backend`, public URL https://backend-production-62a9.up.railway.app). Deploy: `railway up --detach` from `backend/`.
- CORS allowlist comes from the `FRONTEND_URL` Railway env var (comma-separated origins). If a new domain is added, add it there or the whole app breaks for that origin.
- Transactional email: SendGrid via `@sendgrid/mail` (`SENDGRID_API_KEY`, from noreply@casuarinaconsulting.com). Wix DNS cannot host MX on subdomains, which is why Resend/Gmail SMTP were abandoned.
- DB queries from this machine: use `DATABASE_PUBLIC_URL` from the Railway Postgres service (`railway variables --service Postgres --kv`); the internal `postgres.railway.internal` URL is unreachable locally.

## Key facts (verified July 2026)

- 364 challenges across 12 categories in production.
- Demo mode: token `demo-token` short-circuits auth for screen recording.
- Register page has the ecosystem picker (16 ecosystems, skip = deterministic assignment from email).
- Global stats endpoint `/api/impact/global` is public, cached 60s, feeds the login page member count.

## Brand and copy rules (non-negotiable)

- Voice is "we" (Casuarina Consulting), never "I", in all marketing and app copy.
- Never use em or en dashes in any copy; use commas, periods, or rephrase.
- Species framing is honest: badges are species to "meet and learn about", never "protect" (the app raises awareness, it does not fund conservation).
- Always state the app is 100% free, no app store, works in any browser.
- House accountability angle: individual action is the proof and mandate to demand more from the biggest polluters (richest 1% out-emit the poorest 50%).
- Aesthetic: Oswald font, forest green gradient (#205038 to #0c261a), gold #c8952a/#e0b452, cream #fffdf8.

## marketing/

All rollout assets live in `marketing/` (self-contained, has its own package.json with puppeteer; Python scripts need reportlab + pypdf, already installed globally):

- `challenge-tre3-tiktok-brief.md` — the single source of truth: shot list, narrative, safe areas, and final captions for TikTok, Instagram, and LinkedIn (including the algorithm playbook).
- `challenge-tre3-tiktok-storyboard.html` — 13-frame demo storyboard. Regenerate frame PNGs with `node generate-tiktok-frames.js` (full-bleed, `tiktok-frames/`) and `node generate-tiktok-frames-safe.js` (1080x1920 with TikTok safe zones, `tiktok-frames-1080x1920/` — use these in the video).
- `challenge-tre3-linkedin-carousel.html` — 10-slide LinkedIn carousel. `node build-linkedin-carousel.js` renders slide PNGs (and caption-free phone shots), then `python build-carousel-pdf.py` assembles `challenge-tre3-linkedin-carousel.pdf` (the file LinkedIn takes as a document post).
- `challenge-tre3-logo-studio.html`, `-icon.svg`, `-button.svg` — logo assets. `challenge-tre3-challenges.pdf/.xlsx` — full challenge list exports.
- The Casuarina outro sting and other shared brand assets (wordmark, lower-third, intro gif) live in `C:\Users\ramon\casuarina-ai` (that folder is general Casuarina business development, not Challenge Tre3).
