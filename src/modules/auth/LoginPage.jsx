import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from './auth.store'
import { useTheme, THEMES } from '../../hooks/useTheme'
import styles from './auth.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const signIn = useAuthStore(s => s.signIn)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/home')
    }
  }

  // greeting changes by time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'good morning 🌷'
    if (hour < 17) return 'good afternoon ✨'
    if (hour < 21) return 'good evening 🌙'
    return 'stay up late again? 😴'
  }

  return (
    <div className={styles.page}>
      {/* Theme switcher top right */}
      <div className={styles.themeSwitcher}>
        {THEMES.map(t => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={`${styles.themeBtn} ${theme === t.key ? styles.themeBtnActive : ''}`}
          >
            {t.emoji}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>🌷</span>
          <h1 className={styles.title}>Davi Space</h1>
          <p className={styles.greeting}>{getGreeting()}</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'entering your world...' : 'enter 🌷'}
          </button>
        </form>

        <p className={styles.switchText}>
          new here?{' '}
          <Link to="/signup" className={styles.switchLink}>
            create your space
          </Link>
        </p>
      </div>
    </div>
  )
}