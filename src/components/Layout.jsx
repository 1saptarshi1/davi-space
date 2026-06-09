import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../modules/auth/auth.store'
import { useTheme, THEMES } from '../hooks/useTheme'
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

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const signOut = useAuthStore(s => s.signOut)
  const user = useAuthStore(s => s.user)
  const { theme, setTheme } = useTheme()

  const username = user?.user_metadata?.username || 'davi'
  const initial = username[0].toUpperCase()

  return (
    <div className={styles.root}>
      {/* Floating particles */}
      <Particles />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>

        <div className={styles.logo} onClick={() => setCollapsed(!collapsed)}>
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
          {/* Avatar — shows photo, google pic, or emoji */}
          <div className={styles.avatarWrap} onClick={() => navigate('/profile')}>
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className={styles.avatarImg}
              />
            ) : user?.user_metadata?.avatar && user.user_metadata.avatar !== '🌷' ? (
              <div className={styles.avatarEmoji}>
                {user.user_metadata.avatar}
              </div>
            ) : (
              <div className={styles.avatarEmoji}>
                {user?.user_metadata?.avatar || initial}
              </div>
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

      {/* Main content with page transitions */}
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  )
}