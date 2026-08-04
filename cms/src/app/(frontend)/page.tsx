export default function HomePage() {
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173'

  return (
    <main style={{ fontFamily: 'system-ui', padding: 48, maxWidth: 640 }}>
      <h1 style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', margin: 0 }}>
        Nexo Studio CMS
      </h1>
      <p style={{ color: '#6b7280' }}>Payload Admin — light mode, radius 8px.</p>
      <p>
        <a
          href="/admin"
          style={{
            display: 'inline-flex',
            height: 40,
            alignItems: 'center',
            padding: '0 16px',
            borderRadius: 8,
            background: '#0a0a0a',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Abrir admin →
        </a>
      </p>
      <p>
        <a href={`${frontend}/preview`} target="_blank" rel="noreferrer">
          Preview do conteúdo →
        </a>
      </p>
    </main>
  )
}
