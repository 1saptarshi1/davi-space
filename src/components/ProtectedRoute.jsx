import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../modules/auth/auth.store'

export default function ProtectedRoute({ children }) {
  const user = useAuthStore(s => s.user)
  const loading = useAuthStore(s => s.loading)

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        gap: '16px'
      }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '3rem' }}
        >
          🌷
        </motion.div>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            color: 'var(--color-primary)',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          loading your world...
        </motion.p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}