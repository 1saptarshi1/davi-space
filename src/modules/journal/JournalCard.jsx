import { useState } from 'react'
import { useJournalStore } from './journal.store'
import { MOODS } from './MoodPicker'
import styles from './JournalCard.module.css'
import { motion } from 'framer-motion'

export default function JournalCard({ entry, onEdit }) {
  const deleteEntry = useJournalStore(s => s.deleteEntry)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const mood = MOODS.find(m => m.key === entry.mood)

  const formattedDate = new Date(entry.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await deleteEntry(entry.id)
  }

  return (
    <motion.div
      className={styles.card}
      style={{ '--mood-color': mood?.color || 'var(--color-primary)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
    >

      {/* Mood tag */}
      <div className={styles.moodTag} style={{ background: (mood?.color || '#e8729a') + '22', color: mood?.color || 'var(--color-primary)' }}>
        <span>{mood?.emoji}</span>
        <span>{mood?.label}</span>
      </div>

      <h3 className={styles.title}>{entry.title}</h3>

      {entry.content && (
        <p className={styles.content}>{entry.content}</p>
      )}

      <div className={styles.footer}>
        <span className={styles.date}>{formattedDate}</span>

        <div className={styles.actions}>
          <button onClick={() => onEdit(entry)} className={styles.editBtn}>
            edit
          </button>
          <button
            onClick={handleDelete}
            className={`${styles.deleteBtn} ${confirmDelete ? styles.confirm : ''}`}
          >
            {confirmDelete ? 'sure?' : 'delete'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}