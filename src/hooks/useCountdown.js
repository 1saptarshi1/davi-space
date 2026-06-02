import { useState, useEffect } from 'react'

export function useCountdown(unlockDate) {
  const getTimeLeft = () => {
    const diff = new Date(unlockDate) - new Date()
    if (diff <= 0) return null // unlocked!

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return { days, hours, minutes, diff }
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 60000) // update every minute

    return () => clearInterval(timer)
  }, [unlockDate])

  return timeLeft // null means unlocked
}