import { useState } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useLettersStore } from './letters.store'
import styles from './LetterForm.module.css'

// Helper: get min date (tomorrow)
const getTomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

const PRESETS = [
  { label: '1 week',   days: 7 },
  { label: '1 month',  days: 30 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 180 },
  { label: '1 year',   days: 365 },
]

export default function LetterForm({ onClose }) {
  const user = useAuthStore(s => s.user)
  const addLetter = useLettersStore(s => s.addLetter)

  const [title, setTitle]     = useState('')
  const [content, setContent] = useState('')
  const [unlockDate, setUnlockDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const applyPreset = (days) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    setUnlockDate(d.toISOString().split('T')[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { setError('give your letter a title 🌷'); return }
    if (!content.trim()) { setError('write something first 💌'); return }
    if (!unlockDate) { setError('choose when to unlock it 🔒'); return }

    setLoading(true)
    setError('')

    const { error } = await addLetter({
      user_id: user.id,
      title,
      content,
      unlock_date: new Date(unlockDate).toISOString(),
    })

    if (error) { setError(error.message); setLoading(false) }
    else onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>write a letter 💌</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.section}>
            <label className={styles.label}>letter title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="dear future me..."
              className={styles.input}
              maxLength={80}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>your letter</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="write everything you want your future self to know..."
              className={styles.textarea}
              rows={7}
            />
          </div>

          {/* Unlock date */}
          <div className={styles.section}>
            <label className={styles.label}>unlock date 🔒</label>

            {/* Quick presets */}
            <div className={styles.presets}>
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.days)}
                  className={styles.presetBtn}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <input
              type="date"
              value={unlockDate}
              onChange={e => setUnlockDate(e.target.value)}
              min={getTomorrow()}
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'sealing...' : 'seal & lock 🔒'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}