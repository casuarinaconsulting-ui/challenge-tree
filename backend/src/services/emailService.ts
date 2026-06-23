import nodemailer from 'nodemailer'

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const transporter = createTransporter()
  if (!transporter) {
    console.log('[email] EMAIL_USER/EMAIL_PASS not set — skipping welcome email')
    return
  }

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
                Challenge Tree is designed to make sustainability <em>practical, achievable, and even fun</em>. Each day, you'll receive three challenges — simple actions that fit into your life, wherever you are and whatever your circumstances. Over time, these small steps add up to meaningful impact.
              </p>

              <!-- Callout box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background:#f0faf4;border-left:4px solid #52b788;border-radius:0 12px 12px 0;padding:18px 22px;">
                    <p style="font-size:14px;color:#1b4332;line-height:1.7;margin:0;font-style:italic;">
                      We hope this becomes more than just an app for you. We hope it becomes a daily reminder that you are part of something bigger — a community of people choosing to act, learn, and grow together.
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
                    <a href="https://challenge-tree.vercel.app"
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

Challenge Tree is designed to make sustainability practical, achievable, and even fun. Each day, you'll receive three challenges — simple actions that fit into your life, wherever you are and whatever your circumstances. Over time, these small steps add up to meaningful impact.

We hope this becomes more than just an app for you. We hope it becomes a daily reminder that you are part of something bigger — a community of people choosing to act, learn, and grow together.

Share Challenge Tree with your friends, family, and colleagues. The more of us who take part, the greater our collective impact.

To stay connected with our broader work, follow Casuarina Consulting on TikTok and LinkedIn for insights, stories, and inspiration. And if you have any questions, feedback, or ideas, please don't hesitate to reach out to us at casuarinaconsulting@gmail.com. Also visit our website casuarinaconsulting.com.

Thank you for being the change you want to see in the world. We're honoured to have you with us.

Warm regards,
The Challenge Tree Team
Casuarina Consulting
  `.trim()

  await transporter.sendMail({
    from: `"Challenge Tree" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to Challenge Tree – Your Daily Sustainability Journey Begins',
    text,
    html,
  })

  console.log(`[email] Welcome email sent to ${to}`)
}

export async function sendPasswordResetEmail(to: string, name: string, tempPassword: string): Promise<void> {
  const transporter = createTransporter()
  if (!transporter) {
    console.log('[email] EMAIL_USER/EMAIL_PASS not set — skipping reset email')
    return
  }

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
                    <a href="https://challenge-tree.vercel.app"
                       style="display:inline-block;background:linear-gradient(135deg,#2d6a4f,#1b4332);color:#fff;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:15px 36px;border-radius:12px;box-shadow:0 4px 16px rgba(27,67,50,0.3);">
                      Sign in now →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#9ca3af;line-height:1.7;margin:24px 0 0;">
                If you didn't request this, you can safely ignore this email — but we'd recommend signing in and changing your password as a precaution. Questions? Reach us at
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
1. Sign in using this temporary password at https://challenge-tree.vercel.app
2. Go to your Profile page.
3. Choose "Change Password" and set a new password you'll remember.

If you didn't request this, you can safely ignore this email — but we'd recommend signing in and changing your password as a precaution.

Questions? Reach us at casuarinaconsulting@gmail.com.

Warm regards,
The Challenge Tree Team
Casuarina Consulting
  `.trim()

  await transporter.sendMail({
    from: `"Challenge Tree" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset your Challenge Tree password',
    text,
    html,
  })

  console.log(`[email] Password reset email sent to ${to}`)
}
