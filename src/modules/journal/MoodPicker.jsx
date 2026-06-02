import styles from './MoodPicker.module.css'

export const MOODS = [
  { key: 'happy',   label: 'happy',   emoji: '😊', color: '#f59e0b' },
  { key: 'sad',     label: 'sad',     emoji: '🥲', color: '#7aaeed' },
  { key: 'calm',    label: 'calm',    emoji: '😌', color: '#6ee7b7' },
  { key: 'sleepy',  label: 'sleepy',  emoji: '😴', color: '#a78bfa' },
  { key: 'angry',   label: 'angry',   emoji: '😤', color: '#f87171' },
  { key: 'anxious', label: 'anxious', emoji: '😰', color: '#fb923c' },
  { key: 'loved',   label: 'loved',   emoji: '🥰', color: '#e8729a' },
  { key: 'bleh',    label: 'bleh',    emoji: '😑', color: '#94a3b8' },
]

export default function MoodPicker({ selected, onSelect }) {
  return (
    <div className={styles.grid}>
      {MOODS.map(mood => (
        <button
          key={mood.key}
          onClick={() => onSelect(mood.key)}
          className={`${styles.moodBtn} ${selected === mood.key ? styles.selected : ''}`}
          style={{
            '--mood-color': mood.color,
            borderColor: selected === mood.key ? mood.color : 'transparent',
            background: selected === mood.key ? mood.color + '22' : 'var(--color-bg)'
          }}
          title={mood.label}
        >
          <span className={styles.emoji}>{mood.emoji}</span>
          <span className={styles.label}>{mood.label}</span>
        </button>
      ))}
    </div>
  )
}