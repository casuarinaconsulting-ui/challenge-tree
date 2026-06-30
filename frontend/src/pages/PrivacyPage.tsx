import { useNavigate } from 'react-router-dom'

const UPDATED = '29 June 2026'

type Block = { p: string } | { ul: string[] }
type Section = { title: string; blocks: Block[] }

const SECTIONS: Section[] = [
  {
    title: 'Information we collect',
    blocks: [
      { p: 'We collect only what we need to run Challenge Tre3 for you:' },
      { ul: [
        'Account details you provide: your name, email address, and optionally your country.',
        'Your preferences: the ecosystem you choose and the settings that tailor your daily challenges, such as available time, budget level, and ability level.',
        'Your activity: challenges assigned and completed, streaks, badges, and your estimated impact (CO2, water, and waste savings).',
        'Feedback you choose to send us through the app.',
        'Basic technical data needed to run the service, such as your time zone.',
      ] },
    ],
  },
  {
    title: 'How we use your data',
    blocks: [
      { ul: [
        'To provide the app: sign you in, set your daily challenges, and track your streaks, badges, and impact.',
        'To personalise challenges to your circumstances.',
        'To send a temporary password when you request a password reset.',
        'To read and respond to feedback you send us.',
      ] },
      { p: 'We do not sell your data, and we do not use advertising trackers.' },
    ],
  },
  {
    title: 'Legal basis (UK and EEA)',
    blocks: [
      { ul: [
        'Performance of a contract: providing the app you asked to use.',
        'Consent: where you give it, such as agreeing to this policy at sign-up or sending feedback. You can withdraw consent at any time.',
        'Legitimate interests: keeping the service secure and working well.',
      ] },
    ],
  },
  {
    title: 'Cookies and local storage',
    blocks: [
      { p: "We use your browser's local storage to keep you signed in and to remember your progress on your device. This is essential to the app working. We do not use cookies for advertising or third-party tracking." },
    ],
  },
  {
    title: 'Who we share data with',
    blocks: [
      { p: 'We rely on a few trusted providers who process data on our behalf:' },
      { ul: [
        'Vercel, which hosts the app.',
        'Railway, which hosts our backend and database.',
        'Resend, which sends transactional emails such as password resets.',
      ] },
      { p: 'We do not sell your personal data.' },
    ],
  },
  {
    title: 'International transfers',
    blocks: [
      { p: "Our providers may process data on servers outside your country, including in the United States. Where data leaves the UK or EEA, we rely on appropriate safeguards such as our providers' standard contractual clauses." },
    ],
  },
  {
    title: 'Data retention',
    blocks: [
      { p: 'We keep your account data while your account is active. If you ask us to delete your account, we remove your personal data, except anything we are legally required to keep.' },
    ],
  },
  {
    title: 'Your rights',
    blocks: [
      { p: 'If you are in the UK or EEA, you can ask to access, correct, delete, or export your data, object to or restrict some processing, and withdraw consent. To do any of these, email casuarinaconsulting@gmail.com. You can also complain to your local data protection authority.' },
    ],
  },
  {
    title: 'Children',
    blocks: [
      { p: 'Challenge Tre3 is not directed at children under 16. If you think a child has given us personal data, contact us and we will delete it.' },
    ],
  },
  {
    title: 'Changes to this policy',
    blocks: [
      { p: 'We may update this policy from time to time. When we do, we will update the date at the top of this page.' },
    ],
  },
  {
    title: 'Contact',
    blocks: [
      { p: 'Casuarina Consulting. Email casuarinaconsulting@gmail.com. Web casuarinaconsulting.com.' },
    ],
  },
]

export default function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(ellipse at 15% 0%, rgba(82,183,136,0.10) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 100%, rgba(200,149,42,0.07) 0%, transparent 55%),
        #f5efe6
      `,
    }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(168deg, #205038 0%, #173a2b 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ padding: '52px 22px 22px', position: 'relative' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              color: 'rgba(255,255,255,0.6)', fontSize: 13, background: 'none', border: 'none',
              cursor: 'pointer', padding: 0, fontFamily: "'Oswald', sans-serif", letterSpacing: '0.06em',
              marginBottom: 14,
            }}
          >
            ← Back
          </button>
          <h1 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 26, color: '#fff', margin: 0,
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#95d5b2', fontSize: 13, marginTop: 4 }}>Last updated {UPDATED}</p>
        </div>
        <svg viewBox="0 0 400 44" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 40, marginTop: -1 }}>
          <path d="M0,0 L400,0 L400,44 Q340,14 270,32 Q200,50 130,24 Q70,2 0,28 Z" fill="#173a2b" />
        </svg>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 18px 48px' }}>
        <div style={{
          background: '#fffdf8', border: '1px solid rgba(120,90,40,0.10)',
          boxShadow: '0 10px 26px rgba(95,82,55,0.10), 0 1px 0 rgba(255,255,255,0.7)',
          borderRadius: 18, padding: '22px 22px 8px',
        }}>
          <p style={{ fontSize: 14, color: '#3a4a40', lineHeight: 1.7, margin: '0 0 8px' }}>
            Challenge Tre3 is operated by Casuarina Consulting. This policy explains what personal data we
            collect, why we collect it, and the choices and rights you have. If you have any questions, email{' '}
            <a href="mailto:casuarinaconsulting@gmail.com" style={{ color: '#2d6a4f', fontWeight: 600 }}>casuarinaconsulting@gmail.com</a>.
          </p>

          {SECTIONS.map(section => (
            <div key={section.title} style={{ marginTop: 22 }}>
              <h2 style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 13.5, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#1b4332', margin: '0 0 8px',
              }}>
                {section.title}
              </h2>
              {section.blocks.map((block, i) =>
                'p' in block ? (
                  <p key={i} style={{ fontSize: 14, color: '#3a4a40', lineHeight: 1.7, margin: '0 0 10px' }}>
                    {block.p}
                  </p>
                ) : (
                  <ul key={i} style={{ margin: '0 0 10px', paddingLeft: 20 }}>
                    {block.ul.map((item, j) => (
                      <li key={j} style={{ fontSize: 14, color: '#3a4a40', lineHeight: 1.65, marginBottom: 6 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center', marginTop: 24,
          fontFamily: "'Oswald', sans-serif", fontSize: 12,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,51,40,0.32)',
        }}>
          Casuarina Consulting
        </div>
      </div>
    </div>
  )
}
