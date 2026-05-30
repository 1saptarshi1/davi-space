import { useState, useEffect } from 'react'

const THEMES = ['tulip', 'rainy', 'sleepy', 'sunflower']

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('davi-theme') || 'tulip'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('davi-theme', theme)
  }, [theme])

  return { theme, setTheme, THEMES }
}