import { useTheme } from '../hooks/useTheme'

export default function Home() {
  const { theme, setTheme, THEMES } = useTheme()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '40px 20px'
    }}>

      <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>
        🌷 Davi Space
      </h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
        your little world ✨
      </p>

      {/* Theme switcher — temporary, just to test */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {THEMES.map(t => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: `2px solid ${theme === t ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: theme === t ? 'var(--color-primary)' : 'var(--color-surface)',
              color: theme === t ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              fontFamily: 'var(--font-main)',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '12px' }}>
        phase 1 complete 🎉 theme system is alive
      </p>
    </div>
  )
}