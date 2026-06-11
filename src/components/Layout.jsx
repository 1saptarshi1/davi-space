import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../modules/auth/auth.store'
import { useTheme, THEMES } from '../hooks/useTheme'
import { useKonami } from '../hooks/useKonami'
import Particles from './Particles'
import PageTransition from './PageTransition'
import styles from './Layout.module.css'

const navItems = [
  { icon: '🏠', label: 'home',     path: '/home' },
  { icon: '📖', label: 'journal',  path: '/journal' },
  { icon: '🎬', label: 'media',    path: '/media' },
  { icon: '💌', label: 'letters',  path: '/letters' },
  { icon: '📸', label: 'memories', path: '/memories' },
  { icon: '🎨', label: 'themes',   path: '/themes' },
  { icon: '👤', label: 'profile',  path: '/profile' },
]

const bottomNavItems = [
  { icon: '🏠', label: 'home',     path: '/home' },
  { icon: '📖', label: 'journal',  path: '/journal' },
  { icon: '📸', label: 'memories', path: '/memories' },
  { icon: '💌', label: 'letters',  path: '/letters' },
  { icon: '👤', label: 'profile',  path: '/profile' },
]

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const signOut = useAuthStore(s => s.signOut)
  const user = useAuthStore(s => s.user)
  const { theme, setTheme } = useTheme()

  const username = user?.user_metadata?.username || 'davi'
  const photoUrl = user?.user_metadata?.avatar_url || null
  const avatar = user?.user_metadata?.avatar || username[0].toUpperCase()

  // Easter egg: tap logo 5 times
  const [logoTaps, setLogoTaps] = useState(0)
  const [showSecret, setShowSecret] = useState(false)

  const handleLogoTap = () => {
    const newCount = logoTaps + 1
    setLogoTaps(newCount)
    if (newCount === 5) {
      setShowSecret(true)
      setLogoTaps(0)
      setTimeout(() => setShowSecret(false), 4000)
    }
  }

  // Easter egg: konami code
  const konamiActive = useKonami()

  // Easter egg: type "spiderman"
  useEffect(() => {
    let buffer = ''
    const handler = (e) => {
      buffer += e.key.toLowerCase()
      buffer = buffer.slice(-9)
      if (buffer === 'spiderman') {
        setTheme('spiderman')
        buffer = ''
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className={styles.root}>
      <Particles />

      {/* ── Desktop Sidebar ── */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>

        <div
          className={styles.logo}
          onClick={() => { setCollapsed(!collapsed); handleLogoTap() }}
        >
          <span className={styles.logoIcon}>🌷</span>
          {!collapsed && <span className={styles.logoText}>Davi Space</span>}
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.navActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {!collapsed && (
          <div className={styles.themePicker}>
            <p className={styles.themeLabel}>theme</p>
            <div className={styles.themeRow}>
              {THEMES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={`${styles.themeBtn} ${theme === t.key ? styles.themeBtnActive : ''}`}
                  title={t.label}
                >
                  {t.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.userSection}>
          <div className={styles.avatarWrap} onClick={() => navigate('/profile')}>
            {photoUrl ? (
              <img src={photoUrl} alt="avatar" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarEmoji}>{avatar}</div>
            )}
          </div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{username}</span>
              <button onClick={signOut} className={styles.signOut}>sign out</button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className={styles.main}>

        {/* Mobile top bar */}
        <div className={styles.mobileHeader}>
          <span className={styles.mobileLogo} onClick={handleLogoTap}>🌷</span>
          <span className={styles.mobileTitle}>Davi Space</span>
          <div
            className={styles.avatarWrap}
            onClick={() => navigate('/profile')}
            style={{ width: '32px', height: '32px' }}
          >
            {photoUrl ? (
              <img src={photoUrl} alt="avatar" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarEmoji} style={{ fontSize: '1rem' }}>{avatar}</div>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className={styles.bottomNav}>
        {bottomNavItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`${styles.bottomNavItem} ${location.pathname === item.path ? styles.bottomNavActive : ''}`}
          >
            <span className={styles.bottomNavIcon}>{item.icon}</span>
            <span className={styles.bottomNavLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Easter egg: secret message ── */}
      <AnimatePresence>
        {showSecret && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            onClick={() => { navigate('/about'); setShowSecret(false) }}
            style={{
              position: 'fixed',
              bottom: '90px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--color-primary)',
              color: 'white',
              padding: '16px 28px',
              borderRadius: '20px',
              fontFamily: 'var(--font-main)',
              fontWeight: 700,
              fontSize: '0.95rem',
              zIndex: 999,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              textAlign: 'center',
              cursor: 'pointer',
              maxWidth: '90vw'
            }}
          >
            🌷 you found a secret! tap here ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Easter egg: konami code tulip rain ── */}
      {konamiActive && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden'
        }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 1, rotate: 0 }}
              animate={{ y: window.innerHeight + 50, rotate: 360 }}
              transition={{ duration: 2 + Math.random() * 2, ease: 'linear' }}
              style={{ position: 'absolute', fontSize: '2rem' }}
            >
              🌷
            </motion.div>
          ))}
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--color-primary)', color: 'white', padding: '20px 40px',
            borderRadius: '20px', fontFamily: 'var(--font-main)', fontWeight: 700,
            fontSize: '1.2rem', textAlign: 'center'
          }}>
            🎉 you found the secret code! 🌷
          </div>
        </div>
      )}
    </div>
  )
}