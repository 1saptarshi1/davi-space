import { useState } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useMediaStore } from './media.store'
import { detectPlatform, getPlatformInfo } from './media.utils'
import styles from './MediaForm.module.css'

export default function MediaForm({ onClose }) {
  const user = useAuthStore(s => s.user)
  const addItem = useMediaStore(s => s.addItem)

  const [url, setUrl]     = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const detected = url ? detectPlatform(url) : null
  const platformInfo = detected ? getPlatformInfo(detected) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) { setError('paste a link first 🔗'); return }
    if (!title.trim()) { setError('give it a title 🌷'); return }

    setLoading(true)
    setError('')

    const { error } = await addItem(url, { title, tags }, user.id)
    if (error) { setError(error.message); setLoading(false) }
    else onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>save something 🎬</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.section}>
            <label className={styles.label}>paste your link</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className={styles.input}
              autoFocus
            />
            {/* Platform detection badge */}
            {platformInfo && (
              <div className={styles.detected} style={{ color: platformInfo.color }}>
                <span>{platformInfo.emoji}</span>
                <span>{platformInfo.label} detected!</span>
              </div>
            )}
          </div>

          {/* Platform hints */}
          <div className={styles.hints}>
            <span>🎬 YouTube</span>
            <span>🎵 Spotify</span>
            <span>📸 Instagram</span>
            <span>🎧 SoundCloud</span>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="what is this?"
              className={styles.input}
              maxLength={80}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="music, fav, aesthetic"
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'saving...' : 'save 🎬'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}