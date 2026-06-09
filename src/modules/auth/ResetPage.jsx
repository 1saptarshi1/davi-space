import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from './auth.store'
import { motion } from 'framer-motion'
import styles from './auth.module.css'

export default function ResetPage() {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const updatePassword = useAuthStore(s => s.updatePassword)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase puts the token in the URL hash
    // The auth state change listener in auth.store handles the session
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('password must be at least 6 characters')
      return
    }

    if (password !== confirm) {
      setError("passwords don't match 🌷")
      return
    }

    setLoading(true)
    const { error } = await updatePassword(password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/home'), 2000)
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={styles.header}>
            <span className={styles.logo}>🌷</span>
            <h1 className={styles.title}>password updated!</h1>
            <p className={styles.greeting}>taking you home... ✨</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.header}>
          <span className={styles.logo}>🔒</span>
          <h1 className={styles.title}>set new password</h1>
          <p className={styles.greeting}>make it something you'll remember 🌷</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>new password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="at least 6 characters"
              className={styles.input}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="same as above"
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
            {loading ? 'updating...' : 'update password 🌷'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}