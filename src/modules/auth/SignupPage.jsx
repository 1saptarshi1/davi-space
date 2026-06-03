import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from './auth.store'
import { useTheme, THEMES } from '../../hooks/useTheme'
import styles from './auth.module.css'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = useAuthStore(s => s.signUp)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, username)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/home')
    }
  }

  return (
    <div className={styles.page}>
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

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.header}>
          <span className={styles.logo}>🌷</span>
          <h1 className={styles.title}>Davi Space</h1>
          <p className={styles.greeting}>let's make your world 🌷</p>
        </div>

        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>your name</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="davi"
              className={styles.input}
              required
            />
          </div>

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
              placeholder="at least 6 characters"
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
            {loading ? 'creating your space...' : 'create my space 🌷'}
          </button>
        </form>

        <p className={styles.switchText}>
          already have a space?{' '}
          <Link to="/login" className={styles.switchLink}>
            enter here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}