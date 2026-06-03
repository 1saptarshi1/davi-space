import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../modules/auth/auth.store'
import { getRandomMessage, getTimeGreeting } from '../lib/quotes'
import styles from './Dashboard.module.css'
import { motion } from 'framer-motion'

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
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    })
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setInstallPrompt(null)
    })
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setInstallPrompt(null)
  }

  return (
    <div className={styles.page}>

      {/* Welcome card */}
      <motion.div
        className={styles.welcomeCard}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.welcomeLeft}>
          <h1 className={styles.greeting}>{greeting}</h1>
          <p className={styles.date}>{formattedDate}</p>
          <p className={styles.comfortMsg}>✨ {message}</p>
          <button
            onClick={() => navigate('/wrapped')}
            style={{
              marginTop: '8px',
              padding: '8px 18px',
              borderRadius: '20px',
              border: '1.5px solid var(--color-primary)',
              background: 'transparent',
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-main)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              width: 'fit-content'
            }}
          >
            🎁 see your wrapped
          </button>
          {installPrompt && !installed && (
            <button
              onClick={handleInstall}
              style={{
                marginTop: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--color-primary)',
                color: 'white',
                fontFamily: 'var(--font-main)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                width: 'fit-content'
              }}
            >
              📱 install app on phone
            </button>
          )}

          {installed && (
            <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginTop: '8px' }}>
              ✨ app installed!
            </p>
          )}
        </div>
        <div className={styles.welcomeEmoji}>🌷</div>
      </motion.div>

      {/* Section title */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>your space</h2>
        <p className={styles.sectionSub}>where do you want to go today?</p>
      </div>

      {/* Module cards */}
      <div className={styles.grid}>
        {modules.map((mod, index) => (
          <motion.button
            key={mod.path}
            className={styles.moduleCard}
            onClick={() => navigate(mod.path)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
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
          </motion.button>
        ))}
      </div>

    </div>
  )
}