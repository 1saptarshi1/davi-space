import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'

import { useAuthStore } from './modules/auth/auth.store'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import LoginPage from './modules/auth/LoginPage'
import SignupPage from './modules/auth/SignupPage'
import Dashboard from './pages/Dashboard'

import JournalPage from './modules/journal/index'

// Placeholder pages for future phases
const ComingSoon = ({ name }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: '60vh', gap: '12px'
  }}>
    <p style={{ fontSize: '3rem' }}>🌷</p>
    <h2 style={{ color: 'var(--color-primary)', fontFamily: 'Nunito, sans-serif' }}>
      {name}
    </h2>
    <p style={{ color: 'var(--color-text-muted)', fontFamily: 'Nunito, sans-serif' }}>
      coming soon ✨
    </p>
  </div>
)

function App() {
  const init = useAuthStore(s => s.init)

  useEffect(() => { init() }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* All protected pages share Layout */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute>
            <Layout><JournalPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/media" element={
          <ProtectedRoute>
            <Layout><ComingSoon name="media vault" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/letters" element={
          <ProtectedRoute>
            <Layout><ComingSoon name="future letters" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/memories" element={
          <ProtectedRoute>
            <Layout><ComingSoon name="memory wall" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/themes" element={
          <ProtectedRoute>
            <Layout><ComingSoon name="themes" /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App