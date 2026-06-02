import { useState } from 'react'
import { useLettersStore } from './letters.store'
import { useCountdown } from '../../hooks/useCountdown'
import styles from './LetterCard.module.css'

export default function LetterCard({ letter }) {
  const deleteLetter = useLettersStore(s => s.deleteLetter)
  const [isOpen, setIsOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const timeLeft = useCountdown(letter.unlock_date)

  const isLocked = timeLeft !== null

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await deleteLetter(letter.id)
  }

  return (
    <div className={`${styles.card} ${isLocked ? styles.locked : styles.unlocked}`}>

      {/* Top */}
      <div className={styles.top}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>{isLocked ? '🔒' : '💌'}</span>
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{letter.title}</h3>
          <p className={styles.meta}>
            written {formatDate(letter.created_at)}
          </p>
        </div>
      </div>

      {/* Locked state */}
      {isLocked && (
        <div className={styles.lockedBody}>
          <p className={styles.unlockLabel}>unlocks in</p>
          <div className={styles.countdown}>
            {timeLeft.days > 0 && (
              <div className={styles.countUnit}>
                <span className={styles.countNum}>{timeLeft.days}</span>
                <span className={styles.countLabel}>days</span>
              </div>
            )}
            <div className={styles.countUnit}>
              <span className={styles.countNum}>{timeLeft.hours}</span>
              <span className={styles.countLabel}>hrs</span>
            </div>
            <div className={styles.countUnit}>
              <span className={styles.countNum}>{timeLeft.minutes}</span>
              <span className={styles.countLabel}>min</span>
            </div>
          </div>
          <p className={styles.unlockDate}>on {formatDate(letter.unlock_date)}</p>
        </div>
      )}

      {/* Unlocked state */}
      {!isLocked && (
        <div className={styles.unlockedBody}>
          <p className={styles.unlockedBadge}>✨ ready to read</p>

          {isOpen ? (
            <div className={styles.letterContent}>
              <p>{letter.content}</p>
              <button
                className={styles.closeReadBtn}
                onClick={() => setIsOpen(false)}
              >
                close letter
              </button>
            </div>
          ) : (
            <button
              className={styles.readBtn}
              onClick={() => setIsOpen(true)}
            >
              open letter 💌
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <button
          onClick={handleDelete}
          className={`${styles.deleteBtn} ${confirmDelete ? styles.confirm : ''}`}
        >
          {confirmDelete ? 'sure? tap again' : 'delete'}
        </button>
      </div>

    </div>
  )
}