import { useAuthStore } from '../modules/auth/auth.store'
import { useTheme } from '../hooks/useTheme'

export default function Dashboard() {
  const user = useAuthStore(s => s.user)
  const signOut = useAuthStore(s => s.signOut)
  const { theme, setTheme, THEMES } = useTheme()

  const username = user?.user_metadata?.username || 'davi'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '40px 20px'
    }}>
      <h1 style={{ color: 'var(--color-primary)', fontSize: '2rem' }}>
        welcome back, {username} 🌷
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        your space is ready ✨
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {THEMES.map(t => (
          <button key={t} onClick={() => setTheme(t)} style={{
            padding: '10px 20px',
            borderRadius: '20px',
            border: `2px solid ${theme === t ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: theme === t ? 'var(--color-primary)' : 'var(--color-surface)',
            color: theme === t ? 'white' : 'var(--color-text)',
            cursor: 'pointer',
            fontFamily: 'var(--font-main)',
            fontWeight: 600
          }}>{t}</button>
        ))}
      </div>

      <button onClick={signOut} style={{
        marginTop: '20px',
        padding: '12px 28px',
        borderRadius: '14px',
        border: '1.5px solid var(--color-border)',
        background: 'transparent',
        color: 'var(--color-text-muted)',
        cursor: 'pointer',
        fontFamily: 'var(--font-main)',
        fontSize: '0.9rem'
      }}>
        sign out
      </button>
    </div>
  )
}