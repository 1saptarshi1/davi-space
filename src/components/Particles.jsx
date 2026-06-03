import { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

const THEME_PARTICLES = {
  tulip:      { emoji: '🌷', count: 12, speed: 0.4 },
  rainy:      { emoji: '💧', count: 18, speed: 0.6 },
  sleepy:     { emoji: '⭐', count: 15, speed: 0.3 },
  sunflower:  { emoji: '✨', count: 12, speed: 0.35 },
  spiderman:  { emoji: '🕸️', count: 10, speed: 0.5 },
}

export default function Particles() {
  const { theme } = useTheme()
  const config = THEME_PARTICLES[theme] || THEME_PARTICLES.tulip

  const particles = Array.from({ length: config.count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    size: 0.8 + Math.random() * 0.8,
  }))

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {particles.map(p => (
        <div
          key={`${theme}-${p.id}`}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-40px',
            fontSize: `${p.size}rem`,
            animation: `floatDown ${p.duration}s ${p.delay}s infinite linear`,
            opacity: 0.35,
          }}
        >
          {config.emoji}
        </div>
      ))}

      <style>{`
        @keyframes floatDown {
          0%   { transform: translateY(-40px) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.35; }
          90%  { opacity: 0.35; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}