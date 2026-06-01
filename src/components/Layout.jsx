import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../modules/auth/auth.store'
import { useTheme } from '../hooks/useTheme'
import styles from './Layout.module.css'

const navItems = [
  { icon: '🏠', label: 'home',    path: '/home' },
  { icon: '📖', label: 'journal', path: '/journal' },
  { icon: '🎬', label: 'media',   path: '/media' },
  { icon: '💌', label: 'letters', path: '/letters' },
  { icon: '📸', label: 'memories',path: '/memories' },
  { icon: '🎨', label: 'themes',  path: '/themes' },
]

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const signOut = useAuthStore(s => s.signOut)
  const user = useAuthStore(s => s.user)
  const { theme, setTheme, THEMES } = useTheme()

  const username = user?.user_metadata?.username || 'davi'
  const initial = username[0].toUpperCase()

  const themeIcons = { tulip: '🌷', rainy: '🌧', sleepy: '🌙', sunflower: '🌻' }

  return (
    <div className={styles.root}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>

        {/* Logo */}
        <div className={styles.logo} onClick={() => setCollapsed(!collapsed)}>
          <span className={styles.logoIcon}>🌷</span>
          {!collapsed && <span className={styles.logoText}>Davi Space</span>}
        </div>

        {/* Nav items */}
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

        {/* Theme switcher */}
        {!collapsed && (
          <div className={styles.themePicker}>
            <p className={styles.themeLabel}>theme</p>
            <div className={styles.themeRow}>
              {THEMES.map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`${styles.themeBtn} ${theme === t ? styles.themeBtnActive : ''}`}
                  title={t}
                >
                  {themeIcons[t]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User + signout */}
        <div className={styles.userSection}>
          <div className={styles.avatar}>{initial}</div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{username}</span>
              <button onClick={signOut} className={styles.signOut}>sign out</button>
            </div>
          )}
        </div>

      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}