import { useEffect, useState } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useLettersStore } from './letters.store'
import LetterCard from './LetterCard'
import LetterForm from './LetterForm'
import styles from './letters.module.css'

export default function LettersPage() {
  const user = useAuthStore(s => s.user)
  const { letters, loading, loadLetters } = useLettersStore()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (user) loadLetters(user.id)
  }, [user])

  const locked   = letters.filter(l => new Date(l.unlock_date) > new Date())
  const unlocked = letters.filter(l => new Date(l.unlock_date) <= new Date())

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>future letters 💌</h1>
          <p className={styles.sub}>words for the person you're becoming 🌷</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowForm(true)}>
          + write a letter
        </button>
      </div>

      {loading ? (
        <div className={styles.empty}>loading your letters 💌</div>
      ) : letters.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyEmoji}>💌</p>
          <p className={styles.emptyText}>no letters yet</p>
          <p className={styles.emptySub}>write something to your future self 🌷</p>
        </div>
      ) : (
        <>
          {/* Unlocked letters */}
          {unlocked.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>✨ ready to read ({unlocked.length})</h2>
              <div className={styles.grid}>
                {unlocked.map(l => <LetterCard key={l.id} letter={l} />)}
              </div>
            </div>
          )}

          {/* Locked letters */}
          {locked.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🔒 sealed ({locked.length})</h2>
              <div className={styles.grid}>
                {locked.map(l => <LetterCard key={l.id} letter={l} />)}
              </div>
            </div>
          )}
        </>
      )}

      {showForm && <LetterForm onClose={() => setShowForm(false)} />}
    </div>
  )
}