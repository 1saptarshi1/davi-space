import { useState } from 'react'
import { useAuthStore } from '../../modules/auth/auth.store'
import { useJournalStore } from './journal.store'
import MoodPicker from './MoodPicker'
import styles from './JournalForm.module.css'

export default function JournalForm({ onClose, editEntry = null }) {
  const user = useAuthStore(s => s.user)
  const { addEntry, updateEntry } = useJournalStore()

  const [title, setTitle]     = useState(editEntry?.title   || '')
  const [content, setContent] = useState(editEntry?.content || '')
  const [mood, setMood]       = useState(editEntry?.mood    || '')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!mood) { setError('pick a mood first 🌷'); return }
    if (!title.trim()) { setError('give it a title 🌷'); return }

    setLoading(true)
    setError('')

    if (editEntry) {
      const { error } = await updateEntry(editEntry.id, { title, content, mood })
      if (error) setError(error.message)
      else onClose()
    } else {
      const { error } = await addEntry({
        user_id: user.id,
        title,
        content,
        mood,
      })
      if (error) setError(error.message)
      else onClose()
    }

    setLoading(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>
            {editEntry ? 'edit entry ✏️' : 'new entry 🌷'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Mood picker */}
          <div className={styles.section}>
            <label className={styles.label}>how are you feeling?</label>
            <MoodPicker selected={mood} onSelect={setMood} />
          </div>

          {/* Title */}
          <div className={styles.section}>
            <label className={styles.label}>title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="give this moment a name..."
              className={styles.input}
              maxLength={80}
            />
          </div>

          {/* Content */}
          <div className={styles.section}>
            <label className={styles.label}>write it out</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="what's on your mind today?..."
              className={styles.textarea}
              rows={5}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'saving...' : editEntry ? 'save changes 🌷' : 'save entry 🌷'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}