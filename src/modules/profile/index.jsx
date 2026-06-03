import { useState, useEffect } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { updateProfile, fetchStats } from './profile.api'
import { useTheme, THEMES } from '../../hooks/useTheme'
import styles from './profile.module.css'

const AVATAR_EMOJIS = [
  '🌷', '🌸', '🌻', '🌙', '⭐', '🕷️',
  '🐱', '🦋', '🌈', '✨', '🍓', '🎀',
  '🐰', '🌊', '🍵', '🎵', '💫', '🦄',
]

const MOOD_STATS = [
  { key: 'journals',  label: 'journal entries', icon: '📖', color: '#e8729a' },
  { key: 'memories',  label: 'memories saved',  icon: '📸', color: '#f59e0b' },
  { key: 'letters',   label: 'future letters',  icon: '💌', color: '#a78bfa' },
  { key: 'media',     label: 'media saved',     icon: '🎬', color: '#7aaeed' },
]

export default function ProfilePage() {
  const user = useAuthStore(s => s.user)
  const { theme, setTheme } = useTheme()

  const [username, setUsername] = useState(user?.user_metadata?.username || '')
  const [avatar, setAvatar]     = useState(user?.user_metadata?.avatar || '🌷')
  const [stats, setStats]       = useState(null)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (user) {
      fetchStats(user.id).then(setStats)
    }
  }, [user])

  const handleSave = async () => {
    if (!username.trim()) { setError('name cannot be empty 🌷'); return }
    setSaving(true)
    setError('')

    const { error } = await updateProfile(user.id, { username, avatar })

    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  const currentTheme = THEMES.find(t => t.key === theme)

  return (
    <div className={styles.page}>

      {/* Profile card */}
      <div className={styles.profileCard}>

        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarBig}>{avatar}</div>
          <div className={styles.avatarGrid}>
            {AVATAR_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setAvatar(e)}
                className={`${styles.emojiBtn} ${avatar === e ? styles.emojiActive : ''}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className={styles.infoSection}>
          <div className={styles.field}>
            <label className={styles.label}>your name</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.input}
              maxLength={30}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>email</label>
            <input
              type="text"
              value={user?.email || ''}
              className={styles.input}
              disabled
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>current theme</label>
            <div className={styles.themeDisplay}>
              <span>{currentTheme?.emoji}</span>
              <span>{currentTheme?.label}</span>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            onClick={handleSave}
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? 'saving...' : saved ? 'saved! 🌷' : 'save changes'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>your space in numbers ✨</h2>
        <div className={styles.statsGrid}>
          {MOOD_STATS.map(s => (
            <div
              key={s.key}
              className={styles.statCard}
              style={{ '--stat-color': s.color }}
            >
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statNum}>
                {stats ? stats[s.key] : '...'}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Theme quick switch */}
      <div className={styles.themeSection}>
        <h2 className={styles.sectionTitle}>quick theme switch 🎨</h2>
        <div className={styles.themeRow}>
          {THEMES.map(t => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={`${styles.themeBtn} ${theme === t.key ? styles.themeBtnActive : ''}`}
              style={{ '--t-color': t.colors[2] }}
            >
              <span className={styles.themeBtnEmoji}>{t.emoji}</span>
              <span className={styles.themeBtnLabel}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className={styles.dangerSection}>
        <h2 className={styles.dangerTitle}>account</h2>
        <p className={styles.dangerText}>
          signed in as <strong>{user?.email}</strong>
        </p>
        <button
          onClick={() => useAuthStore.getState().signOut()}
          className={styles.signOutBtn}
        >
          sign out
        </button>
      </div>

    </div>
  )
}