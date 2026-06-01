import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../modules/auth/auth.store'
import { getRandomMessage, getTimeGreeting } from '../lib/quotes'
import styles from './Dashboard.module.css'

const modules = [
  {
    icon: '📖',
    title: 'mood journal',
    desc: 'write how you feel today',
    path: '/journal',
    color: '#e8729a'
  },
  {
    icon: '🎬',
    title: 'media vault',
    desc: 'reels, songs & things you love',
    path: '/media',
    color: '#7aaeed'
  },
  {
    icon: '💌',
    title: 'future letters',
    desc: 'write to your future self',
    path: '/letters',
    color: '#a78bfa'
  },
  {
    icon: '📸',
    title: 'memory wall',
    desc: 'photos & moments that matter',
    path: '/memories',
    color: '#f59e0b'
  },
]

export default function Dashboard() {
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const username = user?.user_metadata?.username || 'davi'

  const [message] = useState(getRandomMessage)
  const [greeting] = useState(() => getTimeGreeting(username))
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  return (
    <div className={styles.page}>

      {/* Welcome card */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeLeft}>
          <h1 className={styles.greeting}>{greeting}</h1>
          <p className={styles.date}>{formattedDate}</p>
          <p className={styles.comfortMsg}>✨ {message}</p>
        </div>
        <div className={styles.welcomeEmoji}>🌷</div>
      </div>

      {/* Section title */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>your space</h2>
        <p className={styles.sectionSub}>where do you want to go today?</p>
      </div>

      {/* Module cards */}
      <div className={styles.grid}>
        {modules.map(mod => (
          <button
            key={mod.path}
            className={styles.moduleCard}
            onClick={() => navigate(mod.path)}
          >
            <div
              className={styles.moduleIcon}
              style={{ background: mod.color + '22', color: mod.color }}
            >
              {mod.icon}
            </div>
            <div className={styles.moduleInfo}>
              <h3 className={styles.moduleTitle}>{mod.title}</h3>
              <p className={styles.moduleDesc}>{mod.desc}</p>
            </div>
            <span className={styles.moduleArrow}>→</span>
          </button>
        ))}
      </div>

    </div>
  )
}