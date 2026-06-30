import { useNavigate } from 'react-router-dom'

const UPDATED = '29 June 2026'

type Block = { p: string } | { ul: string[] }
type Section = { title: string; blocks: Block[] }

const SECTIONS: Section[] = [
  {
    title: 'The service',
    blocks: [
      { p: 'Challenge Tre3 gives you daily sustainability challenges, tracks your streaks and badges, and estimates the environmental impact of the actions you complete. It is provided free of charge.' },
    ],
  },
  {
    title: 'Who can use it',
    blocks: [
      { p: 'You must be at least 16 years old to create an account. By signing up, you confirm that you are.' },
    ],
  },
  {
    title: 'Your account',
    blocks: [
      { ul: [
        'Give accurate information when you sign up.',
        'Keep your password secure and do not share your account.',
        'You are responsible for activity that happens under your account.',
        'Email casuarinaconsulting@gmail.com if you think your account has been compromised.',
      ] },
    ],
  },
  {
    title: 'Acceptable use',
    blocks: [
      { p: 'Use the app for its intended purpose. Please do not:' },
      { ul: [
        'Break the law or encourage others to.',
        'Attempt to disrupt, hack, or overload the service.',
        'Copy, resell, or misuse the app or its content.',
        'Submit harmful, abusive, or misleading content through feedback or other inputs.',
      ] },
    ],
  },
  {
    title: 'Impact estimates',
    blocks: [
      { p: 'The CO2, water, waste, and tree-equivalent figures in the app are good-faith estimates based on typical averages. They are for education and motivation, not precise measurements or guarantees. Your real impact varies with your circumstances.' },
    ],
  },
  {
    title: 'Not professional advice',
    blocks: [
      { p: 'Challenge Tre3 offers general sustainability suggestions. It is not professional, legal, financial, or environmental compliance advice.' },
    ],
  },
  {
    title: 'Intellectual property',
    blocks: [
      { p: 'The app, its design, content, and branding are owned by Casuarina Consulting. You may use the app for personal, non-commercial use. You may not copy or reuse it without our permission.' },
    ],
  },
  {
    title: 'Your feedback',
    blocks: [
      { p: 'If you send us feedback or suggestions, you allow us to use them to improve the app, with no obligation to you.' },
    ],
  },
  {
    title: 'Availability and changes',
    blocks: [
      { p: 'We may update, change, or discontinue the app or any feature at any time. We work to keep it running, but we cannot promise it will always be available or error-free.' },
    ],
  },
  {
    title: 'Suspension and termination',
    blocks: [
      { p: 'We may suspend or close accounts that break these terms. You can stop using the app, or ask us to delete your account, at any time.' },
    ],
  },
  {
    title: 'Disclaimers and liability',
    blocks: [
      { p: 'The app is provided as is and as available, without warranties of any kind to the extent the law allows. To the extent the law allows, Casuarina Consulting is not liable for indirect or consequential loss arising from your use of the app. Nothing here limits rights you have as a consumer that cannot be limited by law.' },
    ],
  },
  {
    title: 'Governing law',
    blocks: [
      { p: 'These terms are governed by the laws of Australia, where Casuarina Consulting is based. If you are a consumer in the UK or EEA, you keep the mandatory consumer protections of your country of residence.' },
    ],
  },
  {
    title: 'Changes to these terms',
    blocks: [
      { p: 'We may update these terms. When we do, we will change the date at the top of this page. Continuing to use the app means you accept the updated terms.' },
    ],
  },
  {
    title: 'Contact',
    blocks: [
      { p: 'Casuarina Consulting. Email casuarinaconsulting@gmail.com. Web casuarinaconsulting.com.' },
    ],
  },
]

export default function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(ellipse at 15% 0%, rgba(82,183,136,0.10) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 100%, rgba(200,149,42,0.07) 0%, transparent 55%),
        #f5efe6
      `,
    }}>
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
            Terms of Service
          </h1>
          <p style={{ color: '#95d5b2', fontSize: 13, marginTop: 4 }}>Last updated {UPDATED}</p>
        </div>
        <svg viewBox="0 0 400 44" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 40, marginTop: -1 }}>
          <path d="M0,0 L400,0 L400,44 Q340,14 270,32 Q200,50 130,24 Q70,2 0,28 Z" fill="#173a2b" />
        </svg>
      </div>

      <div style={{ padding: '20px 18px 48px' }}>
        <div style={{
          background: '#fffdf8', border: '1px solid rgba(120,90,40,0.10)',
          boxShadow: '0 10px 26px rgba(95,82,55,0.10), 0 1px 0 rgba(255,255,255,0.7)',
          borderRadius: 18, padding: '22px 22px 8px',
        }}>
          <p style={{ fontSize: 14, color: '#3a4a40', lineHeight: 1.7, margin: '0 0 8px' }}>
            These terms govern your use of Challenge Tre3, operated by Casuarina Consulting. By creating an
            account or using the app, you agree to them. If you do not agree, please do not use the app.
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
