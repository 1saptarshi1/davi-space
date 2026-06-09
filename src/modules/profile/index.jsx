import { useState, useEffect } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useJournalStore } from '../journal/journal.store'
import { updateProfile, fetchStats } from './profile.api'
import { useTheme, THEMES } from '../../hooks/useTheme'
import { calculateStreak, getStreakMessage } from '../../lib/streak'
import { supabase } from '../../lib/supabase'
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
  const { entries, loadEntries } = useJournalStore()

  const [username, setUsername]       = useState(user?.user_metadata?.username || '')
  const [avatar, setAvatar]           = useState(user?.user_metadata?.avatar || '🌷')
  const [stats, setStats]             = useState(null)
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const streak = calculateStreak(entries)
  const streakMsg = getStreakMessage(streak)

  // Current photo URL — google pic or uploaded
  const photoUrl = user?.user_metadata?.avatar_url || null

  useEffect(() => {
    if (user) {
      fetchStats(user.id).then(setStats)
      loadEntries(user.id)
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('photo must be under 2MB 🌷')
      return
    }

    setUploadingPhoto(true)
    setError('')

    const ext = file.name.split('.').pop()
    const path = `avatars/${user.id}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('memories')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploadingPhoto(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('memories')
      .getPublicUrl(path)

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: urlData.publicUrl }
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }

    setUploadingPhoto(false)
  }

  const handleRemovePhoto = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { avatar_url: null }
    })
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const currentTheme = THEMES.find(t => t.key === theme)

  return (
    <div className={styles.page}>

      {/* Profile card */}
      <div className={styles.profileCard}>

        {/* Avatar section */}
        <div className={styles.avatarSection}>

          {/* Big avatar display */}
          <div className={styles.avatarBig}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : (
              avatar
            )}
          </div>

          {/* Upload photo button */}
          <label className={styles.uploadBtn}>
            {uploadingPhoto ? 'uploading... ⏳' : '📷 upload photo'}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </label>

          {/* Remove photo button — only show if photo exists */}
          {photoUrl && (
            <button
              onClick={handleRemovePhoto}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-main)',
                marginTop: '4px'
              }}
            >
              remove photo
            </button>
          )}

          {/* Emoji picker */}
          {!photoUrl && (
            <>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginTop: '8px'
              }}>
                or pick an emoji
              </p>
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
            </>
          )}
        </div>

        {/* Info section */}
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

          {/* Streak stat */}
          <div
            className={styles.statCard}
            style={{ '--stat-color': '#f59e0b' }}
          >
            <span className={styles.statIcon}>
              {streak > 0 ? '🔥' : '💤'}
            </span>
            <span className={styles.statNum} style={{ color: '#f59e0b' }}>
              {streak}
            </span>
            <span className={styles.statLabel}>day streak</span>
            <span style={{
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              marginTop: '2px'
            }}>
              {streakMsg}
            </span>
          </div>
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

      {/* Account */}
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