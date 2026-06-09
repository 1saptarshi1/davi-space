import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from './auth.store'
import { useTheme, THEMES } from '../../hooks/useTheme'
import { motion } from 'framer-motion'
import styles from './auth.module.css'

export default function ForgotPage() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const resetPassword = useAuthStore(s => s.resetPassword)
  const { theme, setTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await resetPassword(email)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className={styles.page}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.header}>
            <span className={styles.logo}>💌</span>
            <h1 className={styles.title}>check your email!</h1>
            <p className={styles.greeting}>
              we sent a reset link to <strong>{email}</strong>
            </p>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              marginTop: '8px',
              textAlign: 'center'
            }}>
              click the link in the email to reset your password 🌷
            </p>
          </div>
          <Link
            to="/login"
            className={styles.submitBtn}
            style={{
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block',
              marginTop: '8px'
            }}
          >
            back to login 🌷
          </Link>
        </motion.div>
      </div>
    )
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
          <span className={styles.logo}>🔑</span>
          <h1 className={styles.title}>forgot password?</h1>
          <p className={styles.greeting}>no worries, we'll send a reset link 🌷</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>your email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={styles.input}
              required
              autoFocus
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'sending...' : 'send reset link 🌷'}
          </button>
        </form>

        <p className={styles.switchText}>
          remembered it?{' '}
          <Link to="/login" className={styles.switchLink}>
            go back
          </Link>
        </p>
      </motion.div>
    </div>
  )
}