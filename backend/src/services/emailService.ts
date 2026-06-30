import { Resend } from 'resend'

// Sender identity. Once your domain is verified in Resend, set EMAIL_FROM to an
// address on it, e.g. "Challenge Tre3 <noreply@casuarinaconsulting.com>". Until
// then it falls back to Resend's shared onboarding domain, which only delivers
// to the email that owns the Resend account (fine for a first smoke test).
const FROM     = process.env.EMAIL_FROM     || 'Challenge Tre3 <onboarding@resend.dev>'
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'casuarinaconsulting@gmail.com'

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

// Single send path for every email. It no-ops (with a log) when no API key is
// set, so the rest of the app keeps working even before email is configured.
async function send(opts: { to: string; subject: string; html: string; text: string; replyTo?: string }): Promise<boolean> {
  const resend = getResend()
  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set, skipping "${opts.subject}" to ${opts.to}`)
    return false
  }
  const { error } = await resend.emails.send({
    from: FROM,
    to: opts.to,
    replyTo: opts.replyTo ?? REPLY_TO,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  })
  if (error) throw new Error((error as { message?: string })?.message || 'Resend send failed')
  return true
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Challenge Tree</title>
</head>
<body style="margin:0;padding:0;background:#f5efe6;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1b4332;border-radius:20px 20px 0 0;padding:40px 48px 32px;text-align:center;">
              <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(149,213,178,0.7);margin-bottom:10px;">
                CASUARINA CONSULTING
              </div>
              <div style="font-family:Arial,sans-serif;font-size:32px;font-weight:900;color:#fff;letter-spacing:-0.5px;">
                🌿 Challenge Tree
              </div>
              <div style="width:48px;height:2px;background:linear-gradient(90deg,#52b788,#c8952a);margin:18px auto 0;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;padding:40px 48px;">

              <p style="font-size:16px;color:#1b4332;margin:0 0 8px;font-family:Arial,sans-serif;font-weight:700;letter-spacing:0.04em;">
                Dear ${name},
              </p>

              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 20px;">
                Thank you for signing up for <strong style="color:#1b4332;">Challenge Tree</strong>.
              </p>

              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 20px;">
                We know the climate crisis can feel overwhelming. It's easy to think that individual actions don't matter, that the scale of the problem is too large for one person to make a difference. But that's simply not true. Every mindful choice, every small shift in behaviour, and every conversation you start adds to a wave of collective change.
              </p>

              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 20px;">
                Challenge Tree is designed to make sustainability <em>practical, achievable, and even fun</em>. Each day, you'll receive three challenges, simple actions that fit into your life, wherever you are and whatever your circumstances. Over time, these small steps add up to meaningful impact.
              </p>

              <!-- Callout box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background:#f0faf4;border-left:4px solid #52b788;border-radius:0 12px 12px 0;padding:18px 22px;">
                    <p style="font-size:14px;color:#1b4332;line-height:1.7;margin:0;font-style:italic;">
                      We hope this becomes more than just an app for you. We hope it becomes a daily reminder that you are part of something bigger, a community of people choosing to act, learn, and grow together.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 20px;">
                Share Challenge Tree with your friends, family, and colleagues. The more of us who take part, the greater our collective impact.
              </p>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://challengetree.casuarinaconsulting.com"
                       style="display:inline-block;background:linear-gradient(135deg,#2d6a4f,#1b4332);color:#fff;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:15px 36px;border-radius:12px;box-shadow:0 4px 16px rgba(27,67,50,0.3);">
                      Open Challenge Tree →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 20px;">
                To stay connected with our broader work, follow <strong style="color:#1b4332;">Casuarina Consulting</strong> on TikTok and LinkedIn for insights, stories, and inspiration.
              </p>

              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 8px;">
                If you have any questions, feedback, or ideas, please don't hesitate to reach out:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="padding:4px 0;">
                    <span style="font-size:14px;color:#374151;">✉️ &nbsp;</span>
                    <a href="mailto:casuarinaconsulting@gmail.com" style="font-size:14px;color:#1b4332;font-weight:600;">casuarinaconsulting@gmail.com</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;">
                    <span style="font-size:14px;color:#374151;">🌐 &nbsp;</span>
                    <a href="https://casuarinaconsulting.com" style="font-size:14px;color:#1b4332;font-weight:600;">casuarinaconsulting.com</a>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 32px;">
                Thank you for being the change you want to see in the world. We're honoured to have you with us.
              </p>

              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 4px;">Warm regards,</p>
              <p style="font-size:15px;color:#1b4332;font-weight:700;margin:0;">The Challenge Tree Team</p>
              <p style="font-size:13px;color:#6b7280;margin:4px 0 0;">Casuarina Consulting</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1b4332;border-radius:0 0 20px 20px;padding:24px 48px;text-align:center;">
              <p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(149,213,178,0.55);letter-spacing:0.18em;text-transform:uppercase;margin:0 0 6px;">
                Casuarina Consulting &nbsp;·&nbsp;
                <a href="https://casuarinaconsulting.com" style="color:rgba(149,213,178,0.55);text-decoration:none;">casuarinaconsulting.com</a>
              </p>
              <p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(149,213,178,0.35);margin:0;">
                You received this email because you signed up for Challenge Tree.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()

  const text = `
Dear ${name},

Thank you for signing up for Challenge Tree.

We know the climate crisis can feel overwhelming. It's easy to think that individual actions don't matter, that the scale of the problem is too large for one person to make a difference. But that's simply not true. Every mindful choice, every small shift in behaviour, and every conversation you start adds to a wave of collective change.

Challenge Tree is designed to make sustainability practical, achievable, and even fun. Each day, you'll receive three challenges, simple actions that fit into your life, wherever you are and whatever your circumstances. Over time, these small steps add up to meaningful impact.

We hope this becomes more than just an app for you. We hope it becomes a daily reminder that you are part of something bigger, a community of people choosing to act, learn, and grow together.

Share Challenge Tree with your friends, family, and colleagues. The more of us who take part, the greater our collective impact.

To stay connected with our broader work, follow Casuarina Consulting on TikTok and LinkedIn for insights, stories, and inspiration. And if you have any questions, feedback, or ideas, please don't hesitate to reach out to us at casuarinaconsulting@gmail.com. Also visit our website casuarinaconsulting.com.

Thank you for being the change you want to see in the world. We're honoured to have you with us.

Warm regards,
The Challenge Tree Team
Casuarina Consulting
  `.trim()

  await send({
    to,
    subject: 'Welcome to Challenge Tree, Your Daily Sustainability Journey Begins',
    text,
    html,
  })

  console.log(`[email] Welcome email sent to ${to}`)
}

export async function sendPasswordResetEmail(to: string, name: string, tempPassword: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your Challenge Tree password</title>
</head>
<body style="margin:0;padding:0;background:#f5efe6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1b4332;border-radius:20px 20px 0 0;padding:40px 48px 32px;text-align:center;">
              <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(149,213,178,0.7);margin-bottom:10px;">
                CASUARINA CONSULTING
              </div>
              <div style="font-family:Arial,sans-serif;font-size:32px;font-weight:900;color:#fff;letter-spacing:-0.5px;">
                🌿 Challenge Tree
              </div>
              <div style="width:48px;height:2px;background:linear-gradient(90deg,#52b788,#c8952a);margin:18px auto 0;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;padding:40px 48px;">
              <p style="font-size:16px;color:#1b4332;margin:0 0 8px;font-family:Arial,sans-serif;font-weight:700;letter-spacing:0.04em;">
                Dear ${name},
              </p>
              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 20px;">
                We received a request to reset the password for your Challenge Tree account. We've generated a temporary password for you below.
              </p>

              <!-- Temp password box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td align="center" style="background:#f0faf4;border:2px dashed #52b788;border-radius:14px;padding:24px;">
                    <div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#2d6a4f;margin-bottom:10px;">
                      Your temporary password
                    </div>
                    <div style="font-family:'Courier New',monospace;font-size:28px;font-weight:700;letter-spacing:3px;color:#1b4332;">
                      ${tempPassword}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;color:#374151;line-height:1.75;margin:0 0 20px;">
                Here's what to do next:
              </p>
              <ol style="font-size:15px;color:#374151;line-height:1.85;margin:0 0 24px;padding-left:20px;">
                <li>Sign in using this temporary password.</li>
                <li>Go to your <strong style="color:#1b4332;">Profile</strong> page.</li>
                <li>Choose <strong style="color:#1b4332;">Change Password</strong> and set a new password you'll remember.</li>
              </ol>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td align="center">
                    <a href="https://challengetree.casuarinaconsulting.com"
                       style="display:inline-block;background:linear-gradient(135deg,#2d6a4f,#1b4332);color:#fff;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:15px 36px;border-radius:12px;box-shadow:0 4px 16px rgba(27,67,50,0.3);">
                      Sign in now →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#9ca3af;line-height:1.7;margin:24px 0 0;">
                If you didn't request this, you can safely ignore this email, but we'd recommend signing in and changing your password as a precaution. Questions? Reach us at
                <a href="mailto:casuarinaconsulting@gmail.com" style="color:#2d6a4f;">casuarinaconsulting@gmail.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1b4332;border-radius:0 0 20px 20px;padding:24px 48px;text-align:center;">
              <p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(149,213,178,0.55);letter-spacing:0.18em;text-transform:uppercase;margin:0;">
                Casuarina Consulting &nbsp;·&nbsp;
                <a href="https://casuarinaconsulting.com" style="color:rgba(149,213,178,0.55);text-decoration:none;">casuarinaconsulting.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
Dear ${name},

We received a request to reset the password for your Challenge Tree account.

Your temporary password is: ${tempPassword}

What to do next:
1. Sign in using this temporary password at https://challengetree.casuarinaconsulting.com
2. Go to your Profile page.
3. Choose "Change Password" and set a new password you'll remember.

If you didn't request this, you can safely ignore this email, but we'd recommend signing in and changing your password as a precaution.

Questions? Reach us at casuarinaconsulting@gmail.com.

Warm regards,
The Challenge Tree Team
Casuarina Consulting
  `.trim()

  await send({
    to,
    subject: 'Reset your Challenge Tree password',
    text,
    html,
  })

  console.log(`[email] Password reset email sent to ${to}`)
}

