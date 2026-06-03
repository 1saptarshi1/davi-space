import { useState, useEffect } from 'react'

export const THEMES = [
  {
    key: 'tulip',
    label: 'Tulip',
    emoji: '🌷',
    desc: 'soft pink & feminine',
    colors: ['#fdf0f5', '#fce4ef', '#d4547a']
  },
  {
    key: 'rainy',
    label: 'Rainy Night',
    emoji: '🌧',
    desc: 'deep dark blue',
    colors: ['#060d1a', '#0c1628', '#4d9de0']
  },
  {
    key: 'sleepy',
    label: 'Sleepy Moon',
    emoji: '🌙',
    desc: 'deep purple midnight',
    colors: ['#09071a', '#110e2e', '#8b5cf6']
  },
  {
    key: 'sunflower',
    label: 'Sunflower',
    emoji: '🌻',
    desc: 'warm golden yellow',
    colors: ['#fdf8e1', '#fef3b0', '#c47f00']
  },
  {
    key: 'spiderman',
    label: 'Spider-Man',
    emoji: '🕷️',
    desc: 'with great power...',
    colors: ['#0a0a0a', '#1a0a0a', '#e63946']
  },
]

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('davi-theme') || 'tulip'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('davi-theme', theme)
  }, [theme])

  // for backward compat — some components use THEMES as array of strings
  const THEME_KEYS = THEMES.map(t => t.key)

  return { theme, setTheme, THEMES, THEME_KEYS }
}