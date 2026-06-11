import { useEffect, useState } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
]

export function useKonami() {
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    let sequence = []

    const handler = (e) => {
      sequence.push(e.key)
      sequence = sequence.slice(-KONAMI.length)

      if (sequence.join(',') === KONAMI.join(',')) {
        setActivated(true)
        setTimeout(() => setActivated(false), 5000)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return activated
}