// ── Feedback submitted from the app's Profile page ──
export async function sendFeedbackEmail(input: {
  message: string
  type?: string
  name?: string
  email?: string
}): Promise<boolean> {
  const to   = process.env.FEEDBACK_TO || 'casuarinaconsulting@gmail.com'
  const type = input.type?.trim() || 'Feedback'
  const from = [input.name, input.email].filter(Boolean).join(' · ') || 'Anonymous'
  const esc  = (s: string) => s.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))

  const subject = `Challenge Tre3 feedback · ${type}`
  const text = `${input.message}\n\nFrom: ${from}\nType: ${type}\nSent from Challenge Tre3`
  const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
  <div style="background:#1b4332;border-radius:16px 16px 0 0;padding:22px 26px;">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(149,213,178,0.7);">Casuarina Consulting</div>
    <div style="font-size:20px;font-weight:800;color:#fff;margin-top:4px;">Challenge Tre3 feedback</div>
  </div>
  <div style="background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 16px 16px;padding:24px 26px;">
    <table style="width:100%;font-size:13px;color:#374151;margin-bottom:16px;">
      <tr><td style="color:#9ca3af;padding:3px 0;">Type</td><td style="text-align:right;font-weight:600;color:#1b4332;">${esc(type)}</td></tr>
      <tr><td style="color:#9ca3af;padding:3px 0;">From</td><td style="text-align:right;">${esc(from)}</td></tr>
    </table>
    <div style="background:#f0faf4;border-left:4px solid #52b788;border-radius:0 10px 10px 0;padding:16px 18px;font-size:15px;color:#1b4332;line-height:1.7;white-space:pre-wrap;">${esc(input.message)}</div>
  </div>
</div>`.trim()

  // Reply-to the user when they left an address, so a reply reaches them directly.
  const ok = await send({ to, subject, text, html, replyTo: input.email || undefined })
  if (ok) console.log(`[email] Feedback email sent to ${to}`)
  return ok
}
