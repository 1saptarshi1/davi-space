import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../modules/auth/auth.store'

export default function ProtectedRoute({ children }) {
  const user = useAuthStore(s => s.user)
  const loading = useAuthStore(s => s.loading)

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        color: 'var(--color-primary)',
        fontSize: '1.2rem',
        fontFamily: 'Nunito, sans-serif'
      }}>
        loading your world 🌷
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}